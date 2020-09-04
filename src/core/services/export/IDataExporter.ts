import { AppJson } from "./ExportService";


export interface IDataExporter {
    export(json: Partial<AppJson>): void;
}