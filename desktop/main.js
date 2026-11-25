const { app, BrowserWindow, Menu, shell } = require('electron');

// نفس شاشات الهاتف ونفس السيرفر (Firebase). الصفحة تنحمّل من الموقع وتنحفظ بالـ service worker،
// فالبرنامج ينفتح بدون إنترنت بعد أول تشغيل، وكل تحديث للموقع يوصل وحده بدون مثبّت جديد.
const APP_URL = 'https://ghassan-sabei.github.io/duration-of-buildings/';

// نافذة وحدة بس
if (!app.requestSingleInstanceLock()) { app.quit(); }

let win = null;
function createWindow() {
  Menu.setApplicationMenu(null);
  win = new BrowserWindow({
    width: 1100,
    height: 820,
    minWidth: 420,
    minHeight: 600,
    title: 'دوام البنايات',
    autoHideMenuBar: true,
    webPreferences: { contextIsolation: true, nodeIntegration: false }
  });
  win.webContents.setWindowOpenHandler(({ url }) => {
    if (url.startsWith('blob:')) return { action: 'allow' };
    shell.openExternal(url);
    return { action: 'deny' };
  });
  win.loadURL(APP_URL);
}

app.on('second-instance', () => {
  if (win) { if (win.isMinimized()) win.restore(); win.focus(); }
});
app.whenReady().then(createWindow);
app.on('window-all-closed', () => app.quit());
