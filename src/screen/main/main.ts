import BaseWindow from '@/base/base'
import userStore from '@/store/user.store'
import { SimpleIpcChannel } from '@/lib/ipc/ipc-service'
import { userAction } from '@/actions/action-type'

class Main extends BaseWindow {
  private ipcChannel?: SimpleIpcChannel

  constructor() {
    super(
      {
        window: {
          width: 500,
          height: 500,
          resizable: false
        },
        template: 'screen/main/index.html'
      }
    ),
    () => {
      // activate the store
      userStore.dispatch('activate')
    }

    // create ipc channel
    this.ipcChannel = new SimpleIpcChannel('main-screen-channel')
    this.registerIpcChannels(this.ipcChannel)
    global['channel'] = this.ipcChannel
    //// mapping
    this.ipcChannel.map(userAction.login, this.login)
  }

  login() {
    console.log("login")
  }

  increase() {
    userStore.dispatch('increment')
  }
}

export default Main