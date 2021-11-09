import { 
  app, 
  protocol,
  BrowserWindow,
  ipcMain,
  IpcMainEvent,
} from "electron"
import * as path from "path"
import { IpcChannelInterface } from '@/lib/ipc/interface'

interface BaseWindowOptions {
  width?: number
  height?: number
  resizable?: boolean
}

interface BaseOptions {
  window?: BaseWindowOptions
  template?: string
}

class BaseWindow {
  private options!: BaseOptions
  private mainWindow?: BrowserWindow
  //
  private ready?: Function

  constructor(options: BaseOptions, ready?: Function) {
    this.options = options
    this.ready = ready
    app.on("ready", this.onReady.bind(this))
    app.on("activate", this.onActivate.bind(this))
    app.on("window-all-closed", this.onWindowAllClosed.bind(this))
  }

  private createWindow(): Electron.BrowserWindow {
    let window = new BrowserWindow({
      height: this.options.window?.height || 800, 
      width: this.options.window?.width || 600,
      resizable: this.options.window?.resizable || true,
      webPreferences: {
        nodeIntegration: true
      }
    })
    if (!this.options.template) {
      throw new Error('HTML template must not be null.')
    }
    this.registerProtocol()
    // Note: loadURL -> can't access assets via relative paths
    // loadFile -> ok no problem
    // window.loadURL(`app://${this.options.template ?? ''}`)
    let htmlPath = path.resolve(__dirname, this.options.template)
    window.loadFile(htmlPath)

    window.on("closed", () => {
      this.mainWindow = undefined
    })

    return window
  }

  private onReady() {
    this.mainWindow = this.createWindow()
    this.ready && this.ready()
  }

  private onActivate() {
    if (!this.mainWindow) {
      this.mainWindow = this.createWindow()
    }
  }

  private onWindowAllClosed() {
    if (process.platform !== "darwin") {
      app.quit()
    }
  }

  private registerProtocol() {
    var prc = 'app'
    protocol.registerFileProtocol(
      prc,
      function(req, callback) {
        var actualPath = path.resolve(
          __dirname, 
          req.url.substring(`${prc}://`.length)
        )
        callback({path: actualPath})
      }
    )
  }

  protected registerIpcChannels(channels: IpcChannelInterface[] | IpcChannelInterface) {
    let chns = []
    if (channels instanceof Array) {
      chns = channels
    } else {
      chns = [channels]
    }
    chns.forEach((channel: IpcChannelInterface) => {
      ipcMain.on(
        channel.name,
        (evt: IpcMainEvent, request) => {
          channel.handle(evt, request)
        }
      )
    })
  }
}

export default BaseWindow 