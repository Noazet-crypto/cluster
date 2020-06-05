import { HttpService } from '../../../service/http';
import { Page, Route } from "../../page";

@Route('/account/forgot', require('./forgot.jade')())
export class AccountForgotPage extends Page {
    account: any = {};
    error: string = '';
    codeIsSend: boolean = false;

    mounted() {
        super.mounted();
        this.pageLoadingHide();
        // this.setTitle('Exchange');
    }

    submit() {
        if (this.codeIsSend) {
            if (!this.account.newPassword) {
                this.error = "Password is required";
                return;
            }
            HttpService.Account.resetPassword(this.account).then(() => {
                this.$router.replace('signin?alert=forgot');
            }).catch((error: any) => {
                this.error = error.response.data.message;
            });
        }
        else {
            let reg = new RegExp("^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$");
            if (!reg.test(this.account.email)) {
                this.error = "Email doesn't look correct";
                return;
            }
            HttpService.Account.sendEmailVerifyCode(this.account.email).then(() => {
                this.codeIsSend = true;
            }).catch((error: any) => {
                this.error = error.response.data.message;
            });
        }
    }
}