const {app, BrowserWindow, ipcMain} = require("electron");
const settings = require("./settings/settings");
const rabbitmq = require("./rabbitmq/rabbitmq");
const logService = require("./log-service/index.js");

let window;

let context = {
	new: (message) => {
		console.log("Received new message: ", JSON.stringify(message));
		window.webContents.send('new', message)
	},
	load: (callback) => {
		logService.get(callback)
	}
};

settings.load(__dirname, (config) => {
	logService.init(config.get('log-service'), () => {});
	rabbitmq.init(config.get("rabbitmq"), () => {
		rabbitmq.consume(context.new)
	});
});

function createWindow() {
	window = new BrowserWindow({
		height: 720,
		width: 1400
	});

	app.on('closed', () => {
		window = null;
	});

	app.on('window-all-closed', () => {
		app.quit()
	});

	// window.loadURL('http://localhost:8080');
	window.loadURL(`file://${__dirname}/app/index.html`);

	ipcMain.on('get', (e, data) => {
		console.log(data);
		context.load((result) => {
			e.sender.send('get', result);
		})
	})
}

app.on('ready', createWindow);
