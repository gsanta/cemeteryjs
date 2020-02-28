

export class LocalStore {
    serviceName = 'local-store'
    private version = 2;
    private name = 'editor';
    private db: IDBDatabase;

    constructor() {
        const request = window.indexedDB.open(this.name, this.version);
        request.onupgradeneeded = () => this.upgradeDb(request);
    }

    async saveXml(xml: string) {
        if (!this.isDbSupported()) { return }

        const db = await this.getDb();

        var objectStore = db.transaction(["xmls"], "readwrite").objectStore("xmls");
        objectStore.put({id: '1', data: xml});
    }

    async loadXml(): Promise<string> {
        if (!this.isDbSupported()) { return }

        const db = await this.getDb();

        const objectStore = db.transaction(["xmls"], "readwrite").objectStore("xmls");

        return await this.getData(objectStore.get('1'));
    }
    
    async saveAsset(name: string, data: string) {
        if (!this.isDbSupported()) { return }

        const db = await this.getDb();

        var objectStore = db.transaction(["assets"], "readwrite").objectStore("assets");
        objectStore.add({name, data});
    }

    async loadAsset(name: string): Promise<string> {
        if (!this.isDbSupported()) { return }

        const db = await this.getDb();

        const objectStore = db.transaction(["assets"], "readwrite").objectStore("assets");

        return await this.getData(objectStore.get(name));
    }

    async clearAll() {
        
        const db = await this.getDb();

        const assets = db.transaction(["assets"], "readwrite").objectStore("assets");
        assets.clear();

        const xmls = db.transaction(["xmls"], "readwrite").objectStore("xmls");
        xmls.clear();
    }

    private async getData(request: IDBRequest): Promise<any> {
        return new Promise((resolve, reject) => {

            request.onerror = () => {
                console.error('Failed to load data with key from local store');
                reject();
            };

            request.onsuccess = () => request.result ? resolve(request.result.data) : resolve(null);
        });
    }

    private upgradeDb(request: IDBOpenDBRequest) {
        const db = request.result;

        db.createObjectStore("assets", { keyPath: "name" });
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