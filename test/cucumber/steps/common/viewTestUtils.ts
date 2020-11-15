import { View } from "../../../../src/core/models/views/View";

export enum ViewTableProp {
    Id = 'Id',
    Type = 'Type',
    Obj = 'Obj',
    Dimensions = 'Dimensions',
    Pos = 'Pos',
    PosY = 'PosY',
    Selected = 'Selected',
    DirX = 'DirX',
    DirY = 'DirY',
    DirZ = 'DirZ'
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

export function setViewProperty(view: View, prop: ViewTableProp, val: string) {
    switch(prop) {
        case ViewTableProp.Selected:
            if (isViewPropTrue(val)) {
                view.store.addSelectedView(view);
            } else {
                view.store.removeSelectedView(view);
            }
        break;
    }
}

function isViewPropTrue(val: string) {
    return val.toLowerCase() === 'true'
}