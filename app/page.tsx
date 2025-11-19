import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { ArrowRight, Sparkles, Zap, Shield, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { features } from "@/data/features";

import Navbar from "@/components/layout/Navbar";

import Footer from "@/components/layout/Footer";
import { GradientText } from "@/components/ui/gradient-text";

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
            {/* Hero Section - Completely Redesigned */}
            <section className="relative min-h-screen flex flex-col overflow-hidden bg-gradient-to-b from-blue-50/50 via-white to-white dark:from-neutral-950 dark:via-neutral-900 dark:to-background">
                {/* Subtle background pattern */}
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#e5e7eb_1px,transparent_1px),linear-gradient(to_bottom,#e5e7eb_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#1f2937_1px,transparent_1px),linear-gradient(to_bottom,#1f2937_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)] opacity-20" />
                
                {/* Floating gradient orbs - more subtle */}
                <div className="absolute top-20 left-10 w-72 h-72 bg-blue-400/20 rounded-full blur-3xl animate-pulse" />
                <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
                
                {/* Navbar inside hero */}
                <div className="relative z-50">
                    <Navbar />
                </div>
                
                <div className="container relative z-10 mx-auto px-4 pt-20 pb-16 flex-1 flex items-center justify-center">
                    <div className="max-w-5xl w-full text-center">
                        

                        {/* Main Headline */}
                        <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold mb-6 tracking-tight">
                            <span className="bg-gradient-to-r from-neutral-900 via-neutral-800 to-neutral-900 dark:from-white dark:via-neutral-100 dark:to-white bg-clip-text text-transparent">
                                Build Your AI
                            </span>
                            <br />
                            <span className="bg-gradient-to-r from-blue-600 via-blue-500 to-blue-600 bg-clip-text text-transparent">
                                Workforce Today
                            </span>
                        </h1>

                        {/* Subheadline */}
                        <p className="text-lg md:text-xl text-neutral-600 dark:text-neutral-400 mb-10 max-w-3xl mx-auto leading-relaxed font-medium">
                            From students to CEOs, create custom AI agents for any task. Access pre-made agents, build your own, and share with others — all without writing a single line of code.
                        </p>

                        {/* CTA Buttons */}
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
                            <Link href="/login">
                                <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-6 text-lg rounded-full shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 transition-all hover:scale-105">
                                    Get Started Free
                                    <ArrowRight className="ml-2 h-5 w-5" />
                                </Button>
                            </Link>
                            <Link href="/learn-more">
                                <Button size="lg" variant="outline" className="px-8 py-6 text-lg rounded-full border-2 border-neutral-300 dark:border-neutral-700 hover:border-blue-600 dark:hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-950/30 transition-all hover:scale-105">
                                    Learn More
                                </Button>
                            </Link>
                        </div>

                        {/* Dashboard Image - Modern floating card style */}
                        <div className="relative max-w-6xl mx-auto">
                            <div className="absolute -inset-4 bg-gradient-to-r from-blue-500 via-blue-600 to-blue-500 rounded-3xl blur-2xl opacity-20 animate-pulse" />
                            {/* <div className="relative rounded-2xl overflow-hidden border border-neutral-200 dark:border-neutral-800 shadow-2xl shadow-blue-500/10">
                                <Image 
                                    className="w-full h-auto" 
                                    src="/hero/dashboard.jpg" 
                                    alt="Sulta AI Dashboard" 
                                    priority
                                    width={1200}
                                    height={800}
                                />
                            </div> */}
                        </div>
                    </div>
                </div>
            </section>

         

            {/* Features Section - Redesigned */}
            <section className="relative py-24 overflow-hidden">
                <div className="container px-4 mx-auto">
                    <div className="max-w-3xl mx-auto text-center mb-20">
                        <span className="inline-block py-2 px-4 mb-4 text-xs font-bold tracking-wider text-blue-600 dark:text-blue-400 uppercase rounded-full bg-blue-100 dark:bg-blue-950 border border-blue-200 dark:border-blue-900">
                            Powerful Features
                        </span>
                        <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
                            <span className="bg-gradient-to-r from-neutral-900 to-neutral-700 dark:from-white dark:to-neutral-300 bg-clip-text text-transparent">
                                Everything You Need to
                            </span>
                            <br />
                            <span className="bg-gradient-to-r from-blue-600 to-blue-500 bg-clip-text text-transparent">
                                Build Smarter
                            </span>
                        </h2>
                        <p className="text-lg text-neutral-600 dark:text-neutral-400 leading-relaxed">
                            Discover how AI agents can revolutionize your workflow, whether you're a student, professional, or business leader.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto">
                        {features.map((feature) => (
                            <Card key={feature.title} className="group relative overflow-hidden hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-300 border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 hover:-translate-y-1">
                                {/* Card gradient overlay on hover */}
                                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                
                                <CardHeader className="relative">
                                    <div className="w-14 h-14 mx-auto mb-6 relative">
                                        <div className="absolute inset-0 bg-blue-500/20 rounded-2xl blur-xl group-hover:bg-blue-500/30 transition-all duration-300" />
                                        <div className="relative w-full h-full flex items-center justify-center text-white bg-gradient-to-br from-blue-600 to-blue-500 rounded-2xl shadow-lg shadow-blue-500/30 group-hover:shadow-blue-500/50 group-hover:scale-110 transition-all duration-300">
                                            {feature.icon}
                                        </div>
                                    </div>
                                    <CardTitle className="text-xl font-bold mb-3 text-center group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300">
                                        {feature.title}
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="relative">
                                    <CardDescription className="text-neutral-600 dark:text-neutral-400 leading-relaxed text-center">
                                        {feature.description}
                                    </CardDescription>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            {/* Pricing Section - Redesigned */}
            <section className="relative py-24 bg-gradient-to-b from-neutral-50 to-white dark:from-neutral-900 dark:to-background border-t border-b border-neutral-200 dark:border-neutral-800">
                <div className="container mx-auto px-4">
                    <div className="max-w-3xl mx-auto text-center mb-16">
                        <span className="inline-block py-2 px-4 mb-4 text-xs font-bold tracking-wider text-blue-600 dark:text-blue-400 uppercase rounded-full bg-blue-100 dark:bg-blue-950 border border-blue-200 dark:border-blue-900">
                            Pricing Plans
                        </span>
                        <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
                            <span className="bg-gradient-to-r from-neutral-900 to-neutral-700 dark:from-white dark:to-neutral-300 bg-clip-text text-transparent">
                                Choose Your Plan
                            </span>
                        </h2>
                        <p className="text-lg text-neutral-600 dark:text-neutral-400 leading-relaxed">
                            Start with our free tier and scale up as your AI agent needs grow. Perfect for individuals and teams of any size.
                        </p>
                    </div>

                    <PricingSection />
                </div>
            </section>

            {/* CTA Section */}
            <section className="relative py-24 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-blue-500 to-blue-700" />
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff15_1px,transparent_1px),linear-gradient(to_bottom,#ffffff15_1px,transparent_1px)] bg-[size:4rem_4rem]" />
                
                <div className="container relative z-10 mx-auto px-4">
                    <div className="max-w-4xl mx-auto text-center">
                        <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
                            Ready to Transform Your Workflow?
                        </h2>
                        <p className="text-xl text-blue-100 mb-10 max-w-2xl mx-auto">
                            Join thousands of users who are already building their AI workforce with Sulta AI.
                        </p>
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                            <Link href="/login">
                                <Button size="lg" className="bg-white hover:bg-neutral-100 text-blue-600 px-8 py-6 text-lg rounded-full shadow-xl hover:shadow-2xl transition-all hover:scale-105">
                                    Start Building Free
                                    <ArrowRight className="ml-2 h-5 w-5" />
                                </Button>
                            </Link>
                            <Link href="/pricing">
                                <Button size="lg" variant="outline" className="border-2 border-white text-white hover:bg-white/10 px-8 py-6 text-lg rounded-full transition-all hover:scale-105">
                                    View Pricing
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
  );
}
