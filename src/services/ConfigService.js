class ConfigService {
    constructor() {
      // Verifica la presenza delle variabili d'ambiente
      if (!import.meta.env.VITE_API_URL) {
        console.error('VITE_API_URL non trovato nel file .env');
      }
      if (!import.meta.env.VITE_CONSUMER_KEY) {
        console.error('VITE_CONSUMER_KEY non trovato nel file .env');
      }
      if (!import.meta.env.VITE_CONSUMER_SECRET) {
        console.error('VITE_CONSUMER_SECRET non trovato nel file .env');
      }
  
      this.config = {
        apiUrl: import.meta.env.VITE_API_URL,
        consumerKey: import.meta.env.VITE_CONSUMER_KEY,
        consumerSecret: import.meta.env.VITE_CONSUMER_SECRET,
        appTitle: import.meta.env.VITE_APP_TITLE || 'WooCommerce Dashboard'
      };
  
      // Log di debug
      console.log('Config loaded:', {
        apiUrl: this.config.apiUrl,
        hasConsumerKey: !!this.config.consumerKey,
        hasConsumerSecret: !!this.config.consumerSecret
      });
    }
  
    getConfig() {
      return this.config;
    }
  
    getApiUrl() {
      if (!this.config.apiUrl) {
        throw new Error('API URL non configurato nel file .env');
      }
      return this.config.apiUrl;
    }
  
    getConsumerKey() {
      if (!this.config.consumerKey) {
        throw new Error('Consumer Key non configurata nel file .env');
      }
      return this.config.consumerKey;
    }
  
    getConsumerSecret() {
      if (!this.config.consumerSecret) {
        throw new Error('Consumer Secret non configurato nel file .env');
      }
      return this.config.consumerSecret;
    }
  
    getAppTitle() {
      return this.config.appTitle;
    }
  }
  
  // Creiamo un'istanza singleton
  const configService = new ConfigService();
  
  // Esportiamo l'istanza
  export default configService;