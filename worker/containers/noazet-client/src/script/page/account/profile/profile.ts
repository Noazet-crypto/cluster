import { StoreService } from '../../../store/service';
import { HttpService } from '../../../service/http';
import { MODAL_CHANGE_PASSWORD } from '../../../component/modal/change-password/change-password';
import { Page, Route } from "../../page";

@Route('/account/profile', require('./profile.jade')())
export class AccountProfilePage extends Page {
    account: any = {
        avatar: '',
        nickname  : '',
    }

    mounted() {
        this.needLogin = true;
        super.mounted();
        this.pageLoadingHide();
        // this.setTitle('Exchange');
        this.account = Object.assign({}, StoreService.Account.userInfo);
    }

    changePassword() {
        this.createModal(MODAL_CHANGE_PASSWORD);
    }

    upload(file: any) {
        HttpService.File.upload((this.$refs.file as HTMLInputElement).files[0]).then((url: string) => {
            this.account.avatar = url;
            StoreService.Account.saveAvatar(url).then(() => {});
        });
    }

    updateNickname() {
        if (this.account.nickname) {
            StoreService.Account.saveNickname(this.account.nickname).then(() => {});
        }
    }
}