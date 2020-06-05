import { HttpService } from '../../../service/http';
import { Dom, Component, Prop, Watch, Emit } from "../../component";

@Dom('panel-wallet-list', require('./wallet-list.jade')())
export class WalletListPanelComponent extends Component {

    @Prop()
    selectedWallet: any;

    funds: any[] = [];

    mounted() {
        super.mounted();
        HttpService.Account.getFunds([]).then((response: any) => {
            response.forEach((balance: any) => {
                balance.available = Number(balance.available).toFixed(8);
                balance.total = (Number(balance.available) + Number(balance.hold)).toFixed(8);
                balance.hold = Number(balance.hold).toFixed(8);
            });
            this.funds = response;
            this.select(response[0]);
        });
    }

    @Emit('send')
    send(productId: string) {}

    @Emit('receive')
    receive(productId: string) {}

    @Emit('select')
    select(wallet: any) {}
}