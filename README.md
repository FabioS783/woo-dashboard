# WooCommerce Dashboard

Dashboard analitica avanzata per WooCommerce che fornisce analisi dettagliate delle vendite, metriche dei clienti e performance dei prodotti. Sviluppata con React e integrata direttamente con l'API REST di WooCommerce.

## 🚀 Caratteristiche

- **Analisi Vendite in Tempo Reale**
  - Monitoraggio vendite giornaliere
  - Trend temporali
  - Metriche cumulative

- **Metriche Chiave**
  - Vendite totali
  - Numero ordini
  - Valore medio ordine
  - Prodotti venduti

- **Analisi Clienti**
  - Nuovi vs ricorrenti
  - Tasso di fidelizzazione
  - Performance per segmento

- **Performance Prodotti**
  - Top prodotti per fatturato
  - Analisi delle categorie
  - Trend di vendita

## 📋 Prerequisiti

- Node.js (versione >= 18.0.0)
- npm (versione >= 8.0.0)
- Un sito WooCommerce attivo con accesso API REST

## 🛠️ Installazione

1. Clona il repository:
```bash
git clone https://github.com/FabioS783/woo-dashboard.git
```

2. Installa le dipendenze:
```bash
cd woo-dashboard
npm install
```

3. Crea un file `.env` nella root del progetto (usa `.env.example` come template):
```env
VITE_APP_TITLE=WooCommerce Dashboard
VITE_API_URL=https://il-tuo-sito.com
VITE_CONSUMER_KEY=il_tuo_consumer_key
VITE_CONSUMER_SECRET=il_tuo_consumer_secret
```

4. Avvia il server di sviluppo:
```bash
npm run dev
```

## ⚙️ Configurazione

### Generare le Chiavi API WooCommerce

1. Vai nel tuo pannello WordPress
2. Naviga su WooCommerce > Impostazioni > Avanzate > REST API
3. Clicca "Aggiungi chiave"
4. Imposta i permessi su "Lettura"
5. Copia Consumer Key e Consumer Secret nel tuo file `.env`

### Ambiente di Sviluppo

Il progetto usa Vite.js come build tool. I principali comandi sono:

- `npm run dev`: Avvia il server di sviluppo
- `npm run build`: Crea la build di produzione
- `npm run preview`: Anteprima della build di produzione

## 🔧 Personalizzazione

### Periodo di Analisi
Puoi personalizzare i periodi di analisi modificando il componente `DateRangePicker.jsx`. I periodi disponibili sono:

- Ultimi 5 giorni (default)
- Oggi
- Ieri
- Ultimi 7 giorni
- Questo mese
- Mese scorso
- Ultimi 3 mesi
- Quest'anno

### Metriche Personalizzate
Per aggiungere nuove metriche, modifica il file `WooCommerceService.js` nella directory `services`.

## 📦 Stack Tecnologico

- React 18
- Vite.js
- Tailwind CSS
- Recharts per i grafici
- Lucide React per le icone

## 🤝 Contribuire

Sei interessato a contribuire? Fantastico! Ecco come puoi aiutare:

1. Fai un Fork del repository
2. Crea un branch per la tua feature (`git checkout -b feature/AmazingFeature`)
3. Committa le tue modifiche (`git commit -m 'Add some AmazingFeature'`)
4. Pusha sul branch (`git push origin feature/AmazingFeature`)
5. Apri una Pull Request

## 📝 Licenza

Questo progetto è distribuito sotto licenza MIT. Vedi il file `LICENSE` per maggiori informazioni.

## ✍️ Autore

- Fabio S.
- GitHub: [@FabioS783](https://github.com/FabioS783)

## 🙏 Ringraziamenti

Un ringraziamento speciale a tutti i contributori che hanno aiutato a rendere questo progetto migliore.