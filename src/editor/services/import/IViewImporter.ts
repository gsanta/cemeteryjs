

export interface IViewImporter {
    viewType: string;
    import(json: any): void;
} 