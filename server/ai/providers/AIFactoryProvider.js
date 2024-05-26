class AIFactoryProvider {
    constructor() {
        if (AIFactoryProvider.instance) {
            return AIFactoryProvider.instance;
        }

        this.providers = {};
        AIFactoryProvider.instance = this;
    }

    registerProvider(name, provider) {
        this.providers[name.toLowerCase()] = provider;
    }

    getProvider(providerName) {
        const provider = this.providers[providerName.toLowerCase()];
        if (!provider) {
            throw new Error('Unknown provider');
        }
        return provider;
    }
}

const instance = new AIFactoryProvider();
Object.freeze(instance);

export default instance;
