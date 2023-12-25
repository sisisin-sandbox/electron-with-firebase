/**
 * from: https://github.com/firebase/firebase-js-sdk/blob/firebase@10.7.1/packages/auth/src/platform_browser/persistence/browser.ts
 */

import type { PersistenceType, PersistenceValue } from './persistence';
import { STORAGE_AVAILABLE_KEY } from './persistence';

/** node用の最低限のインターフェースだけ定義し直す */
export interface StorageLike {
  getItem: (key: string) => string | null;
  removeItem: (key: string) => void;
  setItem: (key: string, value: string) => void;
}

// There are two different browser persistence types: local and session.
// Both have the same implementation but use a different underlying storage
// object.
export abstract class AbstractPersistenceStorage {
  protected constructor(protected readonly storageRetriever: () => StorageLike, readonly type: PersistenceType) {}

  async _isAvailable(): Promise<boolean> {
    try {
      // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
      if (!this.storage) {
        return Promise.resolve(false);
      }
      this.storage.setItem(STORAGE_AVAILABLE_KEY, '1');
      this.storage.removeItem(STORAGE_AVAILABLE_KEY);
      return Promise.resolve(true);
    } catch {
      return Promise.resolve(false);
    }
  }

  async _set(key: string, value: PersistenceValue): Promise<void> {
    this.storage.setItem(key, JSON.stringify(value));
    return Promise.resolve();
  }

  async _get<T extends PersistenceValue>(key: string): Promise<T | null> {
    const json = this.storage.getItem(key);
    return Promise.resolve(json ? JSON.parse(json) : null);
  }

  async _remove(key: string): Promise<void> {
    this.storage.removeItem(key);
    return Promise.resolve();
  }

  protected get storage(): StorageLike {
    return this.storageRetriever();
  }
}
