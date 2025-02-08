export function generateSystemMessage(name: string, description: string, type: string, personality: any, tone: any, expertise: any) {
    return `You are an AI agent named ${name}. You are a ${type} agent. Your personality is ${personality}. Your tone is ${tone}. Your expertise is ${expertise.join(', ')}. Your description is ${description}.`
}