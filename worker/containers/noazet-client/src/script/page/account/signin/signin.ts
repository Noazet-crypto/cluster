import { StoreService } from '../../../store/service';
import { Helper } from '../../../helper';
import { App } from '../../../app';
import { HttpService } from '../../../service/http';
import { Page, Route } from "../../page";

@Route('/account/signin', require('./signin.jade')())
export class AccountSigninPage extends Page {
    account: {
        email: string,
        password: string
    } = {
        email: '',
        password: ''
    };
    error: string = '';
    alert: string = '';

    mounted() {
        super.mounted();
        this.pageLoadingHide();
        // this.setTitle('Exchange');
        setTimeout(() => {
            (this.$refs.inputEmail as HTMLInputElement).disabled = false;
            (this.$refs.inputPassword as HTMLInputElement).disabled = false;
        }, 400)
        if (this.$route.query.alert) {
            if (this.$route.query.alert=='forgot') {
                this.alert = 'Your password has been reset! You can now continue below.';
            }
        }
    }

    submit() {
        HttpService.Account.signin(this.account.email, this.account.password).then((response: any) => {
            HttpService.Account.saveToken(response);
            StoreService.Account.current(() => {
                if (this.$route.query.ref) {
                    this.$router.push(this.$route.query.ref);
                }
                else {
                    this.$router.push(`/account/profile`);
                }
            })
        }).catch((res: any) => {
            this.error = res.message;
        });
    }
}