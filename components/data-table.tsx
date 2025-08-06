'use client';

import {useState, useTransition} from 'react';
import {useRouter, useSearchParams} from 'next/navigation';
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow,} from '@/components/ui/table';
import {Button} from '@/components/ui/button';
import {Input} from '@/components/ui/input';
import {ArrowDown, ArrowUp, ArrowUpDown, ChevronLeft, ChevronRight, Search} from 'lucide-react';

interface DataTableColumn<T> {
    key: string;
    label: string;
    sortable?: boolean;
    render?: (row: T) => React.ReactNode;
}

interface DataTableProps<T> {
    data: T[];
    columns: DataTableColumn<T>[];
    totalCount: number;
    currentPage: number;
    currentSearch: string;
    perPage?: number;
    currentSort?: string;
    currentOrder?: 'asc' | 'desc';
}

export function DataTable<T extends Record<string, any>>({
                                                             data,
                                                             columns,
                                                             totalCount,
                                                             currentPage,
                                                             currentSearch,
                                                             perPage = 15,
                                                             currentSort,
                                                             currentOrder,
                                                         }: DataTableProps<T>) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [isPending, startTransition] = useTransition();
    const [searchValue, setSearchValue] = useState(currentSearch);

    const totalPages = Math.ceil(totalCount / perPage);

    const handleSearch = () => {
        const params = new URLSearchParams(searchParams);
        if (searchValue) {
            params.set('search', searchValue);
        } else {
            params.delete('search');
        }

        // clear page on search
        params.delete('page')

        startTransition(() => {
            router.push(`?${params.toString()}`);
        });
    };

    const handleSort = (column: string) => {
        const params = new URLSearchParams(searchParams);

        if (currentSort === column) {
            params.set('order', currentOrder === 'asc' ? 'desc' : 'asc');
        } else {
            params.set('sort', column);
            params.set('order', 'desc');
        }

        startTransition(() => {
            router.push(`?${params.toString()}`);
        });
    };

    const handlePageChange = (page: number) => {
        const params = new URLSearchParams(searchParams);
        params.set('page', page.toString());
        startTransition(() => {
            router.push(`?${params.toString()}`);
        });
    };

    const getSortIcon = (column: string) => {
        if (currentSort !== column) {
            return <ArrowUpDown className="w-4 h-4"/>;
        }
        return currentOrder === 'asc' ? <ArrowUp className="w-4 h-4"/> : <ArrowDown className="w-4 h-4"/>;
    };

    const formatCellValue = (value: any): string => {
        if (value === null || value === undefined) return '';
        if (value instanceof Date) return value.toLocaleDateString();
        if (typeof value === 'boolean') return value ? 'Yes' : 'No';
        return String(value);
    };

    const renderCellContent = (column: DataTableColumn<T>, row: T) => {
        if (column.render) {
            return column.render(row);
        }
        return formatCellValue(row[column.key]);
    };

    // Check button states
    const canGoPrevious = currentPage > 1 && !isPending;
    const canGoNext = currentPage < totalPages && !isPending;

    return (
        <div className="space-y-4">
            <div className="flex">
                <div className="relative flex-1 max-w-sm">
                    <Input
                        placeholder="Search..."
                        value={searchValue}
                        onChange={(e) => setSearchValue(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                        className="pr-10"
                    />
                    <Button
                        onClick={handleSearch}
                        disabled={isPending}
                        className="absolute right-0 top-0 h-full rounded-l-none"
                    >
                        <Search className="w-4 h-4"/>
                    </Button>
                </div>
            </div>

            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            {columns.map((column) => (
                                <TableHead key={column.key}>
                                    {column.sortable ? (
                                        <Button
                                            variant="ghost"
                                            onClick={() => handleSort(column.key)}
                                            className="h-auto p-0 hover:bg-transparent"
                                            disabled={isPending}
                                        >
                                            {column.label}
                                            {getSortIcon(column.key)}
                                        </Button>
                                    ) : (
                                        column.label
                                    )}
                                </TableHead>
                            ))}
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {data.length === 0 ? (
                            <TableRow>
                                <TableCell
                                    colSpan={columns.length}
                                    className="h-24 text-center text-muted-foreground"
                                >
                                    No results found.
                                </TableCell>
                            </TableRow>
                        ) : (
                            data.map((row, index) => (
                                <TableRow key={row.id || index}>
                                    {columns.map((column) => (
                                        <TableCell key={column.key}>
                                            {renderCellContent(column, row)}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>

            <div className="flex items-center justify-between">
                <div className="text-sm text-muted-foreground">
                    Showing {Math.min((currentPage - 1) * perPage + 1, totalCount)} to {Math.min(currentPage * perPage, totalCount)} of {totalCount} results
                </div>

                <div className="flex items-center space-x-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={!canGoPrevious}
                    >
                        <ChevronLeft className="w-4 h-4"/>
                        Previous
                    </Button>

                    <span className="text-sm">
                        Page {currentPage} of {totalPages}
                    </span>

                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={!canGoNext}
                    >
                        Next
                        <ChevronRight className="w-4 h-4"/>
                    </Button>
                </div>
            </div>
        </div>
    );
}