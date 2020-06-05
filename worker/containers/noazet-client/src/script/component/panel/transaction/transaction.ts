import { Moment } from '../../../vendor';
import { HttpService } from '../../../service/http';
import { Dom, Component, Prop, Watch, Emit } from "../../component";

@Dom('panel-transaction', require('./transaction.jade')())
export class TransactionPanelComponent extends Component {
    @Prop()
    currency: string;

    transactions: any[] = [];

    mounted() {
        super.mounted();
    }

    @Watch('currency')
    onCurrencyChange() {

        HttpService.Account.getTransactions(this.currency).then((response: any) => {
            this.transactions = response;
            this.transactions.forEach((tran: any) => {
                tran.amountSymbol = tran.type == 'send' ? '−' : '+';
                tran.createdAt = Moment(tran.createdAt);
            });
        });
    }

    @Emit('detail')
    detail(transaction: any) {}
}