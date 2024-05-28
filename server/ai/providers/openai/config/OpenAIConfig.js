import 'dotenv/config';
import OpenAI from 'openai';
import AIProviderInterface from '../../../interfaces/AIInterfaceProvider.js';
import { getSystemMessage, transformMessageFromAIToClient } from '../../../utils/aiUtilityMethods.js';
import { v4 as uuidv4 } from 'uuid';

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

  getOpenAIProvider() {
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

    let aiAnswer = '';
    const temporayMsgId = uuidv4(); // This is only for streaming the message so client knows which ai respondstreams are related    

    for await (const chunk of stream) {
      (aiAnswer += chunk.choices[0]?.delta?.content || ''),
        chatroomConnections.forEach(userConnection => {
          const buffer = Buffer.from(
            JSON.stringify({ data: transformMessageFromAIToClient('1', temporayMsgId, chunk, messages[0].chatroomId) }),
          );
          userConnection.connection.onNext({ data: buffer });
        });
    }
    
    return {
      userId: '1',
      textMessage: aiAnswer,
      chatroomId: messages[0].chatroomId,
    };
  }

  setMessagesRole(chatMessages) {
    const systemMessage = { role: 'system', content: getSystemMessage() };
    return [
      systemMessage,
      ...chatMessages.map(message => {
        return { role: message.userId !== '1' ? 'user' : 'assistant', content: message.textMessage };
      }),
    ];
  }
}

const instance = new OpenAIProvider();
Object.freeze(instance);

export default instance;
