import { Constant } from '../../../constant';
import { App } from '../../../app';
import { StoreService } from '../../../store/service';
import { Dom, Component, Prop, Watch, Emit } from "../../component";

@Dom('header-trade', require('./trade.jade')())
export class TradeHeaderComponent extends Component {

    @Prop()
    products: any[];

    @Prop()
    productId: string;

    private productSelectorShowing: boolean = false;
    private timeout: any;
    private nickname: string = '';
    private showDropdown: boolean = false;
    private documentListener: any;

    mounted() {
        super.mounted();
        this.nickname = StoreService.Account.userInfo.nickname;
        this.documentListener = document.addEventListener('click', () => {
            this.showDropdown = false;
        });
    }

    get userInfo() {
        return StoreService.Account.userInfo;
    }

    get product() {
        return StoreService.Trade.getObject(this.productId).product;
    }

    get productGroups() {
        let groups: any = {};
        StoreService.Trade.products.forEach((item: any) => {
            item.symbol = Constant.CURRENCY_SYMBOL[item.quoteCurrency];
            groups[item.quoteCurrency] || (groups[item.quoteCurrency] = []);
            groups[item.quoteCurrency].push(item);
        });
        return groups;
    }

    productSelectorHide(hidden: boolean) {
        clearTimeout(this.timeout);
        this.timeout = setTimeout(() => {
            this.productSelectorShowing = !hidden;
        }, 100);
    }

    dropdownToggle() {
        this.showDropdown = !this.showDropdown;
    }
  
    destroyed() {
        clearInterval(this.documentListener);
    }

    signOut() {
        StoreService.Account.signOut();
        this.showDropdown = false;
    }

    toSign() {
        this.$router.replace(`/account/signin?ref=${this.$route.fullPath}`)
    }

    toHome() {
        this.$router.push(`/`);
    }

    get logined() {
        return StoreService.Account.logined;
    }
}