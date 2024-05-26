class AIProviderInterface {
    async streamChat(messages, responderStream) {
        throw new Error('Method not implemented');
    }
}

export default AIProviderInterface;