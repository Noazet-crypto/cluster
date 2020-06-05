import { StoreService } from '../../../store/service';
import { Dom, Component, Prop, Watch, Emit } from "../../component";

@Dom('header-home', require('./home.jade')())
export class NavbarHomeComponent extends Component {
    @Prop() 
    active: number;

    private nickname: string = '';
    private showDropdown: boolean = false;
    private documentListener: any;

    mounted() {
        super.mounted();
        this.documentListener = document.addEventListener('click', () => {
            this.showDropdown = false;
        });
    }

    get userInfo() {
        return StoreService.Account.userInfo;
    }

    dropdownToggle() {
        this.showDropdown = !this.showDropdown;
    }

    destroyed() {
        clearInterval(this.documentListener);
    }
}