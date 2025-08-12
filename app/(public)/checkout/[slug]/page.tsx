import { notFound } from 'next/navigation';
import { db } from '@/lib/db/db';
import { products, categories } from '@/lib/db/schema';
import { and, eq } from 'drizzle-orm';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Star, Cpu, HardDrive, Zap, Server, MapPin, Tag } from 'lucide-react';
import Dinero from "dinero.js";

export const revalidate = 3600;

interface CheckoutPageProps {
    params: Promise<{
        slug: string;
    }>;
}

async function getProduct(slug: string) {
    try {
        const result = await db.select({
            product: products,
            category: categories,
        })
        .from(products)
        .leftJoin(categories, eq(products.categoryId, categories.id))
        .where(and(
            eq(products.slug, slug),
            eq(products.isActive, true)
        ));
        
        return result[0] || null;
    } catch (error) {
        console.error('Failed to get product:', error);
        return null;
    }
}

function formatSpecs(product: any) {
    const specs = [];
    if (product.ramMb) specs.push({ icon: Server, label: 'RAM', value: `${product.ramMb}MB` });
    if (product.cpuCores) specs.push({ icon: Cpu, label: 'CPU', value: `${product.cpuCores} cores` });
    if (product.diskGb) specs.push({ icon: HardDrive, label: 'Disk', value: `${product.diskGb}GB` });
    if (product.bandwidth) specs.push({ icon: Zap, label: 'Bandwidth', value: `${product.bandwidth}MB` });
    return specs;
}

export default async function CheckoutPage({ params }: CheckoutPageProps) {
    const param = await params;
    const result = await getProduct(param.slug);

    if (!result) {
        notFound();
    }

    const { product, category } = result;
    const specs = formatSpecs(product);

    return (
        <div className="container mx-auto py-8 px-4">
            {/* Header */}
            <div className="mb-8">
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                    <span>{category?.name}</span>
                    <span>/</span>
                    <span>Checkout</span>
                </div>
                <h1 className="text-3xl font-bold tracking-tight">Configure Your Instance</h1>
                <p className="text-muted-foreground mt-2">
                    Set up your {product.name} instance with your preferred configuration.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Side - Configuration Form */}
                <div className="lg:col-span-2">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Tag className="w-5 h-5" />
                                Instance Configuration
                            </CardTitle>
                            <CardDescription>
                                Configure your instance settings and deployment details.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            {/* Instance Name */}
                            <div className="space-y-2">
                                <Label htmlFor="instanceName">Instance Name</Label>
                                <Input 
                                    id="instanceName" 
                                    placeholder="my-awesome-instance" 
                                    className="w-full"
                                />
                                <p className="text-xs text-muted-foreground">
                                    Choose a unique name for your instance (lowercase, hyphens allowed)
                                </p>
                            </div>

                            {/* Instance Location */}
                            <div className="space-y-2">
                                <Label htmlFor="location">Instance Location</Label>
                                <Select>
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Select a location" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="us-east-1">US East (N. Virginia)</SelectItem>
                                        <SelectItem value="us-west-2">US West (Oregon)</SelectItem>
                                        <SelectItem value="eu-west-1">Europe (Ireland)</SelectItem>
                                        <SelectItem value="eu-central-1">Europe (Frankfurt)</SelectItem>
                                        <SelectItem value="ap-southeast-1">Asia Pacific (Singapore)</SelectItem>
                                        <SelectItem value="ap-northeast-1">Asia Pacific (Tokyo)</SelectItem>
                                    </SelectContent>
                                </Select>
                                <p className="text-xs text-muted-foreground">
                                    Choose the region closest to your users for better performance
                                </p>
                            </div>

                            {/* Additional Notes */}
                            <div className="space-y-2">
                                <Label htmlFor="notes">Additional Notes (Optional)</Label>
                                <textarea 
                                    id="notes"
                                    className="w-full min-h-[100px] px-3 py-2 border border-input bg-background rounded-md text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                    placeholder="Any special requirements or notes for your instance..."
                                />
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Right Side - Price Overview */}
                <div className="lg:col-span-1">
                    <Card className="sticky top-8">
                        <CardHeader>
                            <div className="flex items-start justify-between">
                                <div>
                                    <CardTitle className="text-xl">{product.name}</CardTitle>
                                    <CardDescription className="mt-1">
                                        {category?.name}
                                    </CardDescription>
                                </div>
                                {product.isPopular && (
                                    <Badge variant="default" className="flex items-center gap-1">
                                        <Star className="w-3 h-3 fill-current" />
                                        Popular
                                    </Badge>
                                )}
                            </div>
                        </CardHeader>

                        <CardContent className="space-y-6">
                            {/* Product Description */}
                            {product.description && (
                                <p className="text-sm text-muted-foreground">
                                    {product.description}
                                </p>
                            )}

                            {/* Specifications */}
                            {specs.length > 0 && (
                                <div className="space-y-3">
                                    <h4 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">
                                        Specifications
                                    </h4>
                                    <div className="space-y-2">
                                        {specs.map((spec, index) => (
                                            <div key={index} className="flex items-center justify-between text-sm">
                                                <div className="flex items-center gap-2">
                                                    <spec.icon className="w-4 h-4 text-muted-foreground" />
                                                    <span className="text-muted-foreground">{spec.label}</span>
                                                </div>
                                                <span className="font-medium">{spec.value}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            <Separator />

                            {/* Pricing */}
                            <div className="space-y-4">
                                <h4 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">
                                    Pricing
                                </h4>
                                
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm">Hourly Rate</span>
                                        <span className="font-medium">{Dinero({amount: product.pricePerHour, currency: 'EUR'}).toFormat()}/hour</span>
                                    </div>
                                    <div className="flex items-center justify-between text-muted-foreground">
                                        <span className="text-sm">Est. Monthly (730h)</span>
                                        <span className="text-sm">{Dinero({amount: product.pricePerHour, currency: 'EUR'}).multiply(720).toFormat()}</span>
                                    </div>
                                </div>

                                <Separator />

                                <div className="flex items-center justify-between text-lg font-semibold">
                                    <span>Starting at</span>
                                    <span className="text-primary">{Dinero({amount: product.pricePerHour, currency: 'EUR'}).toFormat()}/hour</span>
                                </div>
                            </div>

                            {/* Purchase Button */}
                            <Button className="w-full" size="lg">
                                Deploy Instance
                            </Button>

                            <p className="text-xs text-muted-foreground text-center">
                                You'll only be charged for actual usage. Cancel anytime.
                            </p>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}