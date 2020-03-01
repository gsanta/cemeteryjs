import { CanvasWindow } from "../canvas/CanvasWindow";
import { Editor } from "../Editor";


export class LocalStore {
    serviceName = 'local-store'
    private version = 2;
    private name = 'editor';
    private db: IDBDatabase;
    private editor: Editor;

    constructor(editor: Editor) {
        this.editor = editor;
        const request = window.indexedDB.open(this.name, this.version);
        request.onupgradeneeded = () => this.upgradeDb(request);
    }

    async storeEditorState() {
        if (!this.isDbSupported()) { return }

        const db = await this.getDb();

        var objectStore = db.transaction(["xmls"], "readwrite").objectStore("xmls");

        const controller = <CanvasWindow> this.editor.getWindowControllerByName('canvas')
        objectStore.put({id: '1', data: controller.exporter.export()});
    }

    async loadEditorState(): Promise<null> {
        if (!this.isDbSupported()) { return }

        const db = await this.getDb();

        const objectStore = db.transaction(["xmls"], "readwrite").objectStore("xmls");

        const data = await this.getData(objectStore.get('1'));
        const controller = <CanvasWindow> this.editor.getWindowControllerByName('canvas')
        controller.importer.import(data);
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