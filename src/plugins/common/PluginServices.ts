import { AbstractPluginService } from "./AbstractPluginService";
import { AbstractPlugin } from "../../core/AbstractPlugin";


export class PluginServices<T extends AbstractPlugin> {

    services: AbstractPluginService<T>[] = [];
    private serviceMap: Map<string, AbstractPluginService<T>> = new Map();

    constructor(services: AbstractPluginService<T>[]) {
        this.services = services;
        this.services.forEach(service => this.serviceMap.set(service.serviceName, service));
    }

    byName<U extends AbstractPluginService<T>>(serviceName: string): U {
        return <U> this.services.find(service => service.serviceName === serviceName);
    }
}