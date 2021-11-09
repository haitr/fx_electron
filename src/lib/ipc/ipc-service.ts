import {
    IpcMainEvent,
    ipcRenderer,
    IpcRendererEvent,
} from 'electron'
  
export interface IpcChannelInterface {
  name: string
  mapHandler: Map<string, Function>
  handle(event: IpcMainEvent, request: IpcRequest): void
  map(action: string, handler: Function): void
}

export class IpcRequest {
  responseChannel: string
  params?: any[]

  constructor(channel: IpcChannelInterface, args: any[]) {
    this.params = args
    this.responseChannel = `${channel.name}$response`
  }
}

export class SimpleIpcChannel implements IpcChannelInterface {
  name = Math.random().toString(36).substring(7)
  mapHandler = new Map<string, Function>()

  constructor(name: string) {
    this.name = name
  }

  handle(event: IpcMainEvent, request: IpcRequest): void {
    // validation
    if (!request.params || request.params.length == 0) {
      throw new Error('Request param is empty')
    }
    let action = request.params[0] as string
    if (!this.mapHandler.has(action)) {
      throw new Error('Unknown action')
    }
    // send result to render process
    let handler = this.mapHandler.get(action)!
    let args = request.params.splice(0, 1)
    event.sender.send(request.responseChannel, handler(args))
  }

  map(action: string, handler: Function): void {
    this.mapHandler.set(action, handler)
  }
}

export default class IpcService {
  public send(channel: IpcChannelInterface, ...args: any[]): Promise<any> {
    let req = new IpcRequest(channel, args)
    ipcRenderer.send(channel.name, req)
    return new Promise(resolve => {
      ipcRenderer.once(
        req.responseChannel,
        (event: IpcRendererEvent, response: any) => {
          // console.log(response)
          resolve(response)
        }
      )
    })
  }
}