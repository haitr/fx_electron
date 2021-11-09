import { IpcChannelInterface } from "@/lib/ipc/interface";
declare global {
  namespace NodeJS {
    interface Global {
      document: Document
      window: Window
      navigator: Navigator
      channel: IpcChannelInterface
    } 
  }
}