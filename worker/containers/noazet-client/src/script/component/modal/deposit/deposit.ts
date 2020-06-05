import { Dom, Component, Prop, Watch, Emit } from "../../component";

@Dom('modal-deposit', require('./deposit.jade')())
export class DepositModalComponent extends Component {

    @Prop()
    data: any;

    address: string = '';
    tabbarItems: any[] = [];
    currency: string;

    @Emit('close')
    close() {}

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
        })
        this.currency = this.tabbarItems[index].currency;
    }
}