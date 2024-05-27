// anthropicProvider.js
import 'dotenv/config';
import Anthropic from '@anthropic-ai/sdk';
import AIProviderInterface from '../../../interfaces/AIInterfaceProvider.js';
import { getSystemMessage, transformMessageFromAIToClient } from '../../../utils/aiUtilityMethods.js';
import { v4 as uuidv4 } from 'uuid';

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

  getAnthropicProvider() {
    return this.anthropicAi;
  }

  async streamChat(messages, chatroomConnections) {
    let aiAnswer = '';
    const temporaryMsgId = uuidv4();

    const chatCompleted = new Promise((resolve, reject) => {
        this.anthropicAi.messages
          .stream({
            max_tokens: 4096,
            model: 'claude-3-opus-20240229',
            system: getSystemMessage(),
            messages: this.setMessagesRole(messages),
            stream: true,
            temperature: 0.6,
          })
          .on('text', text => {
            aiAnswer += text;
            chatroomConnections.forEach(userConnection => {
              const buffer = Buffer.from(
                JSON.stringify({
                  data: {
                    _id: temporaryMsgId,
                    userId: '3',
                    textMessage: text,
                    chatroomId: messages[0].chatroomId,
                  },
                }),
              );
              userConnection.connection.onNext({ data: buffer });
            });
          })
          .on('end', () => {
            resolve();
          })
          .on('error', (error) => {
            reject(error);
          });
      });
    
      // Wait for the chat to be completed before returning
      await chatCompleted;
    
      return {
        userId: '3',
        textMessage: aiAnswer,
        chatroomId: messages[0].chatroomId,
      };
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
