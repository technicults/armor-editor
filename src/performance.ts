// Performance optimization utilities
export class PerformanceMonitor {
  private metrics: Map<string, number[]> = new Map();
  private observer: PerformanceObserver | null = null;

  constructor() {
    if (typeof PerformanceObserver !== 'undefined') {
      this.observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          this.recordMetric(entry.name, entry.duration);
        }
      });
      this.observer.observe({ entryTypes: ['measure'] });
    }
  }

  startMeasure(name: string) {
    performance.mark(`${name}-start`);
  }

  endMeasure(name: string) {
    performance.mark(`${name}-end`);
    performance.measure(name, `${name}-start`, `${name}-end`);
  }

  private recordMetric(name: string, value: number) {
    if (!this.metrics.has(name)) {
      this.metrics.set(name, []);
    }
    const values = this.metrics.get(name)!;
    values.push(value);
    
    // Keep only last 100 measurements
    if (values.length > 100) {
      values.shift();
    }
  }

  getMetrics() {
    const result: Record<string, any> = {};
    
    this.metrics.forEach((values, name) => {
      const avg = values.reduce((a, b) => a + b, 0) / values.length;
      const min = Math.min(...values);
      const max = Math.max(...values);
      
      result[name] = {
        average: Math.round(avg * 100) / 100,
        min: Math.round(min * 100) / 100,
        max: Math.round(max * 100) / 100,
        count: values.length
      };
    });
    
    return result;
  }

  destroy() {
    if (this.observer) {
      this.observer.disconnect();
    }
    this.metrics.clear();
  }
}

export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: number;
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(null, args), wait) as any;
  };
}

export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;
  
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func.apply(null, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

export class VirtualScroll {
  private container: HTMLElement;
  private itemHeight: number;
  private visibleItems: number;
  private totalItems: number;
  private renderItem: (index: number) => HTMLElement;
  private scrollTop = 0;

  constructor(
    container: HTMLElement,
    itemHeight: number,
    totalItems: number,
    renderItem: (index: number) => HTMLElement
  ) {
    this.container = container;
    this.itemHeight = itemHeight;
    this.totalItems = totalItems;
    this.renderItem = renderItem;
    this.visibleItems = Math.ceil(container.clientHeight / itemHeight) + 2;
    
    this.setupScrolling();
  }

  private setupScrolling() {
    this.container.style.overflowY = 'auto';
    this.container.style.height = `${this.totalItems * this.itemHeight}px`;
    
    const throttledScroll = throttle(() => {
      this.scrollTop = this.container.scrollTop;
      this.render();
    }, 16);
    
    this.container.addEventListener('scroll', throttledScroll);
    this.render();
  }

  private render() {
    const startIndex = Math.floor(this.scrollTop / this.itemHeight);
    const endIndex = Math.min(startIndex + this.visibleItems, this.totalItems);
    
    // Clear existing items
    this.container.innerHTML = '';
    
    // Create spacer for items above viewport
    if (startIndex > 0) {
      const spacer = document.createElement('div');
      spacer.style.height = `${startIndex * this.itemHeight}px`;
      this.container.appendChild(spacer);
    }
    
    // Render visible items
    for (let i = startIndex; i < endIndex; i++) {
      const item = this.renderItem(i);
      this.container.appendChild(item);
    }
    
    // Create spacer for items below viewport
    const remainingItems = this.totalItems - endIndex;
    if (remainingItems > 0) {
      const spacer = document.createElement('div');
      spacer.style.height = `${remainingItems * this.itemHeight}px`;
      this.container.appendChild(spacer);
    }
  }
}
