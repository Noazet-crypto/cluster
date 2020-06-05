import { Dom, Component, Prop, Watch } from "../../component";

@Dom('page-error', require('./error.jade')())
export class PageErrorComponent extends Component {
    @Prop()
    content: string;
    
    mounted() {
        super.mounted();
    }
}