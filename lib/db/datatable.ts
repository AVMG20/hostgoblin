import { db } from '@/lib/db/db';
import { desc, asc, like, or, count, and } from 'drizzle-orm';
import type { PgTable } from "drizzle-orm/pg-core/table";

// Simple and clean type for column names
type TableColumns<T extends PgTable> = keyof T['_']['columns'];

export interface QueryIndexParams<TTable extends PgTable> {
    page?: number;
    search?: string;
    sort?: string;
    order?: 'asc' | 'desc';
    perPage?: number;
    searchableColumns?: Array<TableColumns<TTable>>;
    defaultSort?: TableColumns<TTable>;
}

export interface PageProps {
    searchParams: Promise<{
        page?: string; search?: string; sort?: string; order?: 'asc' | 'desc';
    }>;
}

export async function parseSearchParams(searchParams:  Promise<{
    page?: string
    search?: string
    sort?: string
    order?: "asc" | "desc"
}>): Promise<{ page: number; search: string; sort?: string; order: 'asc' | 'desc'; }> {
    const params = await searchParams;
    const page = parseInt(params.page || '1');
    const search = params.search || '';
    const sort = params.sort;
    const order = (params.order === 'asc' || params.order === 'desc') ? params.order : 'desc';

    return { page, search, sort, order };
}

export async function queryIndex<TTable extends PgTable>(table: TTable, params: QueryIndexParams<TTable> = {}): Promise<[Array<TTable['$inferSelect']>, number]> {
    const {
        page = 1,
        search,
        sort,
        order = 'desc',
        perPage = 15,
        searchableColumns = [],
        defaultSort
    } = params;

    const offset = (page - 1) * perPage;
    const availableColumns = Object.keys(table);

    // Build the base where conditions for both queries
    let whereConditions = [];
    if (search && searchableColumns.length > 0) {
        // Filter searchable columns to only include existing ones
        const validSearchableColumns = searchableColumns.filter(col =>
            availableColumns.includes(col as string)
        );

        if (validSearchableColumns.length > 0) {
            const searchConditions = validSearchableColumns.map(col =>
                // @ts-ignore
                like(table[col], `%${search}%`)
            );
            whereConditions.push(or(...searchConditions));
        }
    }

    // Build the data query
    // @ts-ignore
    let dataQuery = db.select().from(table);
    if (whereConditions.length > 0) {
        // @ts-ignore
        dataQuery = dataQuery.where(and(...whereConditions));
    }

    // Apply sorting with column validation
    if (sort && availableColumns.includes(sort)) {
        const column = table[sort as keyof typeof table];
        // @ts-ignore
        dataQuery = dataQuery.orderBy(order === 'desc' ? desc(column) : asc(column));
    } else if (defaultSort && availableColumns.includes(defaultSort as string)) {
        // @ts-ignore
        const column = table[defaultSort];
        // @ts-ignore
        dataQuery = dataQuery.orderBy(desc(column));
    }

    // @ts-ignore
    dataQuery = dataQuery.limit(perPage).offset(offset);

    // Build the count query
    // @ts-ignore
    let countQuery = db.select({ count: count() }).from(table);
    if (whereConditions.length > 0) {
        // @ts-ignore
        countQuery = countQuery.where(and(...whereConditions));
    }

    // Execute both queries in parallel
    const [data, countResult] = await Promise.all([
        dataQuery,
        countQuery
    ]);

    return [data, countResult[0].count];
}