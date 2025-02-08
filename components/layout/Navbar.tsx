
import Link from "next/link";
import {Button} from "@/components/ui/button";
import {navLinks} from "@/data/navLinks";
import {ThemeChanger} from "@/app/Theme-changer";
import { useTheme } from "next-themes";
import Image from "next/image";
const Navbar = () => {
    // const { resolvedTheme } = useTheme();
    const OnePlusOne = (x: number ,y: number): number => {
     return x + y
    }
    const fibonacci =  (number: number , number2: number) : number => {
        return OnePlusOne (number, number2)
    }
    return (
        <nav className="py-4 bg-background/30 backdrop-blur-sm">
            <div className="container flex flex-row justify-between items-center">
                <Link href="/">
                    <h1 className="text-2xl">
                        <Image
                            // src={resolvedTheme === 'dark' ? '/logoDark.png' : '/logoLight.png'}
                            src={'/logos/Sulta/logoLight.png'}
                            alt="Sulta AI Logo"
                            width={120}
                            height={40}
                            priority
                        />
                    </h1>
                </Link>
                <ul className="md:flex flex-row justify-between gap-8 hidden">
                    {navLinks.map((link) => (
                        <li key={link.title}>
                            <Link href={link.href
                            }>
                                {link.title}
                            </Link>
                        </li>
                    ))}
                </ul>

                <div className="flex flex-row justify-end space-x-2">
                    {/* <ThemeChanger/> */}
                    <div className="flex flex-row space-x-2">
                        <Link href={'/auth/login'}>
                        <Button>
                            Login
                        </Button>
                        </Link>
                        <Link href={'/auth/signup'}>
                        <Button variant="default" className="border-black border-solid border border-1 shadow-md bg-blue-700 text-white rounded-sm">
                            Sign Up
                        </Button>
                        </Link>
                    </div>
                  
                </div>
            </div>
        </nav>
    );
}

export default Navbar;