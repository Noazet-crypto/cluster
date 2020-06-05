import { HttpService } from '../../../service/http';
import { Dom, Component, Prop, Watch, Emit } from "../../component";

export const MODAL_CHANGE_PASSWORD: string = 'modal-change-password';

@Dom(MODAL_CHANGE_PASSWORD, require('./change-password.jade')())
export class ChangePasswordModalComponent extends Component {

    @Prop()
    data: any;

    @Emit('close')
    close() {}

    pwd: any = {};
    error: string = '';
    loading: boolean = false;
    success: boolean = false;

    mounted() {
        super.mounted();
    }

    submit() {
        if (!this.pwd.oldPassword) {
            this.error = "Old password can't be blank";
            return;
        }
        if (!this.pwd.newPassword) {
            this.error = "New password can't be blank";
            return;
        }
        if (!this.pwd.confirm) {
            this.error = "Confirm New password can't be blank";
            return;
        }
        this.loading = true;
        HttpService.Account.changePassword(this.pwd.oldPassword, this.pwd.newPassword).then(() => {
            this.loading = false;
            this.success = true;
        }).catch((error: any) => {
            this.error = error.response.data.message;
        });
    }
}