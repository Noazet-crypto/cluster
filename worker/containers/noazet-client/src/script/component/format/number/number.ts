import { Dom, Prop, Watch, Component} from "../../component";

@Dom('format-number', require('./number.jade')())
export class NumberFormatComponent extends Component {
    @Prop()
    num: number;

    @Prop()
    fixed: number;

    v1: string = '';
    v2: string = '';
    numFixed: string;

    mounted() {
        super.mounted();
        this.onNumChange();
    }

    @Watch('num')
    onNumChange() {
        this.numFixed = this.fixed ? this.num.toFixed(this.fixed) : String(this.num);
        this.v1 = String(Number(this.numFixed));
        this.v2 = this.numFixed.substr(this.v1.length);
    }
}