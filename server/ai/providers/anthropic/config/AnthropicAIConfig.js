// anthropicProvider.js
import 'dotenv/config';
import Anthropic from '@anthropic-ai/sdk';
import AIProviderInterface from '../../../interfaces/AIInterfaceProvider.js';

const { ANTHROPIC_API } = process.env;

class AnthropicAIProvider extends AIProviderInterface {
    constructor() {
        if (AnthropicAIProvider.instance) {
            return AnthropicAIProvider.instance;
        }

        super();
        this.anthropicAi = new Anthropic({
            apiKey: ANTHROPIC_API,
        });
        AnthropicAIProvider.instance = this;
    }

    async streamChat(messages, responderStream) {
        await this.anthropicAi.messages.create({
            max_tokens: 4096,
            model: 'claude-3-opus-20240229',
            messages: messages,
            stream: true,
            temperature: 0.6,
        }).on('text', (text) => responderStream.onNext({ data: Buffer.from(text) }));

        responderStream.onComplete();
    }
}

const instance = new AnthropicAIProvider();
Object.freeze(instance);

export default instance;
