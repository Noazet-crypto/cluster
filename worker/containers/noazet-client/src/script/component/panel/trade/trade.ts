import { Dom, Component, Prop, Watch, Emit } from "../../component";

@Dom('panel-trade', require('./trade.jade')())
export class TradePanelComponent extends Component {

    @Prop()
    groups: any[];

    mounted() {
        super.mounted();
    }

    toTrade(product: any) {
        location.href = '/trade/' + product.id;
    }
}