import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('electron', {
  // Exponer funciones seguras para comunicación entre procesos
  scrape: async (searchTerm) => {
    return await ipcRenderer.invoke('scrape-data', searchTerm);
  },
  windowControl: async (action) => {
    return await ipcRenderer.invoke('window-control', action);
  },
  closeApp: async () => {
    return await ipcRenderer.invoke('close-app');
  },
  onMaximizeChange: (callback) => {
    ipcRenderer.on('maximize-change', (_, isMaximized) => callback(isMaximized));
  },
});
