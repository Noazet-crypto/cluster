import { DomWatch } from './watch';
import { StoreService } from './store/service';
import { WebSocketService } from './service/websocket';
import { Constant } from './constant';

export class App {
    static socketServer: string;
    private static loaded: number = 0;

    static init(callback: () => void) {
        StoreService.Account.current(() => {
            this.loadData(callback);
        });
        document.addEventListener("visibilitychange", () => {
            DomWatch.visibleChanged();
        });
        window.onresize = () => {
            DomWatch.visibleChanged();
        }
    }

    private static loadData(callback: () => void) {
        StoreService.Trade.loadProducts(() => {
            WebSocketService.Instance.connect(Constant.SOCKET_SERVER, () => {
                StoreService.Trade.subscribeAllTicker();
                callback && callback();
            }, (msg: any) => {
                StoreService.Trade.parseWebSocketMessage(msg);
            });
        });
    }


    static getQuery(name: string) {
        var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)"),
            matchs= window.location.search.substr(1).match(reg);
        return  matchs ? decodeURIComponent(matchs[2]) : null;
    }

    static loading(show: boolean) {

        let dom = document.getElementById('GlobalPageLoading');
        dom.style.display = show ? 'flex' : 'none';

    }
}
