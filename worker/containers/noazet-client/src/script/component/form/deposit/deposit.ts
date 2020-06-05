import { HttpService } from '../../../service/http';
import { Dom, Component, Prop, Watch, Emit } from "../../component";

@Dom('form-deposit', require('./deposit.jade')())
export class DepositFormComponent extends Component {
    @Prop()
    currency: string;
    address: string = '';
    qrcode: any;

    mounted() {
        super.mounted();
        this.onCurrencyChange();
        this.qrcode = new (window as any).QRCode(this.$refs.qrcode);
    }

    @Watch('currency')
    onCurrencyChange() {
        HttpService.Account.getDepositAddress(this.currency).then((response: any) => {
            this.address = response.address;
            this.qrcode && this.qrcode.clear();
            this.qrcode.makeCode({
                text: this.address,
                width: 400,
                height: 400,
                colorDark : "#000000",
                colorLight : "#ffffff"
            });
        });
    }
}