'use client';

import Link from 'next/link';
import {
    Shield,
    AlertTriangle,
    Settings,
    Users,
    Home,
} from 'lucide-react';

export default function Navbar() {
    return (
        <div className="navbar bg-base-200 border-b border-primary/20 shadow-2xl backdrop-blur-sm">
            <div className="navbar-start">
                <div className="dropdown">
                    <label tabIndex={0} className="btn btn-ghost lg:hidden text-base-content hover:bg-primary/20">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" />
                        </svg>
                    </label>
                    <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow-2xl bg-base-200 rounded-box w-52 border border-primary/20 backdrop-blur-lg">
                        <li>
                            <Link href="/" className="text-base-content hover:bg-primary/20 hover:text-primary">
                                <Home className="h-4 w-4" />
                                Dashboard
                            </Link>
                        </li>
                        <li>
                            <Link href="/accounts" className="text-base-content hover:bg-primary/20 hover:text-primary">
                                <Users className="h-4 w-4" />
                                Cuentas
                            </Link>
                        </li>
                        <li>
                            <Link href="/rules" className="text-base-content hover:bg-primary/20 hover:text-primary">
                                <Settings className="h-4 w-4" />
                                Reglas
                            </Link>
                        </li>
                        <li>
                            <Link href="/incidents" className="text-base-content hover:bg-primary/20 hover:text-primary">
                                <AlertTriangle className="h-4 w-4" />
                                Incidentes
                            </Link>
                        </li>
                    </ul>
                </div>
                <Link href="/" className="btn btn-ghost normal-case text-xl text-base-content hover:bg-primary/20 group">
                    <div className="p-2 bg-primary rounded-lg group-hover:scale-110 transition-transform">
                        <Shield className="h-6 w-6 text-primary-content" />
                    </div>
                    <span className="ml-3 font-bold text-base-content/90">
                        Risk Control
                    </span>
                </Link>
            </div>

            <div className="navbar-end hidden lg:flex">
                <ul className="menu menu-horizontal px-1 space-x-1">
                    <li>
                        <Link
                            href="/"
                            className="flex items-center text-base-content hover:bg-primary/20 hover:text-primary rounded-lg transition-all duration-200"
                        >
                            <div className="p-1.5 bg-primary/10 rounded-md mr-2">
                                <Home className="h-4 w-4" />
                            </div>
                            Dashboard
                        </Link>
                    </li>
                    <li>
                        <Link
                            href="/accounts"
                            className="flex items-center text-base-content hover:bg-primary/20 hover:text-primary rounded-lg transition-all duration-200"
                        >
                            <div className="p-1.5 bg-secondary/10 rounded-md mr-2">
                                <Users className="h-4 w-4" />
                            </div>
                            Cuentas
                        </Link>
                    </li>
                    <li>
                        <Link
                            href="/rules"
                            className="flex items-center text-base-content hover:bg-primary/20 hover:text-primary rounded-lg transition-all duration-200"
                        >
                            <div className="p-1.5 bg-accent/10 rounded-md mr-2">
                                <Settings className="h-4 w-4" />
                            </div>
                            Reglas
                        </Link>
                    </li>
                    <li>
                        <Link
                            href="/incidents"
                            className="flex items-center text-base-content hover:bg-primary/20 hover:text-primary rounded-lg transition-all duration-200"
                        >
                            <div className="p-1.5 bg-warning/10 rounded-md mr-2">
                                <AlertTriangle className="h-4 w-4" />
                            </div>
                            Incidentes
                        </Link>
                    </li>
                </ul>
            </div>
        </div>
    );
}