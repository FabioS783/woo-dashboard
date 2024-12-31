import loadingService from './LoadingService';
import configService from './ConfigService';
import rfmService from './RFMService';


class WooCommerceService {
  constructor() {
    const config = configService.getConfig();
    this.baseUrl = config.apiUrl.replace(/\/$/, '');
    this.consumerKey = config.consumerKey;
    this.consumerSecret = config.consumerSecret;
    this.cache = new Map();
    this.cacheTimeout = 5 * 60 * 1000; // 5 minuti
  }

  async fetchData(endpoint) {
    const baseEndpoint = endpoint.includes('?') ? 
      `${endpoint}&` : 
      `${endpoint}?`;
      
    const params = new URLSearchParams({
      consumer_key: this.consumerKey,
      consumer_secret: this.consumerSecret,
      per_page: 100
    }).toString();

    try {
      let allData = [];
      let page = 1;
      let hasMore = true;

      while (hasMore) {
        loadingService.setProgress(Math.min(20 + (page * 10), 60), 'Recupero dati...');

        const response = await fetch(
          `${this.baseUrl}/wp-json/wc/v3/${baseEndpoint}${params}&page=${page}`, 
          {
            method: 'GET',
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json'
            }
          }
        );

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        allData = allData.concat(data);
        hasMore = data.length === 100;
        page++;
      }

      return allData;
    } catch (error) {
      console.error('Error fetching data:', error);
      throw error;
    }
  }

  parseDateRange(range) {
    if (typeof range === 'object' && range.type === 'custom') {
      const end = new Date(range.endDate);
      end.setHours(23, 59, 59, 999);
      return {
        start: range.startDate,
        end: end
      };
    }

    const now = new Date();
    const start = new Date();
    const end = new Date();
    end.setDate(end.getDate() - 1); // Imposta la fine al giorno precedente per default
    end.setHours(23, 59, 59, 999);

    const rangeType = typeof range === 'object' ? range.type : range;

    switch (rangeType) {
      case 'last5days':
        // Parti da ieri e vai indietro di 5 giorni
        start.setDate(end.getDate() - 4); // -4 perché end è già impostato a ieri
        start.setHours(0, 0, 0, 0);
        break;
      case 'today':
        // Per 'today' usiamo il giorno corrente
        end.setDate(now.getDate());
        start.setHours(0, 0, 0, 0);
        end.setHours(23, 59, 59, 999);
        break;
      case 'yesterday':
        start.setDate(start.getDate() - 1);
        start.setHours(0, 0, 0, 0);
        break;
      case 'last7days':
        // Parti da ieri e vai indietro di 7 giorni
        start.setDate(end.getDate() - 6); // -6 perché end è già impostato a ieri
        start.setHours(0, 0, 0, 0);
        break;
      case 'thisMonth':
        // Dal primo del mese fino a ieri
        start.setDate(1);
        start.setHours(0, 0, 0, 0);
        break;
      case 'lastMonth':
        start.setMonth(start.getMonth() - 1);
        start.setDate(1);
        start.setHours(0, 0, 0, 0);
        end.setDate(0); // Ultimo giorno del mese precedente
        break;
      case 'last3months':
        start.setMonth(start.getMonth() - 3);
        start.setDate(1);
        start.setHours(0, 0, 0, 0);
        break;
      case 'thisYear':
        start.setMonth(0, 1);
        start.setHours(0, 0, 0, 0);
        break;
      default:
        // Default: ultimi 5 giorni, escludendo oggi
        start.setDate(end.getDate() - 4);
        start.setHours(0, 0, 0, 0);
    }

    return { start, end };
  }

  async getRFMAnalysis(dateRange = 'last3months') {
    try {
      loadingService.setProgress(10, 'Inizializzazione analisi RFM...');

      const { start, end } = this.parseDateRange(dateRange);
      const orderStates = ['completed'];  // Per RFM consideriamo solo ordini completati
      
      loadingService.setProgress(30, 'Recupero storico ordini...');
      const orders = await this.fetchData(
        `orders?after=${start.toISOString()}&before=${end.toISOString()}&status=${orderStates}`
      );

      loadingService.setProgress(60, 'Calcolo metriche RFM...');
      const rfmAnalysis = rfmService.calculateRFMScores(orders, end);

      loadingService.setProgress(100, 'Analisi RFM completata');
      return rfmAnalysis;

    } catch (error) {
      console.error('Error getting RFM analysis:', error);
      throw error;
    }
  }


  
  async getDashboardData(dateRange = 'last5days') {
    try {
      loadingService.reset();
      loadingService.setProgress(10, 'Inizializzazione...');

      const { start, end } = this.parseDateRange(dateRange);
      const orderStates = ['completed', 'processing', 'on-hold'].join(',');
      
      loadingService.setProgress(20, 'Recupero ordini...');
      const orders = await this.fetchData(
        `orders?after=${start.toISOString()}&before=${end.toISOString()}&status=${orderStates}`
      );

      loadingService.setProgress(60, 'Analisi dati...');
      const orderAnalysis = this.analyzeOrders(orders);
      
      loadingService.setProgress(80, 'Preparazione report...');
      const result = {
        totalRevenue: orderAnalysis.totalRevenue,
        totalOrders: orders.length,
        averageOrderValue: orders.length > 0 ? orderAnalysis.totalRevenue / orders.length : 0,
        totalProductsSold: orderAnalysis.totalProducts,
        revenueData: this.calculateRevenueData(orders, dateRange),
        topProducts: orderAnalysis.topProducts,
        customerMetrics: orderAnalysis.customerMetrics,
        advancedMetrics: {
          repeatPurchaseRate: orderAnalysis.repeatPurchaseRate,
          averageItemsPerOrder: orderAnalysis.averageItemsPerOrder,
          topCategories: orderAnalysis.categories
        }
      };

      loadingService.setProgress(100, 'Completato');
      return result;

    } catch (error) {
      console.error('Error getting dashboard data:', error);
      throw error;
    }
  }

  analyzeOrders(orders) {
    const analysis = {
      totalRevenue: 0,
      totalProducts: 0,
      topProducts: new Map(),
      categories: new Map(),
      customers: new Set(),
      repeatingCustomers: new Set(),
      customerOrders: new Map()
    };

    orders.forEach((order, index) => {
      analysis.totalRevenue += parseFloat(order.total);

      const customerId = order.customer_id;
      analysis.customers.add(customerId);
      
      if (!analysis.customerOrders.has(customerId)) {
        analysis.customerOrders.set(customerId, []);
      }
      analysis.customerOrders.get(customerId).push(order);

      if (analysis.customerOrders.get(customerId).length > 1) {
        analysis.repeatingCustomers.add(customerId);
      }

      order.line_items.forEach(item => {
        analysis.totalProducts += item.quantity;

        if (!analysis.topProducts.has(item.product_id)) {
          analysis.topProducts.set(item.product_id, {
            name: item.name,
            sales: 0,
            revenue: 0,
            quantity: 0
          });
        }
        const product = analysis.topProducts.get(item.product_id);
        product.sales += item.quantity;
        product.revenue += parseFloat(item.total);
        product.quantity += item.quantity;

        if (item.categories) {
          item.categories.forEach(cat => {
            if (!analysis.categories.has(cat.id)) {
              analysis.categories.set(cat.id, {
                name: cat.name,
                revenue: 0,
                orders: 0,
                products: 0
              });
            }
            const category = analysis.categories.get(cat.id);
            category.revenue += parseFloat(item.total);
            category.orders++;
            category.products += item.quantity;
          });
        }
      });

      if (index % 10 === 0) {
        const progress = 60 + Math.min((index / orders.length) * 20, 20);
        loadingService.setProgress(progress, 'Analisi dati...');
      }
    });

    return {
      totalRevenue: analysis.totalRevenue,
      totalProducts: analysis.totalProducts,
      topProducts: Array.from(analysis.topProducts.values())
        .sort((a, b) => b.revenue - a.revenue)
        .slice(0, 5),
      categories: Array.from(analysis.categories.values())
        .sort((a, b) => b.revenue - a.revenue)
        .slice(0, 5),
      customerMetrics: {
        total: analysis.customers.size,
        repeat: analysis.repeatingCustomers.size,
        new: analysis.customers.size - analysis.repeatingCustomers.size
      },
      repeatPurchaseRate: (analysis.repeatingCustomers.size / analysis.customers.size) * 100,
      averageItemsPerOrder: analysis.totalProducts / orders.length
    };
  }

  calculateRevenueData(orders, dateRange) {
    if (dateRange === 'today' || dateRange === 'yesterday') {
      return this.calculateHourlyRevenue(orders);
    }
    return this.calculateDailyRevenue(orders);
  }

  calculateHourlyRevenue(orders) {
    const hourlyData = Array.from({ length: 24 }, (_, i) => ({
      date: new Date().setHours(i, 0, 0, 0),
      name: `${String(i).padStart(2, '0')}:00`,
      value: 0
    }));

    orders.forEach(order => {
      const date = new Date(order.date_created);
      const hour = date.getHours();
      hourlyData[hour].value += parseFloat(order.total);
    });

    return hourlyData
      .sort((a, b) => a.date - b.date)
      .map(({ date, ...rest }) => rest);
  }

  calculateDailyRevenue(orders) {
    const dailyData = {};
    
    orders.forEach(order => {
      const date = new Date(order.date_created);
      const dayKey = date.toISOString().split('T')[0];
      
      if (!dailyData[dayKey]) {
        dailyData[dayKey] = {
          date: new Date(dayKey),
          name: new Date(dayKey).toLocaleDateString('it-IT', { 
            day: 'numeric',
            month: 'short' 
          }),
          value: 0
        };
      }
      
      dailyData[dayKey].value += parseFloat(order.total);
    });

    return Object.values(dailyData)
      .sort((a, b) => a.date - b.date)
      .map(({ date, ...rest }) => rest);
  }
}

// Creiamo e esportiamo un'istanza singleton
const wooCommerceService = new WooCommerceService();
export default wooCommerceService;