import { Moment } from '../../../vendor';
import { Watch } from '../../../component/component';
import { StoreService } from '../../../store/service';
import { Helper } from '../../../helper';
import { HttpService } from '../../../service/http';
import { Page, Route } from "../../page";

@Route('/account/order', require('./order.jade')())
export class AccountOrderPage extends Page {
    selected: number = 0;
    selectedProduct: string = '';
    products: string[] = [];
    orders: any[] = [];
    loading: boolean = false;
    cursor: any = {};
    cursorDirection: number = 1;
    cursorBefore: number = 0;
    cursorAfter: number = 0;

    created() {
        this.products = Helper.map(StoreService.Trade.products, (item: any) => {
            return item.id;
        });
    }

    mounted() {
        this.needLogin = true;
        super.mounted();
        this.pageLoadingHide();
        this.onSelected();
        // this.setTitle('Exchange');
    }

    get product() {
        return StoreService.Trade.getObject(this.products[this.selected]).product;
    }

    @Watch('selected')
    onSelected() {
        this.loading = true;
        HttpService.Order.getOrders(this.product.id, 30, [], this.cursor).then((response: any) => {
            response.items.forEach((order: any) => {
                order.statusFormat = order.status;
                order.price = Number(order.price).toFixed(this.product.quoteScale);
                order.fillFees = Number(order.fillFees).toFixed(this.product.quoteScale);
                order.filledSize = Number(order.filledSize).toFixed(4);
                order.size = Number(order.size).toFixed(4);
                order.timeFormat = Moment(order.createdAt).format('MM-DD hh:mm:ss');
                order.priceFormat = Number(order.price) ? order.price: 'MARKET';
            });
            this.cursorAfter = response.after;
            this.cursorBefore = response.before;
            this.orders = response.items;
            this.loading = false;
        });
    }

    @Watch('cursorDirection')
    onCursorDirection(_new: number, _old: number) {
        if (_new > _old) {
            this.cursor = {
                after: this.cursorAfter
            }
        }
        else {
            this.cursor = {
                before: this.cursorBefore
            }
        }
        this.onSelected();
    }
}