import { DomWatch } from '../../../watch';
import { StoreService } from '../../../store/service';
import { Dom, Component, Prop, Watch, Emit } from "../../component";
import { getTradingViewConfig } from '../../../chart/config';
import { UDFCompatibleDatafeed } from '../../../chart/datafeed';

declare var TradingView: any;
declare var AmCharts: any;

@Dom('chart-tradingview', require('./tradingview.jade')())
export class TradingviewChartComponent extends Component {
    @Prop()
    productId: string;
    loading: boolean = false;
    chart: any;

    mounted() {
        super.mounted();
        let containerId = `TradeView-${String(Math.random()).slice(2)}`,
            container = this.$refs.container as HTMLDivElement;
        container.setAttribute('id', containerId);
        DomWatch.visibleChange(container, (state: boolean) => { 
            if (state && !this.chart) {
                this.loading = true;
                this.chart = new TradingView.widget(
                    getTradingViewConfig(containerId, new UDFCompatibleDatafeed(this.productId, 5, 1))
                );
                this.chart.onChartReady(() => {
                    this.chart.chart().createStudy('Moving Average', false, false, [10], null, {'Plot.color': '#626D80', 'Plot.linewidth': 2});
                    this.chart.chart().createStudy('Moving Average', false, false, [30], null, {'Plot.color': '#B7692B', 'Plot.linewidth': 2});
                    this.loading = false;
                });
            }
        });
    }

    get object() {
        return StoreService.Trade.getObject(this.productId);
    }
}