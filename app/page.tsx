import Link from 'next/link';
import { db } from '@/lib/db/db';
import { categories, products } from '@/lib/db/schema';
import { and, eq, isNull } from 'drizzle-orm';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Star, ArrowRight, Store, Sparkles, Zap, Shield, Clock, HardDrive, Cpu, Activity, Globe, Users, Award, CheckCircle } from 'lucide-react';

async function getRootCategories() {
    try {
        return await db.select()
            .from(categories)
            .where(and(
                isNull(categories.parentId),
                eq(categories.isActive, true)
            ))
            .orderBy(categories.sortOrder, categories.name);
    } catch (error) {
        console.error('Failed to get root categories:', error);
        return [];
    }
}

async function getFeaturedProducts() {
    try {
        return await db.select()
            .from(products)
            .where(and(
                eq(products.isActive, true),
                eq(products.isPopular, true)
            ))
            .orderBy(products.sortOrder, products.name)
            .limit(6);
    } catch (error) {
        console.error('Failed to get featured products:', error);
        return [];
    }
}

export default async function Home() {
    const [rootCategories, featuredProducts] = await Promise.all([
        getRootCategories(),
        getFeaturedProducts()
    ]);

    return (
        <div className="min-h-screen bg-background">
            {/* Hero Section */}
            <section className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-background to-secondary/5">
                <div className="absolute inset-0 bg-grid-pattern opacity-5" />
                <div className="relative container mx-auto px-4 py-24 lg:py-32">
                    <div className="max-w-4xl mx-auto text-center">
                        <div className="flex justify-center mb-6">
                            <Badge variant="secondary" className="px-4 py-2 text-sm font-medium">
                                <Sparkles className="w-4 h-4 mr-2" />
                                Premium Hosting Solutions
                            </Badge>
                        </div>

                        <h1 className="text-4xl lg:text-6xl font-bold tracking-tight mb-6">
                            Welcome to{' '}
                            <span className="text-primary bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
                                HostGoblin
                            </span>
                        </h1>

                        <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
                            Unleash the power of premium hosting with lightning-fast performance,
                            unbeatable reliability, and world-class support. Your digital journey starts here.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                            <Button size="lg" className="px-8 py-3 text-lg" asChild>
                                <a href="#categories">
                                    <Store className="w-5 h-5 mr-2"/>
                                    Browse Hosting Plans
                                </a>
                            </Button>
                        </div>

                        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-3xl mx-auto">
                            <div className="flex items-center justify-center space-x-3 text-sm text-muted-foreground">
                                <Zap className="w-5 h-5 text-primary" />
                                <span>99.9% Uptime</span>
                            </div>
                            <div className="flex items-center justify-center space-x-3 text-sm text-muted-foreground">
                                <Shield className="w-5 h-5 text-primary" />
                                <span>Enterprise Security</span>
                            </div>
                            <div className="flex items-center justify-center space-x-3 text-sm text-muted-foreground">
                                <Clock className="w-5 h-5 text-primary" />
                                <span>24/7 Support</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Categories Section */}
            {rootCategories.length > 0 && (
                <section id={'categories'} className="py-20 bg-secondary/5">
                    <div className="container mx-auto px-4">
                        <div className="text-center mb-16">
                            <h2 className="text-3xl lg:text-4xl font-bold mb-4">
                                Choose Your Perfect Hosting Solution
                            </h2>
                            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                                From shared hosting to dedicated servers, we have the perfect solution
                                to power your digital presence.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {rootCategories.map((category) => (
                                <Link key={category.id} href={`/categories/${category.slug}`}>
                                    <Card className="h-full hover:shadow-xl transition-all duration-300 hover:scale-105 border-0 bg-card/50 backdrop-blur-sm">
                                        <CardHeader className="text-center pb-4">
                                            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                                                {category.icon ? (
                                                    <span className="text-2xl">{category.icon}</span>
                                                ) : (
                                                    <Store className="w-8 h-8 text-primary" />
                                                )}
                                            </div>
                                            <CardTitle className="text-xl">{category.name}</CardTitle>
                                        </CardHeader>
                                        <CardContent className="text-center">
                                            <CardDescription className="mb-6 leading-relaxed">
                                                {category.description || `Explore our ${category.name.toLowerCase()} hosting solutions`}
                                            </CardDescription>
                                            <Button variant="outline" className="w-full">
                                                Explore Plans
                                                <ArrowRight className="w-4 h-4 ml-2" />
                                            </Button>
                                        </CardContent>
                                    </Card>
                                </Link>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* Featured Products Section */}
            {featuredProducts.length > 0 && (
                <section className="py-20">
                    <div className="container mx-auto px-4">
                        <div className="text-center mb-16">
                            <Badge variant="secondary" className="mb-4">
                                <Star className="w-4 h-4 mr-2" />
                                Most Popular
                            </Badge>
                            <h2 className="text-3xl lg:text-4xl font-bold mb-4">
                                Featured Hosting Plans
                            </h2>
                            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                                Hand-picked hosting solutions that deliver exceptional performance
                                and value for businesses of all sizes.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {featuredProducts.map((product) => (
                                <Card key={product.id} className="relative hover:shadow-xl transition-all duration-300 border-2 hover:border-primary/20">
                                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                                        <Badge className="bg-primary text-primary-foreground">
                                            <Star className="w-3 h-3 mr-1" />
                                            Popular
                                        </Badge>
                                    </div>

                                    <CardHeader className="pb-4">
                                        <CardTitle className="text-xl">{product.name}</CardTitle>
                                        <div className="flex items-baseline space-x-2">
                                            <span className="text-3xl font-bold text-primary">
                                                ${product.pricePerHour.toFixed(3)}
                                            </span>
                                            <span className="text-muted-foreground">/hour</span>
                                        </div>
                                    </CardHeader>

                                    <CardContent className="space-y-4">
                                        {product.description && (
                                            <p className="text-sm text-muted-foreground leading-relaxed">
                                                {product.description}
                                            </p>
                                        )}

                                        <div className="space-y-3">
                                            {product.ramMb && (
                                                <div className="flex items-center space-x-3 text-sm">
                                                    <Activity className="w-4 h-4 text-primary" />
                                                    <span>{product.ramMb}MB RAM</span>
                                                </div>
                                            )}

                                            {product.cpuCores && (
                                                <div className="flex items-center space-x-3 text-sm">
                                                    <Cpu className="w-4 h-4 text-primary" />
                                                    <span>{product.cpuCores} CPU Core{product.cpuCores !== 1 ? 's' : ''}</span>
                                                </div>
                                            )}

                                            {product.diskGb && (
                                                <div className="flex items-center space-x-3 text-sm">
                                                    <HardDrive className="w-4 h-4 text-primary" />
                                                    <span>{product.diskGb}GB Storage</span>
                                                </div>
                                            )}

                                            {product.bandwidth && (
                                                <div className="flex items-center space-x-3 text-sm">
                                                    <Globe className="w-4 h-4 text-primary" />
                                                    <span>{product.bandwidth}GB Bandwidth</span>
                                                </div>
                                            )}
                                        </div>

                                        <Separator className="my-4" />

                                        <Link href={`/products/${product.slug}`}>
                                            <Button className="w-full">
                                                Choose Plan
                                                <ArrowRight className="w-4 h-4 ml-2" />
                                            </Button>
                                        </Link>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* Features Section */}
            <section className="py-20 bg-secondary/5">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl lg:text-4xl font-bold mb-4">
                            Why Choose HostGoblin?
                        </h2>
                        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                            Experience the difference with our premium features designed
                            to keep your websites running at peak performance.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        <div className="text-center p-6">
                            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                                <Zap className="w-8 h-8 text-primary" />
                            </div>
                            <h3 className="text-xl font-semibold mb-3">Lightning Fast</h3>
                            <p className="text-muted-foreground">
                                SSD storage and optimized servers ensure your websites load in milliseconds.
                            </p>
                        </div>

                        <div className="text-center p-6">
                            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                                <Shield className="w-8 h-8 text-primary" />
                            </div>
                            <h3 className="text-xl font-semibold mb-3">Secure & Reliable</h3>
                            <p className="text-muted-foreground">
                                Advanced security measures and 99.9% uptime guarantee keep you protected.
                            </p>
                        </div>

                        <div className="text-center p-6">
                            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                                <Users className="w-8 h-8 text-primary" />
                            </div>
                            <h3 className="text-xl font-semibold mb-3">Expert Support</h3>
                            <p className="text-muted-foreground">
                                Our dedicated team is available 24/7 to help you succeed online.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-background border-t">
                <div className="container mx-auto px-4 py-16">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {/* Company Info */}
                        <div className="lg:col-span-2">
                            <div className="flex items-center space-x-2 mb-4">
                                <Store className="w-8 h-8 text-primary" />
                                <span className="text-2xl font-bold">HostGoblin</span>
                            </div>
                            <p className="text-muted-foreground mb-6 max-w-md leading-relaxed">
                                Empowering businesses worldwide with reliable, fast, and secure hosting solutions.
                                Your digital success is our mission.
                            </p>
                            <div className="flex space-x-2">
                                <Badge variant="secondary">
                                    <Award className="w-3 h-3 mr-1" />
                                    99.9% Uptime
                                </Badge>
                                <Badge variant="secondary">
                                    <CheckCircle className="w-3 h-3 mr-1" />
                                    24/7 Support
                                </Badge>
                            </div>
                        </div>

                        {/* Quick Links */}
                        <div>
                            <h3 className="font-semibold mb-4">Quick Links</h3>
                            <ul className="space-y-2 text-sm text-muted-foreground">
                                <li><Link href="/pricing" className="hover:text-primary transition-colors">Pricing</Link></li>
                                <li><Link href="/features" className="hover:text-primary transition-colors">Features</Link></li>
                                <li><Link href="/support" className="hover:text-primary transition-colors">Support</Link></li>
                                <li><Link href="/about" className="hover:text-primary transition-colors">About Us</Link></li>
                            </ul>
                        </div>

                        {/* Support */}
                        <div>
                            <h3 className="font-semibold mb-4">Support</h3>
                            <ul className="space-y-2 text-sm text-muted-foreground">
                                <li><Link href="/contact" className="hover:text-primary transition-colors">Contact Us</Link></li>
                                <li><Link href="/docs" className="hover:text-primary transition-colors">Documentation</Link></li>
                                <li><Link href="/status" className="hover:text-primary transition-colors">Status Page</Link></li>
                                <li><Link href="/community" className="hover:text-primary transition-colors">Community</Link></li>
                            </ul>
                        </div>
                    </div>

                    <Separator className="my-8" />

                    <div className="flex flex-col md:flex-row justify-between items-center text-sm text-muted-foreground">
                        <p>&copy; 2024 HostGoblin. All rights reserved.</p>
                        <div className="flex space-x-4 mt-4 md:mt-0">
                            <Link href="/privacy" className="hover:text-primary transition-colors">Privacy Policy</Link>
                            <Link href="/terms" className="hover:text-primary transition-colors">Terms of Service</Link>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}