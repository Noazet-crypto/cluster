import { AccountStore } from './account';
import { TradeStore } from './trade';

export class StoreService {
    private static _account: AccountStore;
    static get Trade() {
        return TradeStore.instance();
    }
    static get Account() {
        this._account || (this._account = new AccountStore());
        return this._account;
    }
}
