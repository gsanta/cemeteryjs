import { TableDefinition } from "cucumber";
import { AbstractShape } from "../../../../src/core/models/shapes/AbstractShape";
import { Canvas2dPanel } from "../../../../src/core/plugin/Canvas2dPanel";
import { ShapeStore } from "../../../../src/core/stores/ShapeStore";

export enum ViewTableProp {
    Id = 'Id',
    Type = 'Type',
    NodeType = 'NodeType',
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

export function getViewProperty(view: AbstractShape, prop: ViewTableProp) {
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
export function setViewProperty(canvasPanel: Canvas2dPanel<AbstractShape>, view: AbstractShape, prop: ViewTableProp, val: string) {
    switch(prop) {
        case ViewTableProp.Selected:
            if (isViewPropTrue(val)) {
                canvasPanel.data.selection.addItem(view);
            } else {
                canvasPanel.data.selection.removeItem(view);
            }
        break;
    }
}

function isViewPropTrue(val: string) {
    return val.toLowerCase() === 'true'
}

export function findViewOrContainedView(viewStore: ShapeStore, viewId: string): AbstractShape {
    const invalidPathMessage = `View for id ${viewId} could not be found.`;
    
    let view: AbstractShape;

    if (viewId.indexOf('.') !== -1) {
        const ids = viewId.split('.');
        view = viewStore.getItemById(ids[0]);

        if (!view) { throw new Error(invalidPathMessage); }

        view = view.containedShapes.find(v => v.id === ids[1]);
    } else {
        view = viewStore.getItemById(viewId);
    } 

    if (!view) { throw new Error(invalidPathMessage); }

    return view;
}

export function collectViewTableProps(tableDef: TableDefinition): ViewTableProp[] {
    return <ViewTableProp[]> tableDef.raw()[0];
}