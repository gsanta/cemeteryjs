import { View } from "../../../../src/core/models/views/View";
import { Registry } from "../../../../src/core/Registry";

export enum ViewTableProp {
    Id = 'Id',
    Type = 'Type',
    Obj = 'Obj',
    Dimensions = 'Dimensions',
    Pos = 'Pos',
    PosY = 'PosY',
    Selected = 'Selected'
}

export function getViewProperty(view: View, prop: ViewTableProp) {
    switch(prop) {
        case ViewTableProp.Id:
            return  view.id;
        case ViewTableProp.Type:
            return view.viewType;
        case ViewTableProp.Obj:
            return view.getObj() && view.getObj().id;
        default:
            return '';
    }
}

export function setViewProperty(registry: Registry, view: View, prop: ViewTableProp, val: string) {
    switch(prop) {
        case ViewTableProp.Selected:

            return  view.id;
        case ViewTableProp.Type:
            return view.viewType;
        case ViewTableProp.Obj:
            return view.getObj() && view.getObj().id;
        default:
            return '';
    }
}
