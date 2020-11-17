import { View } from "../../../../src/core/models/views/View";

export enum ViewTableProp {
    Id = 'Id',
    Type = 'Type',
    Obj = 'Obj',
    Bounds = 'Bounds',
    Pos = 'Pos',
    PosY = 'PosY',
    Selected = 'Selected',
    DirX = 'DirX',
    DirY = 'DirY',
    DirZ = 'DirZ',
    DiffuseColor = 'DiffuseColor'
}

export function getViewProperty(view: View, prop: ViewTableProp) {
    switch(prop) {
        case ViewTableProp.Id:
            return  view.id;
        case ViewTableProp.Type:
            return view.viewType;
        case ViewTableProp.Obj:
            return view.getObj() && view.getObj().id;
        case ViewTableProp.Bounds:
            return view.getBounds().toString();
        case ViewTableProp.Selected:
            return view.isSelected() ? "true" : "false";
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