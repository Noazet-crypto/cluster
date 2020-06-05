
import { Helper } from '../../../helper';
import { StoreService } from '../../../store/service';
import { Dom, Component, Prop, Watch, Emit } from "../../component";

@Dom('panel-trade-history', require('./trade-history.jade')())
export class TradeHistoryPanelComponent extends Component {

    @Prop()
    productId: string;

    lastedHistory: string[] = [];

    mounted() {
        super.mounted();
    }

    @Emit('tabbar-change')
    tabbarChange(index: number) {}

    switchOrderBook() {
        this.tabbarChange(0);
    }

    get object() {
        return StoreService.Trade.getObject(this.productId);
    }

    get history() {
        let history = this.object.tradeHistory;
        history.forEach((item: any) => {
            item.size = Number(item.size);
            item.price = Number(item.price);
        });
        this.lastedHistory = Helper.map(history, (item: any) => {
            return item.makerOrderId;
        });
        return history;
    }
}