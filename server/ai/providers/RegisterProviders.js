import AIFactoryProvider from './AIFactoryProvider.js';
import AnthropicAIProvider from './anthropic/config/AnthropicAIConfig.js';
import VertexAIProvider from './google/config/VertexAIConfig.js'
import OpenAIProvider from './openai/config/OpenAIConfig.js';

const aiFactory = AIFactoryProvider;

aiFactory.registerProvider('claude', AnthropicAIProvider);
aiFactory.registerProvider('gemini', VertexAIProvider);
aiFactory.registerProvider('gpt', OpenAIProvider);

Object.freeze(aiFactory);

export default aiFactory;
