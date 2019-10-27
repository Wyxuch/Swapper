const electron = require('electron')
const app = electron.app
const BrowserWindow = electron.BrowserWindow

let mainWindow

function createWindow () {
  mainWindow = new BrowserWindow({
    width: 700, 
    height: 400, 
    frame: false, 
    transparent: true,
    webPreferences: {
      nodeIntegration: true
  }
  })
  mainWindow.setResizable(false)

  mainWindow.loadURL(`file://${__dirname}/index.html`)

  mainWindow.on('closed', function () {
    mainWindow = null
  })

  mainWindow.on('resize', (e) => {
    e.preventDefault()
  })
}

process.env['ELECTRON_DISABLE_SECURITY_WARNINGS'] = 'true';

app.on('ready', createWindow)
app.on('window-all-closed', function () {
    app.quit()
})






