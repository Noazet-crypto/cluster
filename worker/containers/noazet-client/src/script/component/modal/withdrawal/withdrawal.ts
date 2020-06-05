import { Dom, Component, Prop, Watch, Emit } from "../../component";

@Dom('modal-withdrawal', require('./withdrawal.jade')())
export class WithdrawalModalComponent extends Component {

    @Prop()
    data: any;

    @Emit('close')
    close() {}

    transfer: {
        amount: number,
        address: string
    } = {
        amount: undefined,
        address: ''
    };
    tabbarItems: any[] = [];
    error: string = '';
    loading: boolean = false;
    currency: string;
    withdrawaled: boolean = false;

    created() {
        this.data.currencies.forEach((currency: string) => {
            this.tabbarItems.push({
                currency: currency,
                active: false
            });
        });
        this.tabbarChange(0);
    }

    mounted() {
        super.mounted();
    }

    tabbarChange(index: number) {
        this.tabbarItems.forEach((item: any, i: number) => {
            item.active = i == index;
        });
        this.currency = this.tabbarItems[index].currency;
    }

    withdrawalSuccess() {
        this.withdrawaled = true;
    }
}