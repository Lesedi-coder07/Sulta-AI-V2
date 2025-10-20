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


    return (
        <nav className="py-4 bg-background/95 backdrop-blur-sm border-b border-border">
            <div className="container flex flex-row justify-between items-center">
                <Link href="/">
                    <h1 className="text-2xl">
                        <Image
                            src={systemTheme === 'dark' ? '/logos/Sulta/White.png' : '/logos/Sulta/logoLight.png'}
                            alt="Sulta AI Logo"
                            width={120}
                            height={40}
                            priority
                        />
                    </h1>
                </Link>
                <div className="md:hidden">
                    <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="text-foreground hover:text-primary transition-colors">
                        {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                    </button>
                </div>
                <ul className="md:flex flex-row justify-between gap-8 hidden">
                    {navLinks.map((link) => (
                        <li key={link.title} className="mr-4">
                            <Link href={link.href} className="text-lg font-medium text-foreground hover:text-primary transition-colors">
                                {link.title}
                            </Link>
                        </li>
                    ))}
                </ul>

                <div className="md:flex hidden flex-row justify-end space-x-2">
                    <div className="flex flex-row space-x-2">
                       
                    {loggedIn  ? (<Link href={'/ai/dashboard'}>
                                <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
                                    Go to App
                                </Button>
                            </Link>) : (<><Link href={'/login'}>
                                <Button variant="outline" className="border-border hover:bg-accent">
                                    Login
                                </Button>
                            </Link>
                                <Link href={'/signup'}>
                                    <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
                                        Sign Up
                                    </Button>
                                </Link></>)}
                    </div>

                </div>
            </div>
            {mobileMenuOpen && (
                <div className="md:hidden bg-background/95 backdrop-blur-sm p-4 border-t border-border">
                    <ul className="flex flex-col items-center">
                        {navLinks.map((link) => (
                            <li key={link.title} className="mb-4">
                                <Link href={link.href} className="text-lg font-medium text-foreground hover:text-primary transition-colors">
                                    {link.title}
                                </Link>
                            </li>
                        ))}
                        <div className="flex flex-row space-x-2">

                            {loggedIn === false ? (<Link href={'/ai/dashboard'}>
                                <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
                                    Go to App
                                </Button>
                            </Link>) : (<><Link href={'/login'}>
                                <Button variant="outline" className="border-border hover:bg-accent">
                                    Login
                                </Button>
                            </Link>
                                <Link href={'/signup'}>
                                    <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
                                        Sign Up
                                    </Button>
                                </Link></>)}

                        </div>
                    </ul>
                </div>
            )}
        </nav>
    );
}

export default Navbar;