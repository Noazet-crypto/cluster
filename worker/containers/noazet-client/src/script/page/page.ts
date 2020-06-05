import { DomWatch } from '../watch';
import { StoreService } from '../store/service';
import { App } from '../app';
import { BaseFramework, BaseComponent } from '../vendor';
import { Route } from 'vue-router/types/router';
import { Watch } from 'vue-property-decorator';

export function Route(path: string, template: string) {
    return function (target: any) {
        target.path = path;
        target.routeName = target.name;
        return BaseComponent({ 
            template: `${require('./page.jade')()}`.replace('@template@', template)
        })(target);
    }
}

export class Page extends BaseFramework {
    // 访问路径
    static path: string;
    element: HTMLElement;
    route: Route;
    private page: {
        loading: boolean,
        error: string
    } = {
        loading: false,
        error: null
    };
    isLogin: boolean = false;
    autoInitShare: boolean = true;
    private modal: {
        active: boolean,
        component: any,
        data: any,
        close: () => void
    } = {
        active: false,
        component: undefined,
        data: {},
        close: () => {}
    }
    protected needLogin: boolean = false;

    mounted() {
        this.element = this.$el;
        App.loading(true);
        this.signStateChange();
        DomWatch.visibleChanged();
    }

    setTitle(title: string) {
        document.title = title;
    }

    @Watch('logined')
    private signStateChange() {
        if (this.needLogin && !this.logined) {
            this.$router.replace(`/account/signin?ref=${this.$route.fullPath}`);
        }
    }

    protected get logined() {
        return StoreService.Account.logined;
    }

    protected pageLoadingHide() {
        App.loading(false);
        this.page.loading = false;
    }

    protected createModal(componentName: string, data: any={}) {
        this.modal.component = componentName;
        this.modal.active = true;
        this.modal.data = data
        this.modal.close = () => {
            this.modal.active = false;
            this.modal.component = '';
        }
    }
}