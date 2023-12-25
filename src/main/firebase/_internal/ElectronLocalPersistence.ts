/**
 * from https://github.com/firebase/firebase-js-sdk/blob/firebase@10.4.0/packages/auth/src/platform_browser/persistence/session_storage.ts
 *
 */

import settings from 'electron-settings';
import type { Persistence } from 'firebase/auth';

import {
  type PersistenceInternal as InternalPersistence,
  PersistenceType,
  type StorageEventListener,
} from './persistence';

import type { StorageLike } from './AbstractPersistenceStorage';
import { AbstractPersistenceStorage } from './AbstractPersistenceStorage';

const settingStorage: StorageLike = {
  setItem(key: string, value: string): void {
    settings.setSync(key, value);
  },
  getItem(key: string): string | null {
    const value = settings.getSync(key);
    return typeof value === 'string' ? value : null;
  },
  removeItem(key: string): void {
    settings.unsetSync(key);
  },
};

/**
 * SessionStorage実装を参照
 * mainプロセスで利用するため、SessionStorage同様1プロセスでのみ利用できるAPIを踏襲すれば良い
 */
class ElectronLocalPersistence extends AbstractPersistenceStorage implements InternalPersistence {
  // NOTE: firebaseのlocalStoragePersistenceと同じ値になっている
  static type = 'LOCAL' as const;

  constructor() {
    super(() => settingStorage, PersistenceType.LOCAL);
  }

  _addListener(_key: string, _listener: StorageEventListener): void {
    return;
  }

  _removeListener(_key: string, _listener: StorageEventListener): void {
    return;
  }
}

export const ElectronLocalPersistenceForTest = ElectronLocalPersistence;

/**
 * An implementation of {@link Persistence} of type `LOCAL` using `electron-settings`
 * for the underlying storage.
 *
 * @public
 */
export const electronLocalPersistence: Persistence = ElectronLocalPersistence;
