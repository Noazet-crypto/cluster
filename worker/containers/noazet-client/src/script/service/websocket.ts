export class WebSocketService {
    static _instance: WebSocketService;
    static get Instance() {
        this._instance || (this._instance = new WebSocketService());
        return this._instance;
    }
    subscribes: string[] = [];
    ws: WebSocket;
    closed: boolean = false;
    onOpen: () => void;
    onMessage: (msg: any) => void;
    token: string;
    connect(socketServer: string, onOpen: () => void, onMessage: (msg: any) => void) {
        this.onOpen = onOpen;
        this.onMessage = onMessage;
        let connect = () => {
            this.ws = new WebSocket(socketServer);
            this.ws.onopen = () => {
                this.closed = false;
                if (this.subscribes.length > 0) {
                    this.subscribes.forEach((sub: any) => {
                        this.subscribe(sub);
                    });
                    this.subscribes = [];
                }
                this.onOpen && this.onOpen();
                this.onOpen = () => {};
            }
            this.ws.onmessage = (msg: any) => {
                msg = JSON.parse(msg.data);
                this.onMessage && this.onMessage(msg);
                if (msg.type == 'subscriptions') {
                    this.subscribes = [];
                    msg.channels.forEach((channel: any) => {
                        channel.channels = [channel.name];
                        channel.type = 'subscribe';
                        this.subscribes.push(channel);
                    });
                }
            };
            this.ws.onclose = () => {
                this.closed = true;
            };
            this.ws.onerror = () => {
                this.closed = true;
            }
        }
        connect();
        setInterval(() => {
            if (this.ws.readyState == 1) {
                //this.ws.send('{"type": "ping"}')
            }
            else {
                connect();
            }
        }, 5000);
    }

    subscribe(data: object) {
        this.ws.send(JSON.stringify(Object.assign(data, {
            token: this.token || ''
        })));
    }
}