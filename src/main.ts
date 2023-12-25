import { app, BrowserWindow, ipcMain, shell } from 'electron';
import { signInWithCustomToken } from 'firebase/auth';
import path from 'path';
import { fbAuth } from './main/firebase/firebase';

if (require('electron-squirrel-startup')) {
  app.quit();
}

const appUrl = 'el-sample';
if (process.defaultApp) {
  if (process.argv.length >= 2) {
    app.setAsDefaultProtocolClient(appUrl, process.execPath, [path.resolve(process.argv[1])]);
  }
} else {
  app.setAsDefaultProtocolClient(appUrl);
}

const createWindow = async () => {
  await new Promise<void>((done) => {
    const unsubscribe = fbAuth.onAuthStateChanged(() => {
      unsubscribe();
      done();
    });
  });

  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: { preload: path.join(__dirname, 'preload.js') },
  });

  if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {
    mainWindow.loadURL(MAIN_WINDOW_VITE_DEV_SERVER_URL);
  } else {
    mainWindow.loadFile(path.join(__dirname, `../renderer/${MAIN_WINDOW_VITE_NAME}/index.html`));
  }

  mainWindow.webContents.openDevTools();

  fbAuth.onAuthStateChanged((user) => {
    mainWindow.webContents.send('auth-state-changed', user?.uid ?? null);
  });
};

app.on('ready', createWindow);
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
app.on('open-url', async (event, urlString) => {
  const url = new URL(urlString);
  const token = url.searchParams.get('token');
  if (!token) {
    return;
  }

  await signInWithCustomToken(fbAuth, token)
    .then((userCredential) => {
      console.log('success', userCredential.user.uid);
    })
    .catch((error) => {
      console.log('error', error);
    });
});

ipcMain.handle('sign-in', async (_event) => {
  const u = new URL('http://localhost:3001');
  await shell.openExternal(u.toString());
});

ipcMain.handle('sign-out', async (_event) => {
  await fbAuth.signOut();
});
ipcMain.handle('get-user', async (_event) => {
  return fbAuth.currentUser?.uid ?? null;
});
