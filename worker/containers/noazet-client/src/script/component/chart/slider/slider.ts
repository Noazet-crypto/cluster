import { StoreService } from '../../../store/service';
import { Dom, Component, Prop, Watch, Emit } from "../../component";

@Dom('chart-slider', require('./slider.jade')())
export class ChartSliderComponent extends Component {
    mounted() {
        super.mounted();
    }

    get products() {
        return StoreService.Trade.products.concat(StoreService.Trade.products);
    }
}