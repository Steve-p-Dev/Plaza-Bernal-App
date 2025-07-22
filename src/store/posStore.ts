
export interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  isFree?: boolean; // Para productos gratuitos por promociones
}

export interface OrderItem {
  productId: string;
  productName: string;
  price: number;
  quantity: number;
  isFree?: boolean;
}

export interface Order {
  id: string;
  items: OrderItem[];
  total: number;
  status: 'pending' | 'preparing' | 'ready' | 'paid';
  paymentMethod?: 'cash' | 'transfer';
  createdAt: Date;
  tableNumber?: number;
  serviceType?: 'servirse' | 'llevar' | 'domicilio';
}

export interface Expense {
  id: string;
  concept: string;
  amount: number;
  date: Date;
}

export interface DailySummary {
  totalCash: number;
  totalTransfer: number;
  totalExpenses: number;
  totalSales: number;
  salesByProduct: Record<string, { quantity: number; total: number }>;
  date: Date;
}

class POSStore {
  private products: Product[] = [
    // Packs de Tacos (Promoción principal)
    { id: 'pack-3-tacos', name: 'Pack 3 Tacos', price: 5.50, category: 'Packs' },
    
    // Tacos individuales (precio real pero rara vez se usan)
    { id: '1', name: 'Chicharrón', price: 1.50, category: 'Tacos' },
    { id: '2', name: 'Tacubayo', price: 1.50, category: 'Tacos' },
    { id: '3', name: 'Chorizo', price: 1.50, category: 'Tacos' },
    { id: '4', name: 'Coshiloco', price: 1.50, category: 'Tacos' },
    { id: '5', name: 'Pastor', price: 1.50, category: 'Tacos' },
    { id: '6', name: 'Asada', price: 1.50, category: 'Tacos' },
    { id: '7', name: 'Suadero', price: 1.50, category: 'Tacos' },
    
    // Antojitos
    { id: '8', name: 'Esquites', price: 2.50, category: 'Antojitos' },
    { id: '9', name: 'Burrito', price: 5.00, category: 'Antojitos' },
    { id: '10', name: 'Totopos Dorados', price: 4.00, category: 'Antojitos' },
    { id: '11', name: 'Chilaquiles Malverde', price: 5.00, category: 'Antojitos' },
    { id: '12', name: 'Porción extra de tortillas (3u)', price: 1.50, category: 'Antojitos' },
    
    // Postres
    { id: '13', name: 'Pan de Elote', price: 2.50, category: 'Postres' },
    
    // Bebidas
    { id: '14', name: 'Agua de Jamaica', price: 1.00, category: 'Bebidas' },
    { id: '15', name: 'Tepache de Piña', price: 1.00, category: 'Bebidas' },
    { id: '16', name: 'Refresco de Cola', price: 1.00, category: 'Bebidas' },
    { id: '17', name: 'Cerveza Mexicana', price: 3.50, category: 'Bebidas' },
    { id: '18', name: 'Cerveza Nacional', price: 2.50, category: 'Bebidas' },
    { id: '19', name: 'Micheladas', price: 6.00, category: 'Bebidas' },
    { id: '20', name: 'Cocteles', price: 8.00, category: 'Bebidas' },
    { id: '21', name: 'PinshiGallo', price: 2.50, category: 'Bebidas' },
    
    // Salsas (GRATIS - incluidas con tacos)
    { id: '22', name: 'Salsa Borracha', price: 0, category: 'Salsas', isFree: true },
    { id: '23', name: 'Salsa Quesos', price: 0, category: 'Salsas', isFree: true },
    { id: '24', name: 'Salsa Picosa', price: 0, category: 'Salsas', isFree: true },
    { id: '25', name: 'Salsa No Picosa', price: 0, category: 'Salsas', isFree: true },
    { id: '26', name: 'Salsa pa gño chille', price: 0, category: 'Salsas', isFree: true },
    { id: '27', name: 'Salsa Verde', price: 0, category: 'Salsas', isFree: true },
    { id: '28', name: 'Salsa Roja', price: 0, category: 'Salsas', isFree: true },
    { id: '29', name: 'Salsa Chipotle', price: 0, category: 'Salsas', isFree: true },
    
    // Productos adicionales
    { id: '30', name: 'Sopa Azteca', price: 5.00, category: 'Sopas' },
    { id: '31', name: 'Torta de Jamón', price: 3.00, category: 'Tortas' },
    
    // Promociones por día (productos gratis según promoción)
    { id: 'promo-esquites', name: 'Esquites (Promoción)', price: 0, category: 'Promociones', isFree: true },
    { id: 'promo-totopos', name: 'Totopos (Promoción)', price: 0, category: 'Promociones', isFree: true },
  ];

  private orders: Order[] = [];
  private expenses: Expense[] = [];
  private listeners: Array<() => void> = [];
  private initialCash: number = 0;

  subscribe(listener: () => void) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  private notify() {
    this.listeners.forEach(listener => listener());
  }

  getProducts(): Product[] {
    return [...this.products];
  }

