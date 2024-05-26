class AIProviderInterface {
    async streamChat(messages, res) {
        throw new Error('Method not implemented');
    }
}

export default AIProviderInterface;