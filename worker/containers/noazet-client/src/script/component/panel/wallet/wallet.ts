import { Dom, Component, Prop, Watch, Emit } from "../../component";

@Dom('panel-wallet', require('./wallet.jade')())
export class WalletPanelComponent extends Component {
    @Prop()
    wallet: any;

    mounted() {
        super.mounted();
    }

    @Emit('send')
    send(currency: string) {}

    @Emit('receive')
    receive(currency: string) {}
}