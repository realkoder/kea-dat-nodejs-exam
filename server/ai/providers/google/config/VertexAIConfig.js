import 'dotenv/config';
import {
    HarmBlockThreshold,
    HarmCategory,
    VertexAI
} from '@google-cloud/vertexai';
import AIProviderInterface from '../../../interfaces/AIInterfaceProvider.js';


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
            model: textModel,
            safetySettings: [{ category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE }],
            generationConfig: {
                maxOutputTokens: 8000,
                temperature: 0.5,
            },
        });
    }

    async streamChat(messages, responderStream) {
        const generativeModel = this.getVertxAI();
        const streamingResult = await generativeModel.generateContentStream(messages);
        for await (const item of streamingResult.stream) {
            responderStream.onNext({ data: Buffer.from(item) });
        }
        responderStream.onComplete();
    }
}

const instance = new VertexAIProvider();
Object.freeze(instance);

export default instance;
