import { IToolType } from "./IToolType";
import { RawWorldMapJson } from "../../../../../world_generator/importers/svg/WorldMapJson";

export interface IToolImporter extends IToolType {
    import(rawJson: RawWorldMapJson): void;
} 