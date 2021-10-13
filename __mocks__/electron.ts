export const ipcRenderer = {
  events: {} as { [key: string]: Function | any },
  on (event: string, handler: Function) {
    this.events[event] = handler
  },
  send (event: string, data: any) {
    this.events[event](event, data)
  },
  removeAllListeners (event: string) {
    this.events[event] = undefined
  },
  invoke (event: string, data: any) {
    this.events[event](event, data)
  }
}

// Auto-Injected
export const app = {
  on (event: string, handler: Function) {},
  setAsDefaultProtocolClient (...args: any[]) {},
  requestSingleInstanceLock ()  {},
  quit () {}
}
