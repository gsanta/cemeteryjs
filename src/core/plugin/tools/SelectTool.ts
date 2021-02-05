import { AdvancedDynamicTexture, Rectangle as GuiRectangle } from 'babylonjs-gui';
import { Point } from '../../../utils/geometry/shapes/Point';
import { Rectangle } from '../../../utils/geometry/shapes/Rectangle';
import { PointerTracker } from '../../controller/PointerHandler';
import { IObj } from '../../models/objs/IObj';
import { AbstractShape } from '../../models/shapes/AbstractShape';
import { Registry } from '../../Registry';
import { getIntersectingViews, sceneAndGameViewRatio } from '../../stores/ShapeStore';
import { colors } from '../../ui_components/react/styles';
import { AbstractCanvasPanel } from '../AbstractCanvasPanel';
import { Canvas2dPanel } from '../Canvas2dPanel';
import { Canvas3dPanel } from '../Canvas3dPanel';
import { UI_Region } from '../UI_Panel';
import { PointerTool, PointerToolLogic } from './PointerTool';
import { Cursor } from "./Tool";
import { createRectFromMousePointer } from './ToolAdapter';

export class SelectionToolLogicForWebGlCanvas implements RectangleSelectionToolLogic<IObj> {
    private registry: Registry;
    private canvas: Canvas3dPanel<IObj>;
    private texture: AdvancedDynamicTexture;
    private rect: GuiRectangle;

    constructor(registry: Registry, canvas: Canvas3dPanel<IObj>) {
        this.registry = registry;
        this.canvas = canvas;
        canvas.engine.onReady(() => {
            this.texture = AdvancedDynamicTexture.CreateFullscreenUI("UI");
        });
    }

    getIntersectingItems(selection: Rectangle): IObj[] {
        return [];
    }


    createSelectionRect(pointer: PointerTracker<IObj>): Rectangle {
        return createRectFromMousePointer(pointer);
    }

    down() {
        const rect = new GuiRectangle();
        rect.width = '0px';
        // rect.left = 100;
        rect.height = '0px';
        rect.color = colors.defaultBlue;
        rect.alpha = 0.3;
        rect.thickness = 1.5;
        rect.background = colors.defaultBlue;
        this.rect = rect;
        this.texture.addControl(rect);    
    }

    drag(pointer: PointerTracker<IObj>, rectangle: Rectangle) {
        const {downScreen, currScreen} = pointer;
        const topLeft = new Point(currScreen.x < downScreen.x ? currScreen.x : downScreen.x, currScreen.y < downScreen.y ? currScreen.y : downScreen.y); 
        const bottomRight = new Point(currScreen.x >= downScreen.x ? currScreen.x : downScreen.x, currScreen.y >= downScreen.y ? currScreen.y : downScreen.y); 
        const rectWidth = bottomRight.x - topLeft.x;
        const rectHeight = bottomRight.y - topLeft.y;
        const screenCenterX = pointer.screenSize.x / 2;
        const screenCenterY = pointer.screenSize.y / 2;
        const rectWidthHalf = rectWidth / 2;
        const rectHeightHalf = rectHeight / 2;
        const left = screenCenterX - topLeft.x - rectWidthHalf;
        const top = screenCenterY - topLeft.y - rectHeightHalf; 

        this.rect.left = -left; 
        this.rect.top = -top; 
        this.rect.width = `${rectWidth}px`;
        this.rect.height = `${rectHeight}px`;
        console.log(rectWidth + '  ' + rectHeight);
    }

    up() {
        if (this.rect) {
            this.rect.dispose();
        }
    }
}


export class SelectionToolLogicForSvgCanvas implements RectangleSelectionToolLogic<AbstractShape> {
    private registry: Registry;
    private canvas: Canvas2dPanel<AbstractShape>;

    constructor(registry: Registry, canvas: Canvas2dPanel<AbstractShape>) {
        this.registry = registry;
        this.canvas = canvas;
    }

    getIntersectingItems(selection: Rectangle): AbstractShape[] {
        return getIntersectingViews(this.canvas.data.items, selection);
    }

    createSelectionRect(pointer: PointerTracker<AbstractShape>): Rectangle {
        return createRectFromMousePointer(pointer);
    }

