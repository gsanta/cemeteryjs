import { View } from "../../../../src/core/models/views/View";
import { Registry } from "../../../../src/core/Registry";
import { ViewStore } from "../../../../src/core/stores/ViewStore";

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
    DiffuseColor = 'DiffuseColor',
    Parent = 'Parent'
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
        case ViewTableProp.Parent:
            return view.getParent() ? view.getParent().id : "";    
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

export function findViewOrContainedView(viewStore: ViewStore, viewId: string): View {
    const invalidPathMessage = `View for id ${viewId} could not be found.`;
    
    let view: View;

    if (viewId.indexOf('.') !== -1) {
        const ids = viewId.split('.');
        view = viewStore.getById(ids[0]);

        if (!view) { throw new Error(invalidPathMessage); }

        view = view.containedViews.find(v => v.id === viewId);
    } else {
        view = viewStore.getById(viewId);
    } 

    if (!view) { throw new Error(invalidPathMessage); }

    return view;
}