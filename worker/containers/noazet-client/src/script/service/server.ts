import { Service } from './service';

export class ServerService extends Service {
    getConfig() {
        return this.request.get('/configs');
    }
}