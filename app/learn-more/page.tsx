'use client'
import Footer from '@/components/layout/Footer'
import Navbar from '@/components/layout/Navbar'
import React from 'react'
import Image from 'next/image'
import { 
    ArrowDown, 
    Sparkles, 
    Code2, 
    Users, 
    Zap, 
    Shield, 
    Clock, 
    Target,
    CheckCircle2,
    Brain,
    Rocket,
    ArrowRight
} from 'lucide-react'
import { GradientText } from '@/components/ui/gradient-text'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

function LearnMorePage() {
    const capabilities = [
        {
            icon: <Sparkles className="w-6 h-6" />,
            title: "Create Custom AI Agents",
            description: "Build specialized AI agents tailored to your specific needs - from customer support to personal assistants."
        },
        {
            icon: <Brain className="w-6 h-6" />,
            title: "Train with Your Data",
            description: "Upload documents, knowledge bases, and resources to train AI agents that understand your context."
        },
        {
            icon: <Zap className="w-6 h-6" />,
            title: "Instant Deployment",
            description: "Deploy your AI agents in minutes, not months. No coding or technical expertise required."
        },
        {
            icon: <Users className="w-6 h-6" />,
            title: "Share & Collaborate",
            description: "Discover pre-built agents from the community or share your own creations with others."
        },
        {
            icon: <Clock className="w-6 h-6" />,
            title: "24/7 Availability",
            description: "Your AI agents work around the clock, handling tasks and queries even while you sleep."
        },
        {
            icon: <Shield className="w-6 h-6" />,
            title: "Secure & Private",
            description: "Enterprise-grade security ensures your data and AI agents remain private and protected."
        }
    ]

    const useCases = [
        {
            category: "For Students",
            examples: [
                "Study buddy that answers questions about course materials",
                "Essay research assistant",
                "Language learning tutor",
                "Homework help agent"
            ]
        },
        {
            category: "For Professionals",
            examples: [
                "Meeting notes summarizer",
                "Email draft assistant",
                "Project management helper",
                "Data analysis companion"
            ]
        },
        {
            category: "For Businesses",
            examples: [
                "24/7 customer support agent",
                "Employee onboarding assistant",
                "Sales lead qualifier",
                "Internal knowledge base chatbot"
            ]
        }
    ]

    return (
        <div className="overflow-y-auto">
            {/* Hero Section */}
            <section className="relative min-h-screen flex flex-col overflow-hidden bg-gradient-to-b from-blue-50/50 via-white to-white dark:from-neutral-950 dark:via-neutral-900 dark:to-background">
                {/* Subtle background pattern */}
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#e5e7eb_1px,transparent_1px),linear-gradient(to_bottom,#e5e7eb_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#1f2937_1px,transparent_1px),linear-gradient(to_bottom,#1f2937_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)] opacity-20" />
                
                {/* Floating gradient orbs */}
                <div className="absolute top-20 left-10 w-72 h-72 bg-blue-400/20 rounded-full blur-3xl animate-pulse" />
                <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
                
                {/* Navbar */}
                <div className="relative z-50">
            <Navbar />
                </div>
                
                <div className="container relative z-10 mx-auto px-4 pt-20 pb-16 flex-1 flex items-center justify-center">
                    <div className="max-w-4xl w-full text-center">
                        <span className="inline-block py-2 px-4 mb-6 text-xs font-bold tracking-wider text-blue-600 dark:text-blue-400 uppercase rounded-full bg-blue-100 dark:bg-blue-950 border border-blue-200 dark:border-blue-900">
                            AI Redefined
                        </span>
                        
                        <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold mb-6 tracking-tight">
                            <span className="bg-gradient-to-r from-neutral-900 via-neutral-800 to-neutral-900 dark:from-white dark:via-neutral-100 dark:to-white bg-clip-text text-transparent">
                                Create AI That
                            </span>
                            <br />
                            <span className="bg-gradient-to-r from-blue-600 via-blue-500 to-blue-600 bg-clip-text text-transparent">
                                Works For You
                            </span>
                        </h1>

                        <p className="text-lg md:text-xl text-neutral-600 dark:text-neutral-400 mb-12 max-w-2xl mx-auto leading-relaxed">
                            No coding. No complexity. Just powerful AI agents that understand your needs and get things done.
                        </p>

                        <div className="flex flex-col items-center justify-center">
                            <div className="flex items-center gap-2 text-neutral-500 dark:text-neutral-400 animate-bounce">
                                <ArrowDown className="w-6 h-6" />
                                <span className="text-sm font-medium">Discover what's possible</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Capabilities Grid Section */}
            <section className="relative py-24">
                <div className="container px-4 mx-auto">
                    <div className="max-w-3xl mx-auto text-center mb-16">
                        <h2 className="text-4xl md:text-5xl font-bold mb-6">
                            <span className="bg-gradient-to-r from-neutral-900 to-neutral-700 dark:from-white dark:to-neutral-300 bg-clip-text text-transparent">
                                What Can You Do With
                            </span>
                            {' '}
                            <GradientText>Sulta AI?</GradientText>
                        </h2>
                        <p className="text-lg text-neutral-600 dark:text-neutral-400">
                            The possibilities are endless. Here's what you can achieve:
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-6xl mx-auto">
                        {capabilities.map((capability, index) => (
                            <div 
                                key={index} 
                                className="group relative p-5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 hover:border-blue-500/50 dark:hover:border-blue-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/5"
                            >
                                <div className="flex items-start gap-4">
                                    <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-blue-500 text-white group-hover:scale-105 transition-transform duration-300">
                                        {capability.icon}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h3 className="text-base font-semibold mb-1.5 text-neutral-900 dark:text-neutral-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                                            {capability.title}
                                        </h3>
                                        <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
                                            {capability.description}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Visual Showcase Section */}
            <section className="relative py-24 bg-gradient-to-b from-neutral-50 to-white dark:from-neutral-900 dark:to-background">
                <div className="container px-4 mx-auto">
                    <div className="max-w-6xl mx-auto">
                        <div className="grid md:grid-cols-2 gap-12 items-center">
                            <div className="relative">
                                <div className="absolute -inset-4 bg-gradient-to-r from-blue-500 via-blue-400 to-blue-500 rounded-3xl blur-2xl opacity-20" />
                                <div className="relative rounded-2xl overflow-hidden border border-neutral-200 dark:border-neutral-800 shadow-2xl">
                                    <Image 
                                        className="w-full h-auto" 
                                        src="/ai-thumb.jpg" 
                                        alt="Sulta AI Interface" 
                                        priority
                                        width={600}
                                        height={600}
                                    />
                                </div>
                            </div>
                            
                            <div>
                                <span className="inline-block py-2 px-4 mb-4 text-xs font-bold tracking-wider text-blue-600 dark:text-blue-400 uppercase rounded-full bg-blue-100 dark:bg-blue-950 border border-blue-200 dark:border-blue-900">
                                    Powerful Yet Simple
                                </span>
                                <h3 className="text-3xl md:text-4xl font-bold mb-6 bg-gradient-to-r from-neutral-900 to-neutral-700 dark:from-white dark:to-neutral-300 bg-clip-text text-transparent">
                                    Build AI Agents in Minutes
                                </h3>
                                <div className="space-y-4">
                                    {[
                                        "No technical knowledge required",
                                        "Intuitive drag-and-drop interface",
                                        "Pre-built templates to get started",
                                        "Real-time testing and refinement",
                                        "One-click deployment"
                                    ].map((feature, index) => (
                                        <div key={index} className="flex items-start gap-3">
                                            <CheckCircle2 className="w-6 h-6 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                                            <span className="text-neutral-700 dark:text-neutral-300">{feature}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Use Cases Section */}
            <section className="relative py-24">
                <div className="container px-4 mx-auto">
                    <div className="max-w-3xl mx-auto text-center mb-16">
                        <h2 className="text-4xl md:text-5xl font-bold mb-6">
                            <span className="bg-gradient-to-r from-neutral-900 to-neutral-700 dark:from-white dark:to-neutral-300 bg-clip-text text-transparent">
                                Perfect For
                            </span>
                            {' '}
                            <GradientText>Everyone</GradientText>
                        </h2>
                        <p className="text-lg text-neutral-600 dark:text-neutral-400">
                            Whether you're a student, professional, or business owner, Sulta AI adapts to your needs.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto">
                        {useCases.map((useCase, index) => (
                            <Card key={index} className="border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900">
                                <CardHeader>
                                    <CardTitle className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-500 bg-clip-text text-transparent">
                                        {useCase.category}
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <ul className="space-y-3">
                                        {useCase.examples.map((example, idx) => (
                                            <li key={idx} className="flex items-start gap-2 text-neutral-600 dark:text-neutral-400">
                                                <Target className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                                                <span>{example}</span>
                                            </li>
                                        ))}
                        </ul>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="relative py-24 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-blue-500 to-blue-700" />
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff15_1px,transparent_1px),linear-gradient(to_bottom,#ffffff15_1px,transparent_1px)] bg-[size:4rem_4rem]" />
                
                <div className="container relative z-10 mx-auto px-4">
                    <div className="max-w-4xl mx-auto text-center">
                        <Rocket className="w-16 h-16 mx-auto mb-6 text-white" />
                        <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                            Ready to Get Started?
                        </h2>
                        <p className="text-xl text-blue-100 mb-10 max-w-2xl mx-auto">
                            Join thousands building their AI workforce. Create your first agent in less than 5 minutes.
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
    )
}

export default LearnMorePage
