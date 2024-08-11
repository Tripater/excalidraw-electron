import { app, BrowserWindow, ipcMain, Menu } from 'electron';
import path from 'path';
import { fileURLToPath } from 'url';
import isDev from 'electron-is-dev';
import { exec } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let mainWindow;
let serverProcess;

function createWindow() {
	app.commandLine.appendSwitch('auto-detect', 'false');
	app.commandLine.appendSwitch('no-proxy-server')
	
	const loadWindow = new BrowserWindow({
	  width: 320,
	  height: 320,
	  icon: path.join(__dirname, '..', 'assets', 'icon.ico'),
	  webPreferences: {
		nodeIntegration: true,
		contextIsolation: false
	  },
	  frame: false,
	  alwaysOnTop: true
	});
	
	loadWindow.loadFile(isDev
							? path.join(__dirname, '..', 'public', 'loading.html')
							: path.join(__dirname, '..', 'build', 'loading.html'));
	
	mainWindow = new BrowserWindow({
		width: 800,
		height: 600,
		icon: path.join(__dirname, '..', 'assets', 'icon.ico'),
		webPreferences: {
			contextIsolation: true,
			nodeIntegration: false,
		},
		show: false
	});
	
	Menu.setApplicationMenu(null)

	if(isDev) {
		mainWindow.loadURL('http://localhost:3000');
	} else {
		mainWindow.loadFile(path.join(__dirname, '..', 'build', 'index.html'));
	}

	mainWindow.webContents.once('dom-ready', () => {
		if (mainWindow) {
			loadWindow.destroy();
			mainWindow.maximize();
			mainWindow.show();
		}
	});

	mainWindow.on('closed', () => {
		mainWindow = null;
	});
}

function startServer() {
	if (isDev) {
		serverProcess = exec('npm start', (error, stdout, stderr) => {
			if (error) {
				console.error(`Server start error: ${error}`);
				return;
			}
			if (stderr) {
				console.error(`Server stderr: ${stderr}`);
			}
			console.log(`Server stdout: ${stdout}`);
		});
	}
}

function stopServer() {
	if (serverProcess) {
		serverProcess.kill();
	}
}

app.whenReady().then(() => {
	startServer();
	createWindow();
});

app.on('window-all-closed', () => {
	if (process.platform !== 'darwin') {
		app.quit();
	}
});

app.on('before-quit', () => {
	stopServer();
});

app.on('activate', () => {
	if (BrowserWindow.getAllWindows().length === 0) {
		createWindow();
	}
});
