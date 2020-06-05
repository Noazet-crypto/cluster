import { Page, Route } from "../page";

@Route('/proxy', require('./proxy.jade')())
export class ProxyPage extends Page {
    mounted() {
        this.$router.replace(this.$route.query.href);
    }
}