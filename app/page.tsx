import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { ArrowRightIcon } from "@radix-ui/react-icons";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { features } from "@/data/features";

import Navbar from "@/components/layout/Navbar";

import Footer from "@/components/layout/Footer";
import { GradientText } from "@/components/ui/gradient-text";
// import { tiers } from "./pricing/pricing";

import PricingSection from "@/components/Sections/Pricing-Section";

import { Metadata } from "next";


export const metadata: Metadata = {
  title: "Sulta AI - Your Personal AI Workforce Revolution",
  description: "Transform Your Productivity: Build Custom AI Agents in Minutes, No Coding Required",
  icons: {
    icon: "/favicon.png",
    shortcut: { url: "/favicon.png" }
  },
  openGraph: {
    images: [
      {
        url: '/ai-hero.jpg',
        width: 1200,
        height: 800,
        alt: 'Sulta AI - Custom AI Agents',
      }
    ],
  },
  twitter: {
    card: 'summary_large_image', 
    images: ['/ai-hero.jpg'],
    description: "Unleash the Power of AI: Create Custom AI Agents That Work for You 24/7",
  }
};


export default function Home() {

   
  return (
      <div className="overflow-y-auto">
           
            <Navbar />
            <div className="border-b border-border ">
                <main className="container mx-auto">
                    <div className="relative md:mt-24 mx-auto w-full max-w-4xl pt-4 text-center">
                        <div className="justify-center hidden md:flex">
                            <div
                                className="flex flex-row items-center justify-center gap-5 p-1 text-xs bg-card/60 backdrop-blur-lg rounded-md border border-border">
                                <Badge className="font-semibold">New</Badge>
                                <h5>Create Custom AI Agents in Minutes</h5>
                                <Link href="/chat" className="flex flex-row items-center">
                                    Explore Agents
                                    <ArrowRightIcon className="w-6 h-6 ml-2" />
                                </Link>
                            </div>
                        </div>
                        <h1 className="md:text-7xl my-4 font-extrabold text-4xl md:leading-tight">Create<GradientText > AI </GradientText> Agents in minutes</h1>
                        <p className="mx-auto my-4 text-sm w-full max-w-xl text-center font-medium leading-relaxed tracking-wide">
                            From students to CEOs, create custom AI agents for any task. Access pre-made agents, build your own, and share with others - all without writing a single line of code.
                        </p>
                        <div className="flex flex-row justify-center items-center space-x-4 my-8">
                            <Link href={"/login"}>
                                <Button>
                                    Get Started
                                </Button>

                            </Link>
                            <Link href={"/learn-more"}>
                                <Button variant="secondary">
                                    What is Sulta AI?
                                </Button>
                            </Link>
                        </div>

                        <div
                            className="absolute top-0 -z-10 max-h-full max-w-screen-lg w-full h-full blur-2xl">
                            <div
                                className="absolute top-24 left-24 w-56 h-56 bg-violet-600 rounded-full mix-blend-multiply opacity-70 animate-blob filter blur-3xl">
                            </div>
                            <div
                                className="absolute hidden md:block bottom-2 right-1/4 w-56 h-56 bg-sky-600 rounded-full mix-blend-multiply opacity-70 animate-blob delay-1000 filter blur-3xl"></div>
                            <div
                                className="absolute hidden md:block bottom-1/4 left-1/3 w-56 h-56 bg-pink-600 rounded-full mix-blend-multiply opacity-70 animate-blob delay-500 filter blur-3xl"></div>
                        </div>
                    </div>

                    <div className="max-w-full mx-auto mb-8">
                        <Image className="w-3/4 mx-auto rounded-md"  src="/hero/dashboard.jpg" alt="Dashboard ui design" priority
                            width={700}
                            height={494} />
                    </div>
                </main>
            </div>

            {/* features */}

            <section className="relative py-24 overflow-hidden border-b border-border">
                <div className="container px-4 mx-auto">
                    <div className="max-w-3xl mx-auto text-center mb-16">
                        <span className="inline-block py-1 px-3 mb-4 text-xs font-semibold tracking-wider text-primary uppercase rounded-full bg-primary/10">
                            THE POWER OF AI AGENTS
                        </span>
                        <h2 className="text-4xl md:text-5xl font-extrabold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300">
                            Transform How You Work
                        </h2>
                        <p className="text-lg text-muted-foreground leading-relaxed">
                            Discover how AI agents can revolutionize your workflow, whether you're a student, professional, or business leader.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {features.map((feature) => (
                            <Card key={feature.title} className="relative group hover:shadow-lg transition-all duration-300 border border-border/50 backdrop-blur-sm bg-background/50">
                                <CardHeader>
                                    <div className="w-16 h-16 mx-auto mb-6 relative">
                                        <div className="absolute inset-0 bg-primary/20 rounded-full blur-xl group-hover:blur-2xl transition-all duration-300"></div>
                                        <div className="relative w-full h-full flex items-center justify-center text-primary-foreground bg-primary rounded-full">
                                            {feature.icon}
                                        </div>
                                    </div>
                                    <CardTitle className="text-xl font-bold mb-4 group-hover:text-primary transition-colors duration-300">
                                        {feature.title}
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <CardDescription className="text-muted-foreground leading-relaxed">
                                        {feature.description}
                                    </CardDescription>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>

                <div className="absolute inset-0 -z-10">
                    <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-violet-600/30 rounded-full mix-blend-multiply filter blur-3xl animate-blob"></div>
                    <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-sky-600/30 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000"></div>
                    <div className="absolute bottom-1/2 left-1/2 w-96 h-96 bg-pink-600/30 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-4000"></div>
                </div>
            </section>

           

            {/* Pricing */}

            {/* <FeaturesSection /> */}

            <section
                className="border-b dark border-border bg-background">
                <div className="container mx-auto text-center">
                    <div className="py-14">
                        <h2 className="text-4xl font-extrabold my-4 text-foreground">
                            Choose Your Plan
                        </h2>

                        <p className="mx-auto my-4 text-sm w-full max-w-md bg-transparent text-center font-medium leading-relaxed tracking-wide text-muted-foreground">
                            Start with our free tier and scale up as your AI agent needs grow. Perfect for individuals and teams of any size.
                        </p>

                        <PricingSection />  
                        {/* <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
                            {pricing.map((plan) => (
                                <Card key={plan.title} className="w-full mx-auto max-w-xl text-left relative">
                                    {plan.fancy && (
                                        <Badge className="absolute top-4 right-4">
                                            Popular
                                        </Badge>
                                    )}
                                    <CardHeader>
                                        <CardTitle className="text-2xl">
                                            {plan.title}
                                        </CardTitle>
                                        <CardDescription className="mt-4">
                                            {plan.description}
                                        </CardDescription>
                                        <h5 className="text-2xl font-bold">{plan.price}</h5>
                                    </CardHeader>
                                    <CardContent>
                                        <Button className="w-full" variant={plan.fancy ? "default" : "secondary"}>
                                            Get Started
                                        </Button>
                                    </CardContent>
                                    <CardFooter>
                                        <ul className="mt-4">
                                            {plan.features.map((feature) => (
                                                <li key={feature} className="flex items-center gap-2">
                                                    <CircleCheck className="w-4 h-4 text-green-500" />
                                                    {feature}
                                                </li>
                                            ))}
                                        </ul>
                                    </CardFooter>
                                </Card>
                            ))}
                        </div> */}
                    </div>
                </div>
            </section>
            <Footer />
        </div>
  );
}
