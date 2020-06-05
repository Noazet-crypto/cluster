import { HttpService } from '../../../service/http';
import { Dom, Component, Prop, Watch, Emit } from "../../component";

@Dom('form-withdrawal', require('./withdrawal.jade')())
export class WithdrawalFormComponent extends Component {
    @Prop()
    currency: string;

    transfer: {
        amount: number,
        address: string
    } = {
        amount: undefined,
        address: ''
    };

    error: string = '';
    loading: boolean = false;

    @Emit()
    success() {}

    mounted() {
        super.mounted();
    }

    submit() {
        if (!this.transfer.address) {
            this.error = `The ${this.currency} address is required`;
            return;
        }
        if (Number(this.transfer.amount <= 0)) {
            this.error = `Please enter amount more than 0`;
            return;
        }
        this.error = '';
        this.loading = true;
        HttpService.Account.postWithdrawal(this.currency, this.transfer).then(() => {
            this.success();
        }).catch((error) => {
            this.error = error.response.data.message;
            this.loading = false;
        });
    }
}