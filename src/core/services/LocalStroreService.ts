import { Registry } from "../Registry";
import { AssetModel } from "../models/game_objects/AssetModel";

export class LocalStoreService {
    serviceName = 'local-store'
    private version = 2;
    private name = 'editor';
    private db: IDBDatabase;
    private registry: Registry;

    constructor(registry: Registry) {
        this.registry = registry;
        const request = window.indexedDB.open(this.name, this.version);
        request.onupgradeneeded = () => this.upgradeDb(request);
    }

    async removeLevel(level: number): Promise<undefined> {
        if (!this.isDbSupported()) { return }

        const db = await this.getDb();

        const objectStore = db.transaction(["xmls"], "readwrite").objectStore("xmls");
        
        const deleteRequest = objectStore.delete(Number(level));

        return new Promise((resolve, reject) => {
            deleteRequest.onsuccess = () => resolve();
            deleteRequest.onerror = () => reject();
        });

    }

    async storeLevel(level: number, data: string) {
        if (!this.isDbSupported()) { return }

        const db = await this.getDb();

        var objectStore = db.transaction(["xmls"], "readwrite").objectStore("xmls");

        objectStore.put({id: level, data: data});
    }

    async loadLevel(level: number): Promise<null> {
        if (!this.isDbSupported()) { return }

        const db = await this.getDb();

        const objectStore = db.transaction(["xmls"], "readwrite").objectStore("xmls");

        const data = await this.getData(objectStore.get(level));
        this.registry.services.import.import(data.data);
    }

    async loadLevelIndexes(): Promise<number[]> {
        const db = await this.getDb();

        const objectStore = db.transaction(["xmls"], "readwrite").objectStore("xmls");
        const allRecords = objectStore.getAll();

        return new Promise((resolve, reject) => {

            allRecords.onerror = () => {
                console.error('Failed to load levels');
                reject();
            };

            allRecords.onsuccess = () => {
                const result = allRecords.result || [];
                const levels = result.map(level => parseInt(level.id as string, 10));
                levels.sort((a, b) => a - b);

                resolve(levels);
            }
        });
    }
    
    async saveAsset(assetModel: AssetModel) {
        if (!this.isDbSupported()) { return }

        const db = await this.getDb();

        var objectStore = db.transaction(["assets"], "readwrite").objectStore("assets");
        objectStore.put({id: assetModel.id, data: assetModel.data, assetType: assetModel.assetType, path: assetModel.path});
    }

    async loadAsset(assetModel: AssetModel): Promise<string> {
        if (!this.isDbSupported()) { return }

        const db = await this.getDb();

        const objectStore = db.transaction(["assets"], "readwrite").objectStore("assets");

        const data = await this.getData(objectStore.get(assetModel.id));
        assetModel.fromJson(data);
    }

    async clearAll() {
        
        const db = await this.getDb();

        const xmls = db.transaction(["xmls"], "readwrite").objectStore("xmls");
        const clearXmlRequest = xmls.clear();

        clearXmlRequest.onsuccess = function(e) {
            const assets = db.transaction(["assets"], "readwrite").objectStore("assets");
            assets.clear();
        }
    }

    private async getData(request: IDBRequest): Promise<any> {
        return new Promise((resolve, reject) => {

            request.onerror = () => {
                console.error('Failed to load data with key from local store');
                reject();
            };

            request.onsuccess = () => request.result ? resolve(request.result) : resolve(null);
        });
    }

    private upgradeDb(request: IDBOpenDBRequest) {
        const db = request.result;

        db.createObjectStore("assets", { keyPath: "id" });
        db.createObjectStore("xmls", { keyPath: "id" });
    }

    private getDb(): Promise<IDBDatabase> {
        if (this.db) { return Promise.resolve(this.db); }

        return new Promise((resolve, reject) => {
            if (!('indexedDB' in window)) { throw new Error('IndexedDb not supported.')}

            const request = window.indexedDB.open(this.name, this.version);
            request.onupgradeneeded = (event) => this.upgradeDb(request);
            request.onsuccess = () => {
                this.db = request.result;
                resolve(request.result);
            } 
            request.onerror = () => reject(request.result); 

        });
    }

    private isDbSupported(): boolean {
        return ('indexedDB' in window);
    }
}