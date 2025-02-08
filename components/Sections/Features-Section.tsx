'use client'
import { LucideIcon, Bot, Phone, Sparkles, Workflow, Share2, Lock, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface Feature {
  title: string;
  description: string;
  icon: LucideIcon;
  image: string;
  color: string;
}


const features: Feature[] = [
  {
    title: "Visual Agent Builder",
    description: "Create sophisticated AI agents through an intuitive drag-and-drop interface. Design conversations, actions, and logic flows visually.",
    icon: Bot,
    image: "/features/agent-builder.webp",
    color: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
  },
  {
    title: "Voice & Call Center",
    description: "Deploy AI agents that handle customer calls with natural voice interactions. Support multiple languages and custom voice personas.",
    icon: Phone,
    image: "/features/call-center.webp",
    color: "bg-purple-500/10 text-purple-600 dark:text-purple-400",
  },
  {
    title: "Knowledge Training",
    description: "Train your agents using documents, APIs, and databases. Our AI automatically structures and optimizes the knowledge for natural interactions.",
    icon: Sparkles,
    image: "/features/training.webp",
    color: "bg-rose-500/10 text-rose-600 dark:text-rose-400",
  },
  {
    title: "Process Automation",
    description: "Connect multiple agents to automate complex business processes. Build workflows with conditional logic and API integrations.",
    icon: Workflow,
    image: "/features/automation.webp",
    color: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  },
  {
    title: "Agent Marketplace",
    description: "Browse and deploy pre-built agents for common use cases. Share your custom agents and earn from the community marketplace.",
    icon: Share2,
    image: "/features/marketplace.webp",
    color: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
  },
  {
    title: "Enterprise Ready",
    description: "Bank-grade security with SSO, audit logs, and role-based access. Deploy on-premise or in your private cloud environment.",
    icon: Lock,
    image: "/features/enterprise.webp",
    color: "bg-slate-500/10 text-slate-600 dark:text-slate-400",
  },
];

export function FeaturesSection() {
  return (
    <section className="relative py-32">
      <div className="absolute inset-0 bg-grid-neutral-100/50 dark:bg-grid-neutral-900/50" />
      <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
      
      <div className="container relative">
        <div className="flex flex-col items-center text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-[800px]"
          >
            <h2 className="text-3xl font-bold leading-tight sm:text-4xl md:text-5xl">
              Build Your AI Workforce
              <span className="text-gradient bg-gradient-to-r from-primary to-secondary"> Without Code</span>
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Create, train, and deploy AI agents that handle customer interactions, automate workflows, and scale your business operations.
            </p>
          </motion.div>
        </div>

        <div className="mt-24 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="group relative"
            >
              <div className="relative overflow-hidden rounded-3xl border bg-card p-2">
                <div className="overflow-hidden rounded-2xl">
                  <img
                    src={feature.image}
                    alt={feature.title}
                    className="aspect-[4/3] w-full object-cover transition duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-4">
                    <div className={cn("rounded-xl p-2.5", feature.color)}>
                      <feature.icon className="h-5 w-5" />
                    </div>
                    <h3 className="font-semibold">{feature.title}</h3>
                  </div>
                  <p className="mt-3 text-sm text-muted-foreground">
                    {feature.description}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-24 flex justify-center"
        >
          <a
            href="/signup"
            className="group inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-primary to-secondary px-6 py-3 text-sm font-semibold text-white shadow-lg transition hover:shadow-xl"
          >
            Start Building for Free
            <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
          </a>
        </motion.div>
      </div>
    </section>
  );
}