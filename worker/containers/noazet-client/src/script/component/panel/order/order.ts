import { HttpService } from '../../../service/http';
import { StoreService } from '../../../store/service';
import { Dom, Component, Prop, Watch, Emit } from "../../component";

@Dom('panel-order', require('./order.jade')())
export class OrderPanelComponent extends Component {

    @Prop()
    productId: string;

    loading: boolean = true;
    cancelAllBtnEnable: boolean = false;

    mounted() {
        super.mounted();
        if (StoreService.Account.logined) {
            StoreService.Trade.loadOpenOrders(this.productId, () => {
                this.loading = false;
            });
        }
        else {
            this.loading = false;
        }
    }

    get object(): any {
        return StoreService.Trade.getObject(this.productId);
    }

    get openOrders() {
        if (!StoreService.Account.logined) {
            return [];
        }
        this.cancelAllBtnEnable = false;
        return this.object.openOrders.map((order: any) => {
            if (order.status == 'open') this.cancelAllBtnEnable = true;
            return order;
        }).slice(0, 30);
    }

    cancelAll() {
        this.openOrders.forEach((order: any) => {
            if (order.status == 'open') {
                order.status = 'canceling';
                order.statusFormat = 'canceling';
            }
        });
        HttpService.Order.cancelAll(this.productId).then(() => {});
    }
}