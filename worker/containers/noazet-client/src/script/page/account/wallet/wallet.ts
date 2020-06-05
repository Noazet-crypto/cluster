import { Page, Route } from "../../page";

@Route('/account/wallet', require('./wallet.jade')())
export class AccountWalletPage extends Page {
    wallet: any = {};
    showWallets: boolean = false;

    mounted() {
        this.needLogin = true;
        super.mounted();
        this.pageLoadingHide();
        this.setTitle('Exchange | Digital Asset Exchange');
    }

    walletSelect(wallet: any) {
        this.wallet = wallet;
        this.showWallets = false;
    }

    deposit(currency: string) {
        this.createModal('modal-deposit', {currencies: [currency]});
    }

    withdrawal(currency: string) {
        this.createModal('modal-withdrawal', {currencies: [currency]});
    }

    transaction(transaction: any) {
        this.createModal('modal-transaction', {transaction: transaction});
    }
}