

export class AssetModel {
    private id: string;
    path: string;
    data: string;

    constructor(config?: {path: string, data?: string}) {
        this.path = config.path;
        this.data = config.data;
    }

    getId() {
        return this.id;
    }

    setId(id: string) {
        this.id = id;
    }
}

export class AssetStore {
    private maxIdForPrefix: Map<string, number> = new Map();
    private assetsById: Map<string, AssetModel> = new Map();

    constructor() {
        this.maxIdForPrefix = new Map([
            ['model', 0],
            ['texture', 0],
            ['thumbnail', 0],
        ]);
    }

    addModel(assetModel: AssetModel): string {
        if (!assetModel.getId()) {
            assetModel.setId(this.generateId('model'));
        }

        this.assetsById.set(assetModel.getId(), assetModel);
        return assetModel.getId();
    }

    addThumbnail(assetModel: AssetModel): string {
        if (!assetModel.getId()) {
            assetModel.setId(this.generateId('thumbnail'));
        }

        this.assetsById.set(assetModel.getId(), assetModel);
        return assetModel.getId();
    }

    addTexture(assetModel: AssetModel): string {
        if (!assetModel.getId()) {
            assetModel.setId(this.generateId('texture'));
        }

        this.assetsById.set(assetModel.getId(), assetModel);
        return assetModel.getId();
    }

    getAssetById(id: string) {
        return this.assetsById.get(id);
    }

    private generateId(assetPrefix: string) {
        const idIndex = this.maxIdForPrefix.get(assetPrefix);
        this.maxIdForPrefix.set(assetPrefix, idIndex + 1);
        return `${assetPrefix}-${idIndex + 1}`.toLocaleLowerCase();
    }
}