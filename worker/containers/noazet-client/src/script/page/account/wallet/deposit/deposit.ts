import { HttpService } from '../../../../service/http';
import { Page, Route } from "../../../page";

@Route('/account/balance/deposit', require('./deposit.jade')())
export class AccountWalletDepositPage extends Page {
    currency: string;
    
    created() {
        this.currency = this.$route.query.currency;
    }

    mounted() {
        super.mounted();
        this.pageLoadingHide();
    }
}