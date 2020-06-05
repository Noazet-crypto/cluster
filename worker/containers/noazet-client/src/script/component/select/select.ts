import { Dom, Prop, Watch, Emit, Component} from "../component";

@Dom('v-select', require('./select.jade')())
export class SelectComponent extends Component {
    @Prop()
    options: string[];

    @Prop({default: 'Search for option'})
    placeHoder: string;

    @Prop()
    value: number;

    @Prop()
    search: boolean;

    documentListener: any; 
    showDropdown: boolean = false;
    selectValue: string = '';

    mounted() {
        super.mounted();
        this.onOptionsChange();
        this.documentListener = document.addEventListener('click', () => {
            this.showDropdown = false;
            this.selectValue = this.selectValue || this.options[this.value];
        });
    }

    get filterOptions() {
        return this.search ? this.options.filter((opt: string) => {
            return opt.toLowerCase().indexOf(this.selectValue.toLowerCase()) >= 0;
        }) : this.options;
    }
    
    @Watch('options')
    onOptionsChange() {
        this.options.length > 0 && (this.selectValue = this.options[this.value]);
    }

    @Emit()
    select(opt: string, index: number) {}

    selectOpt(opt: string, index: number) {
        this.showDropdown = false;
        this.selectValue = opt;
        this.input(index);
    }

    @Emit()
    input(index: number) {}

    clear() {
        this.selectValue = '';
    }

    dropDown() {
        this.showDropdown = true;
        this.selectValue = '';
    }
}