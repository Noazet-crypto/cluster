import { Dom, Component, Prop, Watch } from "../../component";

@Dom('page-loading', require('./loading.jade')())
export class PageLoadingComponent extends Component {
    mounted() {
        super.mounted();
    }
}