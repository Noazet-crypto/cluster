import { Dom, Prop, Component} from "../component";

@Dom('logo', require('./logo.jade')())
export class LogoComponent extends Component {
    @Prop()
    theme: string;

    mounted() {
        super.mounted();
    }
}