    drag() {}
    down() {}
    up() {}
}

// export class SelectionToolLogicForSvgCanvas implements PointerToolLogic<AbstractShape> {
//     private registry: Registry;
//     private canvas: Canvas2dPanel<AbstractShape>;
//     private pointerToolLogic: PointerToolLogicForSvgCanvas;

//     constructor(registry: Registry, canvas: Canvas2dPanel<AbstractShape>) {
//         this.registry = registry;
//         this.canvas = canvas;

//         this.pointerToolLogic = new PointerToolLogicForSvgCanvas(registry, canvas);
//     }

//     pick(shape: AbstractShape) {
//         this.pointerToolLogic.pick(shape);
//         // if (this.canvas.pointer.pointer.pickedItem) {
//         //     super.click(pointer);
//         // } else if (this.canvas.store.getSelectedItems().length > 0) {
//         //     this.canvas.store.clearSelection();
//         //     this.registry.services.render.scheduleRendering(this.canvas.region, UI_Region.Sidepanel);
//         // }
//     }

//     up(shape: AbstractShape) {
//         this.canvas.store.clearSelection();
//     }

//     drag(shape: AbstractShape) {
//         if (this.draggedItem) {
//             super.drag(pointer);
//         } else {
//             this.rectangleSelection = createRectFromMousePointer(pointer);
//             this.registry.services.render.scheduleRendering(this.canvas.region);
//         }
//     }

//     hover(shape: AbstractShape) {

//     }

//     unhover(shape: AbstractShape) {

//     }
// }

export interface RectangleSelectionToolLogic<D> {
    getIntersectingItems(selection: Rectangle): D[];
    createSelectionRect(pointer: PointerTracker<D>): Rectangle;

    down();
    up();
    drag(pointer: PointerTracker<D>, rect: Rectangle);
}


export const SelectToolId = 'select-tool';
export class SelectTool<D> extends PointerTool<D> {
    private selectionLogic: RectangleSelectionToolLogic<D>;

    constructor(pointerLogic: PointerToolLogic<D>, selectionLogic: RectangleSelectionToolLogic<D>, canvas: AbstractCanvasPanel<D>, registry: Registry) {
        super(SelectToolId, pointerLogic, canvas, registry);
        this.selectionLogic = selectionLogic;
    }

    down(pointerTracker: PointerTracker<D>) {
        this.pointerToolLogic.down(pointerTracker);
        this.selectionLogic.down();
        // if (this.canvas.pointer.pointer.pickedItem && this.canvas.pointer.pointer.pickedItem.isSelected()) {
        //     super.down(pointerTracker);
        // }
    }

    click(pointer: PointerTracker<D>) {
        if (!this.pointerToolLogic.click(pointer)) {
            this.canvas.data.selection.clear();
            this.registry.services.render.scheduleRendering(this.canvas.region, UI_Region.Sidepanel);
        }
        // if (this.canvas.pointer.pointer.pickedItem) {
        //     super.click(pointer);
        // } else if (this.canvas.store.getSelectedItems().length > 0) {
        //     this.canvas.store.clearSelection();
        // }
    }

    drag(pointer: PointerTracker<D>) {
        let changed = this.pointerToolLogic.drag(pointer);

        if (!changed) {
            this.rectangleSelection = this.selectionLogic.createSelectionRect(pointer);
            this.selectionLogic.drag(pointer, this.rectangleSelection);
        }

        this.registry.services.render.scheduleRendering(this.canvas.region);
    }

    dragEnd(pointer: PointerTracker<D>) {
        let changed = this.pointerToolLogic.up(pointer);
        this.selectionLogic.up();

        if (!changed) {
            if (!this.rectangleSelection) { return }
    
            const intersectingShapes = this.selectionLogic.getIntersectingItems(this.rectangleSelection);
            
            this.canvas.data.selection.clear();
            intersectingShapes.forEach(shape => this.canvas.data.selection.addItem(shape));
    
            this.rectangleSelection = undefined;
            this.registry.services.render.scheduleRendering(this.canvas.region, UI_Region.Sidepanel);
        }
    }

    getCursor() {
        if (this.canvas.pointer.pointer.pickedItem) {
            return Cursor.Pointer;
        }

        return Cursor.Default;
    }
}