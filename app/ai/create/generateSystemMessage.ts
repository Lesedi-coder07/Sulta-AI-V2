export function generateSystemMessage(name: string, description: string, type: string, personality: string  | undefined, tone: string | undefined, expertise: string[] | undefined, context: string = '') {
    const expertiseString = expertise?.join(', ');
    const contextMessage = context ? `Here is extra context about your role as an agent: ${context}` : '';
    return `You are an AI agent named ${name}. You are a ${type} agent. Your personality is ${personality}. Your tone is ${tone}. Your expertise is ${expertiseString}. Your description is ${description}. ${contextMessage}`;
}