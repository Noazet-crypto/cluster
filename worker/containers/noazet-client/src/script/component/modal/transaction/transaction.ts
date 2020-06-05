import { Dom, Component, Prop, Watch, Emit } from "../../component";

@Dom('modal-transaction', require('./transaction.jade')())
export class TransactionModalComponent extends Component {
    @Prop()
    data: any;

    @Emit('close')
    close() {}

    transaction: any = {};

    mounted() {
        super.mounted();
        this.transaction = this.data.transaction;
    }
}