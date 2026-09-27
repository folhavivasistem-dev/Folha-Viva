/**
 * Serviço de persistência local isolado com prefixo e tipagem estrita
 */

import { config } from '../../core/config';

class StorageService {
  private prefix: string;
  private memoryFallback: Map<string, string>;

  constructor(prefix: string = config.storagePrefix) {
    this.prefix = prefix;
    this.memoryFallback = new Map();
  }

  private getKey(key: string): string {
    return `${this.prefix}${key}`;
  }

  private isLocalStorageAvailable(): boolean {
    try {
      const testKey = '__storage_test__';
      window.localStorage.setItem(testKey, testKey);
      window.localStorage.removeItem(testKey);
      return true;
    } catch {
      return false;
    }
  }

  public get<T>(key: string): T | null {
    const fullKey = this.getKey(key);

    try {
      if (this.isLocalStorageAvailable()) {
        const item = window.localStorage.getItem(fullKey);
        if (item === null) return null;
        return JSON.parse(item) as T;
      }
      const memoryItem = this.memoryFallback.get(fullKey);
      if (!memoryItem) return null;
      return JSON.parse(memoryItem) as T;
    } catch {
      return null;
    }
  }

  public set<T>(key: string, value: T): boolean {
    const fullKey = this.getKey(key);

    try {
      const serialized = JSON.stringify(value);
      if (this.isLocalStorageAvailable()) {
        window.localStorage.setItem(fullKey, serialized);
        return true;
      }
      this.memoryFallback.set(fullKey, serialized);
      return true;
    } catch {
      return false;
    }
  }

  public remove(key: string): void {
    const fullKey = this.getKey(key);
    try {
      if (this.isLocalStorageAvailable()) {
        window.localStorage.removeItem(fullKey);
      }
      this.memoryFallback.delete(fullKey);
    } catch {
      // Ignora falha de remoção segura
    }
  }

  public clearNamespace(): void {
    try {
      if (this.isLocalStorageAvailable()) {
        const keysToRemove: string[] = [];
        for (let i = 0; i < window.localStorage.length; i++) {
          const key = window.localStorage.key(i);
          if (key && key.startsWith(this.prefix)) {
            keysToRemove.push(key);
          }
        }
        keysToRemove.forEach((key) => window.localStorage.removeItem(key));
      }
      this.memoryFallback.clear();
    } catch {
      // Silencioso em isolamento
    }
  }
}

export const storageService = new StorageService();
