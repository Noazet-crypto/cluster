import { Dom, Prop, Watch, Emit, Component} from "../component";

@Dom('pagination', require('./pagination.jade')())
export class PaginationComponent extends Component {

    @Prop()
    count: number;

    @Prop()
    value: number;

    page: number = 0;

    mounted() {
        super.mounted();
        this.page = this.value;
    }

    prev() {
        this.page --;
        this.input(this.page);
    }

    next() {
        this.page ++;
        this.input(this.page);
    }

    @Emit('input')
    input(v: number) {}
}