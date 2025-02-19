'use client'
import Link from "next/link";
import {Button} from "@/components/ui/button";
import {navLinks} from "@/data/navLinks";
import {ThemeChanger} from "@/app/Theme-changer";
import { useTheme } from "next-themes";
import Image from "next/image";
import { useState } from "react";
import { Menu, X } from "lucide-react";

const Navbar = () => {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const { resolvedTheme } = useTheme();

    return (
        <nav className="py-4 bg-background/30 backdrop-blur-sm">
            <div className="container flex flex-row justify-between items-center">
                <Link href="/">
                    <h1 className="text-2xl">
                        <Image
                            src={'/logos/Sulta/logoLight.png'}
                            alt="Sulta AI Logo"
                            width={120}
                            height={40}
                            priority
                        />
                    </h1>
                </Link>
                <div className="md:hidden">
                    <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
                        {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                    </button>
                </div>
                <ul className="md:flex flex-row justify-between gap-8 hidden">
                    {navLinks.map((link) => (
                        <li key={link.title} className="mr-4">
                            <Link href={link.href} className="text-lg font-medium text-neutral-800 dark:text-neutral-200 hover:text-blue-600">
                                {link.title}
                            </Link>
                        </li>
                    ))}
                </ul>

                <div className="md:flex hidden flex-row justify-end space-x-2">
                    <div className="flex flex-row space-x-2">
                        <Link href={'/login'}>
                        <Button>
                            Login
                        </Button>
                        </Link>
                        <Link href={'/signup'}>
                        <Button variant="default" className="border-black border-solid border border-1 shadow-md bg-blue-700 text-white rounded-sm">
                            Sign Up
                        </Button>
                        </Link>
                    </div>
                  
                </div>
            </div>
            {mobileMenuOpen && (
                <div className="md:hidden bg-background/30 backdrop-blur-sm p-4">
                    <ul className="flex flex-col items-center">
                        {navLinks.map((link) => (
                            <li key={link.title} className="mb-4">
                                <Link href={link.href} className="text-lg font-medium text-neutral-800 dark:text-neutral-200 hover:text-blue-600">
                                    {link.title}
                                </Link>
                            </li>
                        ))}
                        <div className="flex flex-row space-x-2">
                            <Link href={'/login'}>
                            <Button>
                                Login
                            </Button>
                            </Link>
                            <Link href={'/signup'}>
                            <Button variant="default" className="border-black border-solid border border-1 shadow-md bg-blue-700 text-white rounded-sm">
                                Sign Up
                            </Button>
                            </Link>
                        </div>
                    </ul>
                </div>
            )}
        </nav>
    );
}

export default Navbar;