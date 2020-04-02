import { AbstractSettings } from "./AbstractSettings";
import { PathConcept } from "../models/concepts/PathConcept";

export enum PathPropType {
    NAME = 'name'
}

export class PathSettings extends AbstractSettings<PathPropType> {
    static type = 'path-settings';
    getType() { return PathSettings.type; }
    path: PathConcept;

    protected getProp(prop: PathPropType) {
        switch (prop) {
            case PathPropType.NAME:
                return this.path.id;
        }
    }

    protected setProp(val: any, prop: PathPropType) {
        switch (prop) {
            case PathPropType.NAME:
                this.path.id = val;
                break;
        }
    }
}