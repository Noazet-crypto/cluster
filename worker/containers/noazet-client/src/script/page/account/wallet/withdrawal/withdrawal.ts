import { HttpService } from '../../../../service/http';
import { Page, Route } from "../../../page";

@Route('/account/balance/withdrawal', require('./withdrawal.jade')())
export class AccountWalletWithdrawalPage extends Page {
    currency: string;

    created() {
        this.currency = this.$route.query.currency;
    }

    mounted() {
        super.mounted();
        this.pageLoadingHide();
    }
}