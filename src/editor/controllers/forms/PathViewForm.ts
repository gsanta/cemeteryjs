import { AbstractForm } from "./AbstractForm";
import { PathView } from "../../canvas/models/views/PathView";

export enum PathPropType {
    NAME = 'name'
}

export class PathViewForm extends AbstractForm<PathPropType> {
    path: PathView;

    protected getProp(prop: PathPropType) {
        switch (prop) {
            case PathPropType.NAME:
                return this.path.name;
        }
    }

    protected setProp(val: any, prop: PathPropType) {
        switch (prop) {
            case PathPropType.NAME:
                this.path.name = val;
                break;
        }
    }
}