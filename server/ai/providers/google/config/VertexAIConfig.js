import 'dotenv/config';
import {
    HarmBlockThreshold,
    HarmCategory,
    VertexAI
} from '@google-cloud/vertexai';
import AIProviderInterface from '../../../interfaces/AIInterfaceProvider.js';
import { getSystemMessage } from '../../../utils/aiUtilityMethods.js';

const { PROJECT_ID, LOCATION } = process.env;

const project = PROJECT_ID;
const location = LOCATION;
const textModel = 'gemini-1.0-pro';

class VertexAIProvider extends AIProviderInterface {
    constructor() {
        if (VertexAIProvider.instance) {
            return VertexAIProvider.instance;
        }
        
        super();
        this.vertexAI = new VertexAI({ project: project, location: location });
        VertexAIProvider.instance = this;
    }

    getVertxAI() {
        return this.vertexAI.getGenerativeModel({
            systemInstruction: getSystemMessage(),
            model: textModel,
            safetySettings: [{ category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE }],
            generationConfig: {
                maxOutputTokens: 8000,
                temperature: 0.5,
            },
        });
    }

    async streamChat(messages, chatroomConnections) {
        const generativeModel = this.getVertxAI();
        const streamingResult = await generativeModel.generateContentStream(this.setMessagesRole(messages));
        for await (const item of streamingResult.stream) {
            chatroomConnections.forEach(userConnection => {
                userConnection.connection.onNext({ data: Buffer.from(item) });
            });
        }

    }

    setMessagesRole(chatMessages) {
        console.log('chatMessages', chatMessages);
        const formattedMessages = [];
        let userMessageBuffer = '';
    
        chatMessages.forEach(message => {
            if (message.userId !== 2) {
                userMessageBuffer += `[userId: ${message.userId} | message: ${message.textMessage}] \n`;
            } else {
                if (userMessageBuffer) {
                    formattedMessages.push({ role: 'user', parts: [{text: userMessageBuffer.trim()}] });
                    userMessageBuffer = '';
                }
                formattedMessages.push({ role: 'assistant', parts: [{text: message.textMessage}] });
            }
        });
    
        // Push any remaining user messages in the buffer
        if (userMessageBuffer) {
            formattedMessages.push({ role: 'user', parts: [{text: userMessageBuffer.trim()}] });
        }
    
        console.log('formattedMessages', formattedMessages);
        return formattedMessages;
    }
    
}

const instance = new VertexAIProvider();
Object.freeze(instance);

export default instance;
