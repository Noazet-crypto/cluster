import { Page, Route } from "../page";

@Route('/', require('./home.jade')())
export class HomePage extends Page {
    mounted() {
        super.mounted();
        this.pageLoadingHide();
        // this.setTitle('Exchange');
    }
}