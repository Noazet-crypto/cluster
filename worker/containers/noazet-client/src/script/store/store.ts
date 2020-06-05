import { BaseStoreInstance } from '../vendor';


export class Store {
    protected store: any;
    constructor() {
        this.store = new BaseStoreInstance(this.storeOptions);
    }
    get storeOptions() {
        return {};
    }
}
