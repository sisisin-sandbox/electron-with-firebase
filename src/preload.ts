// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts

import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('app', {
  signIn: () => {
    ipcRenderer.invoke('sign-in');
  },
  signOut: () => {
    ipcRenderer.invoke('sign-out');
  },
  getUser: () => {
    return ipcRenderer.invoke('get-user');
  },

  onAuthStateChanged: (callback: (userId: string | null) => void) => {
    const listener = (_event: any, userId: string | null) => {
      callback(userId);
    };
    ipcRenderer.on('auth-state-changed', listener);
    return () => {
      ipcRenderer.off('auth-state-changed', listener);
    };
  },
});
