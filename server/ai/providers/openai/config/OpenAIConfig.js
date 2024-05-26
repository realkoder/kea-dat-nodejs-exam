import "dotenv/config";
import OpenAI from "openai";
import AIProviderInterface from '../../../interfaces/AIInterfaceProvider.js';

const { OPENAI_API, PROJECT_ID, ORGANIZATION_ID } = process.env;

class OpenAIProvider extends AIProviderInterface {
    constructor() {
        if (OpenAIProvider.instance) {
            return OpenAIProvider.instance;
        }

        super();
        this.openai = new OpenAI({
            apiKey: OPENAI_API,
            organization: ORGANIZATION_ID,
            project: PROJECT_ID
        });

        OpenAIProvider.instance = this;
    }

    getOpenAI() {
        return this.openai;
    }

    async streamChat(messages, responderStream) {
        const stream = await this.openai.chat.completions.create({
            model: "gpt-4o",
            messages: messages,
            stream: true,
            temperature: 0.5,
            max_tokens: 4096,
        });

        for await (const chunk of stream) {
            responderStream.onNext({ data: Buffer.from(chunk.choices[0]?.delta?.content || "") });
        }

        responderStream.onComplete();
    }
}


const instance = new OpenAIProvider();
Object.freeze(instance);

export default instance;
