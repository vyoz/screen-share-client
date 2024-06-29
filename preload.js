const {
  contextBridge,
  desktopCapturer,
  ipcRenderer,
  dialog,
} = require('electron');

contextBridge.exposeInMainWorld('electron', {
  desktopCapturer: desktopCapturer,
  ipcRenderer: {
    send: (channel, data) => {
      ipcRenderer.send(channel, data);
    },
    on: (channel, func) => {
      ipcRenderer.on(channel, (event, ...args) => func(...args));
    },
  },
  dialog: dialog,
});
