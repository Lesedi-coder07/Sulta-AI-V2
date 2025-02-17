import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { ArrowRightIcon } from "@radix-ui/react-icons";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { features } from "@/data/features";
import { pricing } from "@/data/pricing";
import Navbar from "@/components/layout/Navbar";
import { CircleCheck } from "lucide-react";
import Footer from "@/components/layout/Footer";
import { GradientText } from "@/components/ui/gradient-text";
// import { tiers } from "./pricing/pricing";
import { Check } from "lucide-react";
import PricingSection from "@/components/Sections/Pricing-Section";
import { FeaturesSection } from "@/components/Sections/Features-Section";
import { Metadata } from "next";



export default function Home() {
  return (
      <>
           
            <Navbar />
            <div className="border-b border-border">
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
                        <h1 className="md:text-7xl my-4 font-extrabold text-4xl md:leading-tight">Your Personal <GradientText > AI </GradientText> Workforce</h1>
                        <p className="mx-auto my-4 text-sm w-full max-w-xl text-center font-medium leading-relaxed tracking-wide">
                            From students to CEOs, create custom AI agents for any task. Access pre-made agents, build your own, and share with others - all without writing a single line of code.
                        </p>
                        <div className="flex flex-row justify-center items-center space-x-4 my-8">
                            <Link href={"/auth/login"}>
                                <Button>
                                    Get Started
                                </Button>

                            </Link>
                            <Link href={"/learn-more"}>
                                <Button variant="secondary">
                                    Learn More
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

                    <div className="max-w-2xl mx-auto mb-8">
                        <Image className="w-3/4 mx-auto rounded-md"  src="/hero/appScreenshot.jpeg" alt="Dashboard ui design" priority
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

            <section className="py-24 overflow-hidden border-b border-border">
                <div className="container px-4 mx-auto">
                    <div className="max-w-3xl mx-auto text-center mb-16">
                        <span className="inline-block py-1 px-3 mb-4 text-xs font-semibold tracking-wider text-primary uppercase rounded-full bg-primary/10">
                            XEV AI AGENT
                        </span>
                        <h2 className="text-4xl md:text-5xl font-extrabold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300">
                            Unlock Your AI Potential
                        </h2>
                        <p className="text-lg text-muted-foreground leading-relaxed">
                            Introducing Xev, our in-house AI agent built by Sulta AI, designed to revolutionize your workflow with AI agency as its primary goal.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        <Card className="relative group hover:shadow-lg transition-all duration-300 border border-border/50 backdrop-blur-sm bg-background/50">
                            <CardHeader>
                                <div className="w-16 h-16 mx-auto mb-6 relative">
                                    <div className="absolute inset-0 bg-primary/20 rounded-full blur-xl group-hover:blur-2xl transition-all duration-300"></div>
                                    <div className="relative w-full h-full flex items-center justify-center text-primary-foreground bg-primary rounded-full">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                        </svg>
                                    </div>
                                </div>
                                <CardTitle className="text-xl font-bold mb-4 group-hover:text-primary transition-colors duration-300">
                                    Automatic Messaging
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <CardDescription className="text-muted-foreground leading-relaxed">
                                    Coming soon: Automatic email and social media messaging capabilities that mimic human interaction.
                                </CardDescription>
                            </CardContent>
                        </Card>

                        <Card className="relative group hover:shadow-lg transition-all duration-300 border border-border/50 backdrop-blur-sm bg-background/50">
                            <CardHeader>
                                <div className="w-16 h-16 mx-auto mb-6 relative">
                                    <div className="absolute inset-0 bg-primary/20 rounded-full blur-xl group-hover:blur-2xl transition-all duration-300"></div>
                                    <div className="relative w-full h-full flex items-center justify-center text-primary-foreground bg-primary rounded-full">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M7 8h10M7 12h4m1 8l2-2m-2-2l2-2" />
                                        </svg>
                                    </div>
                                </div>
                                <CardTitle className="text-xl font-bold mb-4 group-hover:text-primary transition-colors duration-300">
                                    Document Analysis
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <CardDescription className="text-muted-foreground leading-relaxed">
                                    Coming soon: Legal and Academic document analyzer and summarizer capabilities.
                                </CardDescription>
                            </CardContent>
                        </Card>

                        <Card className="relative group hover:shadow-lg transition-all duration-300 border border-border/50 backdrop-blur-sm bg-background/50">
                            <CardHeader>
                                <div className="w-16 h-16 mx-auto mb-6 relative">
                                    <div className="absolute inset-0 bg-primary/20 rounded-full blur-xl group-hover:blur-2xl transition-all duration-300"></div>
                                    <div className="relative w-full h-full flex items-center justify-center text-primary-foreground bg-primary rounded-full">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M7 8h10M7 12h4m1 8l2-2m-2-2l2-2" />
                                        </svg>
                                    </div>
                                </div>
                                <CardTitle className="text-xl font-bold mb-4 group-hover:text-primary transition-colors duration-300">
                                    Quick Deployments
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <CardDescription className="text-muted-foreground leading-relaxed">
                                    Coming soon: Quick WhatsApp deployments for seamless integration. Web deployments are already available.
                                </CardDescription>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="text-center mt-16">
                        <p className="text-lg text-muted-foreground leading-relaxed">
                            Xev 1.0 is still in its extremely beta phase. We'll continue to release new iterations as time goes on, refining and expanding its capabilities.
                        </p>
                        <a href="/chat" className="inline-block px-6 py-3 mt-6 text-sm font-semibold leading-relaxed text-white bg-primary rounded-full hover:bg-primary/90 transition-colors duration-300">
                            Try it out
                        </a>
                    </div>
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
        </>
  );
}
