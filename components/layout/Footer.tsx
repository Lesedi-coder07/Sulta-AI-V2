import {footerLinks} from "@/data/footerLinks";
import Link from "next/link";
import {Button} from "@/components/ui/button";

const Footer = () => {
    return (
        <footer className="pt-10">
            <div className="max-w-screen-xl mx-auto px-4 md:px-8">
                <div className="space-y-6 sm:max-w-md sm:mx-auto sm:text-center">
                    <p>
                       Sulta AI is a platform built by the Team at Sulta Tech to help you create your own AI Agents.
                    </p>
                    <div className="items-center gap-x-3 space-y-3 sm:flex sm:justify-center sm:space-y-0">
                        <Link href={"/auth/login"}>
                        <Button>
                            Get started
                        </Button>
                        </Link>
                   
                        <Button variant="secondary">
                            Learn more
                        </Button>
                    </div>
                </div>
                <div className="mt-10 py-10 border-t items-center justify-between sm:flex">
                    <p>© 2024 Sulta Tech. All rights reserved.</p>
                    <ul className="flex flex-wrap items-center gap-4 mt-6 sm:text-sm sm:mt-0">
                        {footerLinks.map((item) => (
                            <li key={item.label}>
                                <Link href={item.href}>
                                    {item.label}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </footer>
    )
}

export default Footer;