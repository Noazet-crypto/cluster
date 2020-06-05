import { StoreService } from '../../../store/service';
import { Dom, Component, Prop, Watch, Emit } from "../../component";

@Dom('header-navbar', require('./navbar.jade')())
export class NavbarHeaderComponent extends Component {

    @Prop() 
    active: number;

    private nickname: string = '';
    private showDropdown: boolean = false;
    private showMenuDropdown: boolean = false;
    private documentListener: any;

    mounted() {
        super.mounted();
        this.documentListener = document.addEventListener('click', () => {
            this.showDropdown = false;
            this.showMenuDropdown = false;
        });
    }

    get userInfo() {
        return StoreService.Account.userInfo;
    }

    dropdownToggle() {
        this.showDropdown = !this.showDropdown;
        this.showMenuDropdown = false;
    }
    menuDropdownToggle() {
        this.showMenuDropdown = !this.showMenuDropdown;
        this.showDropdown = false;
    }

    destroyed() {
        clearInterval(this.documentListener);
    }

    signOut() {
        StoreService.Account.signOut();
        this.showDropdown = false;
    }

    toSign() {
        this.$router.replace(`/account/signin?ref=${this.$route.fullPath}`)
    }

    toHome() {
        this.$router.replace(`/`);
    }

    get logined() {
        return StoreService.Account.logined;
    }
}