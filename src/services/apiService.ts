type EventCallback = (data: any) => void;

class EventBus {
  private listeners: { [key: string]: EventCallback[] } = {};

  on(event: string, callback: EventCallback) {
    if (!this.listeners[event]) this.listeners[event] = [];
    this.listeners[event].push(callback);
    return () => {
      this.listeners[event] = this.listeners[event].filter((cb) => cb !== callback);
    };
  }

  emit(event: string, data?: any) {
    if (this.listeners[event]) {
      this.listeners[event].forEach((cb) => {
        try {
          cb(data);
        } catch (e) {
          console.error(`Error in event listener for ${event}:`, e);
        }
      });
    }

    // Broadcast across browser tabs if supported
    if (typeof BroadcastChannel !== 'undefined') {
      try {
        const bc = new BroadcastChannel('xeooo_restaurant_channel');
        bc.postMessage({ event, data, timestamp: Date.now() });
        bc.close();
      } catch {
        // ignore
      }
    }
  }
}

export const realtimeBus = new EventBus();

// Listen to other browser tabs
if (typeof BroadcastChannel !== 'undefined') {
  try {
    const bc = new BroadcastChannel('xeooo_restaurant_channel');
    bc.onmessage = (msg) => {
      if (msg.data?.event) {
        realtimeBus.emit(`local_${msg.data.event}`, msg.data.data);
      }
    };
  } catch {
    // ignore
  }
}

export async function simulateApiCall<T>(data: T, delayMs = 150): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(data), delayMs));
}

export async function retryWithBackoff<T>(fn: () => Promise<T>, retries = 3, delay = 200): Promise<T> {
  try {
    return await fn();
  } catch (err) {
    if (retries <= 1) throw err;
    await new Promise((r) => setTimeout(r, delay));
    return retryWithBackoff(fn, retries - 1, delay * 1.5);
  }
}
