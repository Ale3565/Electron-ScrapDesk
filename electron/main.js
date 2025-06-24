import { app, BrowserWindow, ipcMain } from 'electron';
import path from 'path';
import { fileURLToPath } from 'url';
import process from 'process';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const isDev = process.env.NODE_ENV === 'development' || process.env.ELECTRON_ENV === 'development';

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js'),
    },
    frame: false, // Para la barra de título personalizada
  });

  if (isDev) {
    mainWindow.loadURL('http://localhost:5173');
    mainWindow.webContents.openDevTools();
  } else {
    // En producción, busca el index.html en la carpeta dist
    const indexPath = path.join(__dirname, '..', 'dist', 'index.html');
    console.log('Loading production path:', indexPath);
    mainWindow.loadFile(indexPath).catch((err) => {
      console.error('Error loading index.html:', err);
      // Intenta cargar desde una ruta alternativa
      const altPath = path.join(app.getAppPath(), 'dist', 'index.html');
      console.log('Trying alternative path:', altPath);
      mainWindow.loadFile(altPath).catch((err2) => {
        console.error('Error loading alternative path:', err2);
      });
    });
  }

  // Manejo de errores de carga
  mainWindow.webContents.on('did-fail-load', (event, errorCode, errorDescription) => {
    console.error('Failed to load:', errorCode, errorDescription);
  });

  // Manejo de eventos de ventana
  ipcMain.handle('window-control', (event, action) => {
    try {
      switch (action) {
        case 'minimize':
          mainWindow.minimize();
          return { success: true };
        case 'maximize':
          if (mainWindow.isMaximized()) {
            mainWindow.unmaximize();
          } else {
            mainWindow.maximize();
          }
          return { success: true };
        case 'close':
          mainWindow.close();
          return { success: true };
        default:
          throw new Error(`Acción no soportada: ${action}`);
      }
    } catch (error) {
      console.error('Error en window-control:', error);
      return { success: false, error: error.message };
    }
  });

  // Manejador específico para cerrar la aplicación
  ipcMain.handle('close-app', () => {
    try {
      app.quit();
      return { success: true };
    } catch (error) {
      console.error('Error al cerrar la aplicación:', error);
      return { success: false, error: error.message };
    }
  });

  // Enviar estado de maximización
  mainWindow.on('maximize', () => {
    mainWindow.webContents.send('maximize-change', true);
  });

  mainWindow.on('unmaximize', () => {
    mainWindow.webContents.send('maximize-change', false);
  });
}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit();
});

// Manejo de eventos IPC
ipcMain.handle('scrape-data', async (event, searchTerm) => {
  try {
    const { scrapeData } = await import('../src/webscraper.js');
    const filePath = await scrapeData(searchTerm);
    return { success: true, filePath };
  } catch (error) {
    console.error('Error en el scraping:', error);
    return { success: false, error: error.message };
  }
});
