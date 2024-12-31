class RFMService {
    calculateRFMScores(orders, referenceDate = new Date()) {
      // Raggruppa gli ordini per cliente
      const customerOrders = this.groupOrdersByCustomer(orders);
      
      // Calcola i punteggi RFM grezzi per ogni cliente
      const rawScores = this.calculateRawScores(customerOrders, referenceDate);
      
      // Calcola i quantili per ogni metrica
      const quantiles = this.calculateQuantiles(rawScores);
      
      // Assegna i punteggi RFM finali (1-5) basati sui quantili
      const rfmScores = this.assignRFMScores(rawScores, quantiles);
      
      // Segmenta i clienti basandosi sui punteggi RFM
      const segments = this.segmentCustomers(rfmScores);
      
      // Calcola le metriche aggregate
      const metrics = this.calculateAggregateMetrics(rawScores);
  
      return {
        segments: this.countSegments(segments),
        totalCustomers: Object.keys(rfmScores).length,
        metrics
      };
    }
  
    groupOrdersByCustomer(orders) {
      return orders.reduce((acc, order) => {
        const customerId = order.customer_id;
        if (!acc[customerId]) {
          acc[customerId] = [];
        }
        acc[customerId].push(order);
        return acc;
      }, {});
    }
  
    calculateRawScores(customerOrders, referenceDate) {
      const scores = {};
      
      for (const [customerId, orders] of Object.entries(customerOrders)) {
        // Ordina gli ordini per data
        const sortedOrders = orders.sort((a, b) => 
          new Date(b.date_created) - new Date(a.date_created)
        );
        
        // Recency: giorni dall'ultimo ordine
        const lastOrderDate = new Date(sortedOrders[0].date_created);
        const recency = Math.floor((referenceDate - lastOrderDate) / (1000 * 60 * 60 * 24));
        
        // Frequency: numero di ordini
        const frequency = orders.length;
        
        // Monetary: valore totale degli ordini
        const monetary = orders.reduce((sum, order) => 
          sum + parseFloat(order.total), 0
        );
        
        scores[customerId] = { recency, frequency, monetary };
      }
      
      return scores;
    }
  
    calculateQuantiles(scores) {
      const metrics = ['recency', 'frequency', 'monetary'];
      const quantiles = {};
      
      metrics.forEach(metric => {
        const values = Object.values(scores).map(score => score[metric]).sort((a, b) => a - b);
        
        quantiles[metric] = {
          min: values[0],
          max: values[values.length - 1],
          q20: this.getPercentile(values, 20),
          q40: this.getPercentile(values, 40),
          q60: this.getPercentile(values, 60),
          q80: this.getPercentile(values, 80)
        };
      });
      
      return quantiles;
    }
  
    getPercentile(array, percentile) {
      const index = (percentile / 100) * (array.length - 1);
      if (Number.isInteger(index)) {
        return array[index];
      }
      const lower = Math.floor(index);
      const upper = Math.ceil(index);
      const weight = index - lower;
      return array[lower] * (1 - weight) + array[upper] * weight;
    }
  
    assignRFMScores(rawScores, quantiles) {
      const scores = {};
      
      for (const [customerId, raw] of Object.entries(rawScores)) {
        scores[customerId] = {
          r: this.assignScore(raw.recency, quantiles.recency, true),
          f: this.assignScore(raw.frequency, quantiles.frequency),
          m: this.assignScore(raw.monetary, quantiles.monetary),
          raw: raw // Manteniamo anche i punteggi grezzi
        };
      }
      
      return scores;
    }
  
    assignScore(value, quantiles, inverse = false) {
      if (inverse) {
        if (value <= quantiles.q20) return 5;
        if (value <= quantiles.q40) return 4;
        if (value <= quantiles.q60) return 3;
        if (value <= quantiles.q80) return 2;
        return 1;
      } else {
        if (value >= quantiles.q80) return 5;
        if (value >= quantiles.q60) return 4;
        if (value >= quantiles.q40) return 3;
        if (value >= quantiles.q20) return 2;
        return 1;
      }
    }
  
    segmentCustomers(rfmScores) {
      const segments = {};
      
      for (const [customerId, scores] of Object.entries(rfmScores)) {
        const segment = this.determineSegment(scores.r, scores.f, scores.m);
        if (!segments[segment]) {
          segments[segment] = [];
        }
        segments[segment].push({
          customerId,
          scores: scores
        });
      }
      
      return segments;
    }
  
    determineSegment(r, f, m) {
      if (r >= 4 && f >= 4 && m >= 4) return 'Champions';
      if (r >= 3 && f >= 3 && m >= 3) return 'Loyal';
      if (r >= 3 && f >= 1 && m >= 2) return 'Potential';
      if (r >= 4 && f === 1) return 'New';
      if (r === 2 && f >= 2) return 'At Risk';
      return 'Lost';
    }
  
    countSegments(segments) {
      const counts = {};
      for (const [segment, customers] of Object.entries(segments)) {
        counts[segment] = customers.length;
      }
      return counts;
    }
  
    calculateAggregateMetrics(rawScores) {
      const scores = Object.values(rawScores);
      const recencyValues = scores.map(s => s.recency);
      const frequencyValues = scores.map(s => s.frequency);
      const monetaryValues = scores.map(s => s.monetary);
  
      return {
        averageRecency: this.calculateAverage(recencyValues),
        averageFrequency: this.calculateAverage(frequencyValues),
        averageMonetary: this.calculateAverage(monetaryValues),
        recencyRange: {
          min: Math.min(...recencyValues),
          max: Math.max(...recencyValues)
        },
        frequencyRange: {
          min: Math.min(...frequencyValues),
          max: Math.max(...frequencyValues)
        },
        monetaryRange: {
          min: Math.min(...monetaryValues),
          max: Math.max(...monetaryValues)
        }
      };
    }
  
    calculateAverage(array) {
      return array.reduce((a, b) => a + b, 0) / array.length;
    }
  }
  
  export default new RFMService();