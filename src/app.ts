import { 
  app
} from 'electron'
import Main from './screen/main/main'
import 'v8-compile-cache'

// stop Electron warning
app.allowRendererProcessReuse = true

// Install `electron-debug` with `devtron`
if (process.env.NODE_ENV === 'development') {
  const {
    default: installExtension,
    VUEJS_DEVTOOLS
  } = require('electron-devtools-installer')
  require('electron-debug')()
  
  // Install `vue-devtools`
  app.on('ready', () => {
    installExtension(VUEJS_DEVTOOLS)
      .then((name: string) => console.log(`Added Extension:  ${name}`))
      .catch((err: Error) => console.log('An error occurred: ', err));
  })
}

// Start
new Main()