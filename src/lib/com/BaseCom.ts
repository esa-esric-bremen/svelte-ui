// Communication base class, handles incoming (or fake) data
// and forwards it to the right service.

import { browser } from "$app/environment";
import { addLogMessage } from "$lib/state/ui.svelte";

// TODO: Fallback to other URLs?

export default class BaseCom {
  protected websocket?: WebSocket;
  protected port: number;
  protected endpoint: string;

  private requestConnection: boolean = true;

  private queue: string[] = [];

  constructor(port: number, endpoint: string) {
    this.port = port;
    this.endpoint = endpoint;
  }

  connect() {
    if (!browser) {
      return;
    }
    if (this.connected()) {
      return;
    }
    this.requestConnection = false;
    this.reconnect();
  }

  public onError(ev: Event) {
    console.error(ev);
    addLogMessage(
      "WebSocket connection closed",
      "error"
    )
  }

  public onClose(ev: Event) {
    console.error(ev);
    console.log('WebSocket connection closed.');
    this.websocket = undefined;
    this.requestConnection = true;
    // aggressively reconnect
    setTimeout(this.reconnect.bind(this), 500);
  }

  private reconnect() {
    // const protocol = window.location.protocol === 'https:' ? 'wss' : 'ws';
    // const hostname = window.location.hostname;
    // const url = `${protocol}://${hostname}:${this.port}/${this.endpoint}`
    const url = `/${this.endpoint}`
    console.log(`Connecting to ${url}.`);
    this.websocket = new WebSocket(url);
    this.websocket.onmessage = this.handleMessage.bind(this);
    this.websocket.onopen = this.onOpen.bind(this);
    this.websocket.onerror = this.onError.bind(this);
    this.websocket.onclose = this.onClose.bind(this);
  }

  public send(msg: string) {
    if (this.requestConnection) {
      this.connect();
      this.requestConnection = false;
    }
    if (!this.websocket) {
      console.error('WebSocket not set')
      this.queue.push(msg);
      return
    }
    if (this.websocket.readyState !== this.websocket.OPEN) {
      console.info('WebSocket not connected')
      this.queue.push(msg);
      return
    }
    this.websocket.send(msg);
  }

  protected connected(): boolean {
    return (!!this.websocket) && this.websocket.readyState === WebSocket.OPEN
  }

  /**
   * check if websocket is open and in ready state
   */
  checkReady(): boolean {
    if (!this.websocket) {
      return false;
    }
    if (this.websocket.readyState !== this.websocket.OPEN) {
      addLogMessage('Error: WebSocket not ready')
      return false;
    }
    return true;
  }

  onOpen() {
    if (this.websocket && this.checkReady()) {
      for (const msg of this.queue) {
        this.websocket.send(msg);
      }
      this.queue = [];
    }
  }

  handleMessage(ev: MessageEvent) {
    // the server told us something
    throw new Error("Not implemented!");
  }
}
