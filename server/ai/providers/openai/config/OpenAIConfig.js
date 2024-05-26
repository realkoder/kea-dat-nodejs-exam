import 'dotenv/config';
import OpenAI from 'openai';
import AIProviderInterface from '../../../interfaces/AIInterfaceProvider.js';

const { OPENAI_API, ORGANIZATION_ID } = process.env;

class OpenAIProvider extends AIProviderInterface {
  constructor() {
    if (OpenAIProvider.instance) {
      return OpenAIProvider.instance;
    }

    super();
    this.openai = new OpenAI({
      apiKey: OPENAI_API,
      organization: ORGANIZATION_ID,
    });

    OpenAIProvider.instance = this;
  }

  getOpenAI() {
    return this.openai;
  }

  async streamChat(messages, chatroomConnections) {
    const stream = await this.openai.chat.completions.create({
      model: 'gpt-4o',
      messages: this.setMessagesRole(messages),
      stream: true,
      temperature: 0.5,
      max_tokens: 4096,
    });

    for await (const chunk of stream) {
        console.log('CHUNK', chunk.choices[0]?.delta.content);
      chatroomConnections.forEach(userConnection => {        
        userConnection.connection.onNext({ data: Buffer.from(chunk.choices[0]?.delta?.content || '') });
      });
    }

    // responderStream.onComplete();
  }

  setMessagesRole(chatMessages) {
    return chatMessages.map(message => {
      return { role: message.userId.length > 2 ? 'user' : 'assistent', content: message.textMessage };
    });
  }
}

const instance = new OpenAIProvider();
Object.freeze(instance);

export default instance;
