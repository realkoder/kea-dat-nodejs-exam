// anthropicProvider.js
import 'dotenv/config';
import Anthropic from '@anthropic-ai/sdk';
import AIProviderInterface from '../../../interfaces/AIInterfaceProvider.js';
import { getSystemMessage, transformMessageFromAIToClient } from '../../../utils/aiUtilityMethods.js';


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

    async streamChat(messages, chatroomConnections) {
        let aiAnswer = '';
        
        this.anthropicAi.messages.stream({
            max_tokens: 4096,
            model: 'claude-3-opus-20240229',
            system: getSystemMessage(),
            messages: this.setMessagesRole(messages),
            stream: true,
            temperature: 0.6,
        }).on('text', (text) => {
            aiAnswer += text,

            chatroomConnections.forEach(userConnection => {
                const buffer = Buffer.from(JSON.stringify({ data: transformMessageFromAIToClient('3', chunk, messages[0].chatroomId) }));      
                userConnection.connection.onNext({ data: buffer });
            });
        });

        return transformMessageFromAIToClient('3', aiAnswer, messages[0].chatroomId);

    }

    setMessagesRole(chatMessages) {
        console.log('chatMessages', chatMessages);
        const formattedMessages = [];
        let userMessageBuffer = '';
    
        chatMessages.forEach(message => {
            if (message.userId !== '3') {
                userMessageBuffer += `[userId: ${message.userId} | message: ${message.textMessage}] \n`;
            } else {
                if (userMessageBuffer) {
                    formattedMessages.push({ role: 'user', content: userMessageBuffer.trim() });
                    userMessageBuffer = '';
                }
                formattedMessages.push({ role: 'assistant', content: message.textMessage });
            }
        });
    
        // Push any remaining user messages in the buffer
        if (userMessageBuffer) {
            formattedMessages.push({ role: 'user', content: userMessageBuffer.trim() });
        }
    
        console.log('formattedMessages', formattedMessages);
        return formattedMessages;
    }
    
    
}

const instance = new AnthropicAIProvider();
Object.freeze(instance);

export default instance;
