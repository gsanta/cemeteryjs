import { AbstractForm } from "./AbstractForm";
import { PathConcept } from "../models/concepts/PathConcept";

export enum PathPropType {
    NAME = 'name'
}

export class PathForm extends AbstractForm<PathPropType> {
    path: PathConcept;

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