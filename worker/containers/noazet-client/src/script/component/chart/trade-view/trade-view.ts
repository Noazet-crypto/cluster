import { DomWatch } from '../../../watch';
import { Dom, Component, Prop, Watch, Emit } from "../../component";

@Dom('chart-trade-view', require('./trade-view.jade')())
export class TradeViewChartComponent extends Component {
    @Prop()
    productId: string;

    tabIndex: number = 0;

    mounted() {
        super.mounted();
    }

    switchPrice() {
        this.tabIndex = 0;
        DomWatch.visibleChanged();
    }
    switchDepth() {
        this.tabIndex = 1;
        DomWatch.visibleChanged();
    }
}