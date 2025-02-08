import {HandIcon, Pencil1Icon, Pencil2Icon, RocketIcon} from "@radix-ui/react-icons";
import {Handshake} from "lucide-react";

export const features = [
    {
        title: "No-Code Agent Creation",
        description: "Create powerful AI agents without writing any code. Our intuitive interface lets you customize behavior, knowledge, and capabilities in minutes.",
        icon: <Pencil2Icon className="w-6 h-6"/>,
    },
    {
        title: "Pre-Built Agent Library",
        description: "Access our growing collection of ready-to-use AI agents for various tasks - from research assistants and content creators to data analysts and HR helpers.",
        icon: <RocketIcon className="w-6 h-6"/>,
    },
    {
        title: "Community Sharing",
        description: "Share your custom agents with the community or discover agents created by others. Build upon existing agents to create the perfect solution for your needs.",
        icon: <Handshake className="w-6 h-6"/>,
    },
];