  // Método para obtener promociones del día
  getDailyPromotion(): { day: string; freeItems: string[]; condition: string } {
    const days = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
    const today = new Date().getDay();
    const currentDay = days[today];
    
    const promotions: Record<string, { freeItems: string[]; condition: string }> = {
      'Jueves': { 
        freeItems: ['Esquites'], 
        condition: 'Por 2 órdenes de tacos incluye esquite gratis' 
      },
      'Viernes': { 
        freeItems: ['Totopos'], 
        condition: 'Por 4 órdenes de tacos incluye totopos gratis' 
      },
      'Sábado': { 
        freeItems: ['Cerveza Nacional'], 
        condition: '4 Cervezas nacionales + totopos por $12' 
      }
    };
    
    return {
      day: currentDay,
      freeItems: promotions[currentDay]?.freeItems || [],
      condition: promotions[currentDay]?.condition || 'No hay promoción especial hoy'
    };
  }

  addProduct(product: Omit<Product, 'id'>): void {
    const newProduct = {
      ...product,
      id: Date.now().toString()
    };
    this.products.push(newProduct);
    this.notify();
  }

  updateProduct(id: string, updates: Partial<Product>): void {
    const index = this.products.findIndex(p => p.id === id);
    if (index !== -1) {
      this.products[index] = { ...this.products[index], ...updates };
      this.notify();
    }
  }

  deleteProduct(id: string): void {
    this.products = this.products.filter(p => p.id !== id);
    this.notify();
  }

  getOrders(): Order[] {
    return [...this.orders];
  }

  addOrder(items: OrderItem[], tableNumber?: number, serviceType?: 'servirse' | 'llevar' | 'domicilio'): string {
    const total = items.reduce((sum, item) => {
      return sum + (item.isFree ? 0 : item.price * item.quantity);
    }, 0);
    
    const newOrder: Order = {
      id: Date.now().toString(),
      items,
      total,
      status: 'pending',
      createdAt: new Date(),
      tableNumber,
      serviceType
    };
    this.orders.push(newOrder);
    this.notify();
    return newOrder.id;
  }

  updateOrderStatus(id: string, status: Order['status']): void {
    const order = this.orders.find(o => o.id === id);
    if (order) {
      order.status = status;
      this.notify();
    }
  }

  updateOrderPayment(id: string, paymentMethod: 'cash' | 'transfer'): void {
    const order = this.orders.find(o => o.id === id);
    if (order) {
      order.paymentMethod = paymentMethod;
      order.status = 'paid';
      this.notify();
    }
  }

  addExpense(concept: string, amount: number): void {
    const expense: Expense = {
      id: Date.now().toString(),
      concept,
      amount,
      date: new Date()
    };
    this.expenses.push(expense);
    this.notify();
  }

  getExpenses(): Expense[] {
    return [...this.expenses];
  }

  setInitialCash(amount: number): void {
    this.initialCash = amount;
    this.notify();
  }

  getInitialCash(): number {
    return this.initialCash;
  }

  getDailySummary(): DailySummary {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const todayOrders = this.orders.filter(order => 
      order.createdAt >= today && order.status === 'paid'
    );
    
    const todayExpenses = this.expenses.filter(expense => 
      expense.date >= today
    );

    const totalCash = todayOrders
      .filter(o => o.paymentMethod === 'cash')
      .reduce((sum, o) => sum + o.total, 0);

    const totalTransfer = todayOrders
      .filter(o => o.paymentMethod === 'transfer')
      .reduce((sum, o) => sum + o.total, 0);

    const totalExpenses = todayExpenses.reduce((sum, e) => sum + e.amount, 0);

    const salesByProduct: Record<string, { quantity: number; total: number }> = {};
    
    todayOrders.forEach(order => {
      order.items.forEach(item => {
        // Saltar productos gratis o promocionales en el conteo
        if (item.isFree) return;
        
        // Normalizar el nombre del producto para unificar ventas
        let normalizedName = item.productName;
        
        // Verificar si es un taco individual para agrupar en Pack de 3 Tacos
        const tacoNames = ['Chicharrón', 'Tacubayo', 'Chorizo', 'Coshiloco', 'Pastor', 'Asada', 'Suadero'];
        const isTaco = tacoNames.includes(item.productName);
        
        // Si es un pack de tacos o taco individual, usar "Pack de 3 Tacos" para unificar
        if (item.productName.includes('Pack 3 Tacos') || isTaco) {
          normalizedName = 'Pack de 3 Tacos';
        }
        
        if (!salesByProduct[normalizedName]) {
          salesByProduct[normalizedName] = { quantity: 0, total: 0 };
        }
        salesByProduct[normalizedName].quantity += item.quantity;
        salesByProduct[normalizedName].total += item.price * item.quantity;
      });
    });

    return {
      totalCash,
      totalTransfer,
      totalExpenses,
      totalSales: totalCash + totalTransfer,
      salesByProduct,
      date: today
    };
  }
}

export const posStore = new POSStore();
