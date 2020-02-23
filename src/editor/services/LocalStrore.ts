

export class LocalStore {
    private version = 1;
    private name = 'editor';

    constructor() {
        const request = window.indexedDB.open(this.name, this.version);
        request.onupgradeneeded = (event) => this.upgradeDb(event, request);
    }
    
    async saveAsset(name: string, data: string) {
        if (!this.isDbSupported()) { return }

        const db = await this.getDb();

        var objectStore = db.transaction(["assets"], "readwrite").objectStore("assets");
        objectStore.add({name, data});
    }

    async loadAsset(name: string): string {
        if (!this.isDbSupported()) { return }

        const db = await this.getDb();

        var objectStore = db.transaction(["assets"], "read").objectStore("assets");
        return objectStore.get(name);
    }

    private upgradeDb(event: IDBVersionChangeEvent, request: IDBOpenDBRequest) {
        const db = request.result;

        db.createObjectStore("assets", { keyPath: "name" });
    }

    private getDb(): Promise<IDBDatabase> {
        return new Promise((resolve, reject) => {
            if (!('indexedDB' in window)) { throw new Error('IndexedDb not supported.')}

            const request = window.indexedDB.open(this.name, this.version);
            request.onupgradeneeded = (event) => this.upgradeDb(event, request);
            request.onsuccess = () => resolve(request.result); 
            request.onerror = () => reject(request.result); 

        });
    }

    private isDbSupported(): boolean {
        return ('indexedDB' in window);
    }
}