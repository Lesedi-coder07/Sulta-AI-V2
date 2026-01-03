'use client'
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { navLinks } from "@/data/navLinks";
import { ThemeChanger } from "@/app/Theme-changer";
import { useTheme } from "next-themes";
import Image from "next/image";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { auth } from "@/app/api/firebase/firebaseConfig";
import { onAuthStateChanged } from "firebase/auth";

const Navbar = () => {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [loggedIn, setLoggedIn] = useState<boolean>(false);
    const { resolvedTheme, theme, systemTheme, setTheme } = useTheme();
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                setLoggedIn(true);
            } else {
                setLoggedIn(false);
            }
        })
        return () => unsubscribe()
    }, []);


    useEffect(()=> {
        if (systemTheme) {
           setTheme(systemTheme)
        }
        
    }, [ systemTheme])

    // Add scroll effect
    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);


    return (
        <nav className={`transition-all duration-300 ${
            scrolled 
                ? 'sticky top-0 z-50 py-0 bg-white/90 dark:bg-neutral-900/90 backdrop-blur-xl border-b border-neutral-200 dark:border-neutral-800 shadow-lg shadow-blue-500/5 dark:shadow-blue-500/10' 
                : 'relative py-0 bg-transparent border-b border-transparent'
        }`}>
            <div className="container flex flex-row justify-between items-center">
                <Link href="/" className="flex items-center transition-transform hover:scale-105">
                    <Image
                        src={systemTheme === 'dark' ? '/logos/Sulta/White.png' : '/logos/Sulta/logoLight.png'}
                        alt="Sulta AI Logo"
                        width={120}
                        height={40}
                        priority
                    />
                </Link>

                {/* Mobile Menu Button */}
                <div className="md:hidden flex items-center gap-2">
                    <button 
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)} 
                        className="p-2 text-neutral-700 dark:text-neutral-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800"
                    >
                        {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                    </button>
                </div>

                {/* Desktop Navigation */}
                <ul className="md:flex flex-row justify-between gap-8 hidden">
                    {navLinks.map((link) => (
                        <li key={link.title}>
                            <Link 
                                href={link.href} 
                                className="text-base font-medium text-neutral-700 dark:text-neutral-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors relative group"
                            >
                                {link.title}
                                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-600 to-blue-400 group-hover:w-full transition-all duration-300" />
                            </Link>
                        </li>
                    ))}
                </ul>

                {/* Desktop Auth Buttons */}
                <div className="md:flex hidden flex-row items-center gap-3">
                    {loggedIn ? (
                        <Link href="/dashboard">
                            <Button className={"bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 rounded-full px-6 transition-all hover:scale-105"}>
                                Go to Dashboard
                            </Button>
                        </Link>
                    ) : (
                        <>
                            <Link href='/login'>
                                <Button 
                                    variant="ghost" 
                                    className="text-neutral-700 dark:text-neutral-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/30 rounded-full px-6 transition-all"
                                >
                                    Login
                                </Button>
                            </Link>
                            <Link href='/signup'>
                                <Button className="bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 rounded-full px-6 transition-all hover:scale-105">
                                    Sign Up
                                </Button>
                            </Link>
                        </>
                    )}
                </div>
            </div>

            {/* Mobile Menu */}
            {mobileMenuOpen && (
                <div className="md:hidden absolute top-full left-0 right-0 bg-white dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-800 shadow-xl">
                    <div className="container py-6">
                        <ul className="flex flex-col space-y-4 mb-6">
                            {navLinks.map((link) => (
                                <li key={link.title}>
                                    <Link 
                                        href={link.href} 
                                        className="block text-lg font-medium text-neutral-700 dark:text-neutral-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors py-2"
                                        onClick={() => setMobileMenuOpen(false)}
                                    >
                                        {link.title}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                        <div className="flex flex-col space-y-3">
                            {loggedIn ? (
                                <Link href="/dashboard">
                                    <Button className="w-full bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white shadow-lg shadow-blue-500/30 rounded-full">
                                        Go to Dashboard
                                    </Button>
                                </Link>
                            ) : (
                                <>
                                    <Link href='/login'>
                                        <Button 
                                            variant="outline" 
                                            className="w-full border-2 border-neutral-300 dark:border-neutral-700 hover:border-blue-600 dark:hover:border-blue-500 rounded-full"
                                        >
                                            Login
                                        </Button>
                                    </Link>
                                    <Link href='/signup'>
                                        <Button className="w-full bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white shadow-lg shadow-blue-500/30 rounded-full">
                                            Sign Up
                                        </Button>
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </nav>
    );
}

export default Navbar;
