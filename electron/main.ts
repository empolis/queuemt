import { app, BrowserWindow, ipcMain } from 'electron'
import * as path from 'path'
import * as url from 'url'
import { CommandHandler } from './kafka/command-handler'
import { KafkaCommandRequest } from './interfaces/kafka.interface'
import { BrowserWindowConstructorOptions } from 'electron/main'

const isProduction = () => process.env.NODE_ENV === 'production'

let windows: { name: string; window: BrowserWindow }[] = []

/**
 * Creates a BrowserWindow and adds it to the window store
 *
 * @param name name to identifiy the window
 * @param urlPath url to open inside the window
 * @param options BrowserWindow options
 * @param hideMenu if true, hides the windows menu bar
 */
const createWindow = (
  name: string,
  urlPath: string,
  options: BrowserWindowConstructorOptions,
  hideMenu: boolean = false
) => {
  const window = new BrowserWindow(options)

  if (process.env.NODE_ENV === 'development') {
    // in development mode, use local dev server
    window.loadURL(`http://localhost:4000${urlPath}`)
  } else {
    // in production mode, use static files
    window.loadURL(
      `${url.format({
        pathname: path.join(__dirname, './renderer/index.html'),
        protocol: 'file:',
        slashes: true
      })}#${urlPath}`
    )
  }

  if (hideMenu) {
    window.setMenu(null)
  }

  window.on('closed', () => {
    windows = windows.filter((window) => window.name !== name)
  })

  windows.push({
    name,
    window
  })
}

/**
 * Get the BrowserWindow object by it's name
 *
 * @param name name to identify the window
 */
export const getWindow = (name: string) => {
  return windows.find((window) => window.name === name)
}

const registerReadyListener = () => {
  app.whenReady().then(() => {
    // create the main window
    createWindow(
      'main',
      '',
      {
        title: 'QueueMT',
        width: 880,
        height: 570,
        webPreferences: {
          nodeIntegration: true
        },
        resizable: true,
        backgroundColor: '#F2F2F2'
      },
      isProduction()
    )

    // attach IPC listeners
    initializeIpcListeners()
  })
}

const registerOpenUrlListener = () => {
  app.on('open-url', (event, url) => {
    handleOpenUrl(url)
  })
}

const handleOpenUrl = (data: string) => {
  if (!data) {
    return
  }

  const args = data.split('://')[1]
  if (!args) {
    return
  }

  setTimeout(() => {
    getWindow('main')?.window.webContents.send('open-url', args.substring(0, args.length))
  }, 1000)
}

// Register system wide URL protocol
if (process.defaultApp) {
  if (process.argv.length >= 2) {
    app.setAsDefaultProtocolClient('queuemt', process.execPath, [
      path.resolve(process.argv[1])
    ])
  }
} else {
  app.setAsDefaultProtocolClient('queuemt')
}

// Windows specific needed for URL protocol
const gotTheLock = app.requestSingleInstanceLock()

if (!gotTheLock) {
  app.quit()
} else if (process.platform === 'win32') {
  app.on('second-instance', (event, commandLine, workingDirectory) => {
    const mainWindow = getWindow('main')?.window
    // Someone tried to run a second instance, we should focus our window.
    if (mainWindow) {
      if (mainWindow.isMinimized()) {
        mainWindow.restore()
      }

      mainWindow.focus()
    }

    handleOpenUrl(commandLine.join('###'))
  })

  registerReadyListener()
  registerOpenUrlListener()

  handleOpenUrl(process.argv.join('###') || '')
} else {
  registerReadyListener()
  registerOpenUrlListener()
}

app.allowRendererProcessReuse = true

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})

const initializeIpcListeners = () => {
  const kafkaCommandHandler = new CommandHandler()

  // handler for kafka messages
  ipcMain.handle(
    'kafka',
    async (event: any, args: KafkaCommandRequest<any>) =>
      await kafkaCommandHandler.handleCommand(args)
  )

  // handler for window actions
  ipcMain.handle('window', (event: any, args: any) => {
    if (args.action === 'maximize') {
      // maximize the window
      getWindow('main')?.window.maximize()
    } else if (args.action === 'unmaximize') {
      // unmaximize the window
      getWindow('main')?.window.unmaximize()
    } else if (args.action === 'open') {
      // open a new window using name and path from given arguments
      createWindow(
        args.name,
        args.path,
        {
          width: 880,
          height: 570,
          webPreferences: {
            nodeIntegration: true
          },
          resizable: true,
          backgroundColor: '#F2F2F2'
        },
        isProduction()
      )
    }
  })
}
