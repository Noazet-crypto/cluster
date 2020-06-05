import { Dom, Component, Prop, Watch, Emit } from "../../component";

@Dom('page-alert', require('./alert.jade')())
export class PageAlertComponent extends Component {

    @Prop()
    title: string;

    @Prop()
    content: string;

    @Prop()
    cancelText: string;

    @Prop()
    submitText: string;

    mounted() {
        super.mounted();
    }

    @Emit('cancelEvent')
    cancel() {}

    @Emit('submitEvent')
    submit() {}
}