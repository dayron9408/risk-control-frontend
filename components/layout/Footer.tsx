'use client';

import { Shield } from 'lucide-react';

export default function Footer() {
    return (
        <footer className="footer footer-center p-6 bg-base-200 text-base-content/80 border-t border-primary/20 backdrop-blur-sm">
            <div className="flex flex-col items-center">
                <div className="flex items-center mb-2">
                    <div className="p-1.5 bg-primary rounded-md mr-2">
                        <Shield className="h-4 w-4 text-primary-content" />
                    </div>
                    <span className="font-bold text-base-content/90">
                        Risk Control System
                    </span>
                    <p className="text-sm pl-2">© {new Date().getFullYear()}</p>
                </div>
            </div>
        </footer>
    );
}