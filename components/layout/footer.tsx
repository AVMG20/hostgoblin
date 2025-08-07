import Link from "next/link";
import { Separator } from "../ui/separator";
import { Badge } from "../ui/badge";
import {Award, CheckCircle, Store} from "lucide-react";

export default function Footer() {
    return <footer className="bg-background border-t">
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
}