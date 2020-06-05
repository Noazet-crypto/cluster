import { HttpService } from '../../../service/http';
import { Dom, Component, Prop } from "../../component";

@Dom('panel-order-list', require('./order-list.jade')())
export class OrderListPanelComponent extends Component {
    @Prop()
    orders: any[];

    @Prop()
    theme: string;

    @Prop()
    product: any;

    @Prop()
    loading: boolean;

    mounted() {
        super.mounted();
    }

    cancel(order: any) {
        order.status = 'canceling';
        order.statusFormat = 'canceling';
        HttpService.Order.cancelOrder(order.id).then(() => {
            order.status = 'cancelled';
            order.statusFormat = 'cancelled';
        })
    }
}