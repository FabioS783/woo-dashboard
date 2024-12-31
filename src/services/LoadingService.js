class LoadingService {
  constructor() {
    this.subscribers = new Set();
    this.progress = 0;
    this.message = 'Inizializzazione...';
  }

  subscribe(callback) {
    this.subscribers.add(callback);
    return () => this.subscribers.delete(callback);
  }

  notify() {
    this.subscribers.forEach(callback => callback({
      progress: this.progress,
      message: this.message
    }));
  }

  reset() {
    this.progress = 0;
    this.message = 'Inizializzazione...';
    this.notify();
  }

  setProgress(progress, message = null) {
    this.progress = Math.min(100, Math.max(0, Math.round(progress)));
    if (message) {
      this.message = message;
    } else if (this.progress < 30) {
      this.message = 'Recupero ordini...';
    } else if (this.progress < 60) {
      this.message = 'Analisi dati...';
    } else if (this.progress < 90) {
      this.message = 'Preparazione report...';
    } else {
      this.message = 'Completamento...';
    }
    this.notify();
  }

  getProgress() {
    return {
      progress: this.progress,
      message: this.message
    };
  }
}

export default new LoadingService();