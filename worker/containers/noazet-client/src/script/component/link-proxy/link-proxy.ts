import { Dom, Component, Prop, Watch } from "../component";

@Dom('link-proxy', require('./link-proxy.jade')())
export class LinkProxyComponent extends Component {
    @Prop()
    to: string;

    mounted() {
        super.mounted();
    }

    goto() {
        this.$router.push(`/proxy?href=${this.to}`);
    }
}