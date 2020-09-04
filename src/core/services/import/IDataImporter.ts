import { AppJson } from "../export/ExportService";


export interface IDataImporter {
    import(json: AppJson): Promise<void>;
}