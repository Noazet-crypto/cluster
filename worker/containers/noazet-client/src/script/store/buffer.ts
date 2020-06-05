export class SocketMsgBuffer {
    private timeout: number = 0;
    private buffers: any[] = [];
    private action: (buffers: any[]) => void;
    constructor(action: (buffers: any[]) => void, timeout: number = 200) {
        this.timeout = timeout;
        this.action = action;
        setInterval(() => {
            if (this.buffers.length > 0) {
                this.action(this.buffers);
                this.buffers = [];
            }
        }, this.timeout);
    }
    push(data: any) {
        this.buffers.push(data);
    }
}