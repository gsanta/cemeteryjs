import { AbstractPluginService } from "./AbstractPluginService";
import { AbstractPlugin } from "../../core/AbstractPlugin";
import { EngineService } from "../../core/services/EngineService";

export class PluginServices<T extends AbstractPlugin> {

    services: AbstractPluginService<T>[] = [];
    private serviceMap: Map<string, AbstractPluginService<T>> = new Map();

    constructor(services: AbstractPluginService<T>[]) {
        this.services = services;
        this.services.forEach(service => this.serviceMap.set(service.serviceName, service));
    }

    byName<U extends AbstractPluginService<T>>(serviceName: string): U {
        const service = this.services.find(service => service.serviceName === serviceName); 
        if (!service) { this.throwServiceNotFoundError(serviceName); }

        return <U> service;
    }

    engineService(): EngineService {
        return this.byName<EngineService>(EngineService.serviceName);
    }

    private throwServiceNotFoundError(serviceName: string) {
        throw new Error(`Service '${serviceName}' not found.`);
    }
}