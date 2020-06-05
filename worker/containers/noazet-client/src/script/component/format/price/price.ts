import { Dom, Prop, Watch, Component} from "../../component";

@Dom('format-price', require('./price.jade')())
export class PriceFormatComponent extends Component {
    @Prop()
    price: number;

    @Prop()
    type: number;

    @Prop()
    fixed: number;

    format: any = [0, 0];
    css:string;
    priceFixed: string;

    created() {
        this.css = `type-${this.type}`;
    }

    mounted() {
        super.mounted();
        this.onPriceChange();
    }

    @Watch('price')
    onPriceChange() {
        this.priceFixed = this.fixed ? this.price.toFixed(this.fixed) : String(this.price);
        this.format = String(this.priceFixed).split('.');
    }
}