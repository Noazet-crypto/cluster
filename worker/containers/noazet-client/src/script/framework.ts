import { BaseFramework, BaseRouter, BaseStore } from './vendor';

export class Framework {
    static pages: any[];
    static components: any[];
    static initModules(pages: any[], components: any[]) {
        BaseFramework.use(BaseRouter);
        BaseFramework.use(BaseStore);
        this.pages = pages;
        this.components = components;
    }

    static bootstrap() {
        let routes: any[] = [];
        this.pages.forEach((page: any) => {
            routes.push({ path: page.path, component: page, name: page.routeName});
        });

        this.components.forEach((component: any) => {
            BaseFramework.component(component.elementName, component);
        });

        new BaseFramework({
            router: new BaseRouter({
                mode: 'history',
                routes: routes
            })
        }).$mount('#App')
    }
}