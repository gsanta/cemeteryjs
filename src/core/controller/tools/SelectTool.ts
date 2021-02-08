import { AdvancedDynamicTexture, Rectangle as GuiRectangle } from 'babylonjs-gui';
import { Point } from '../../../utils/geometry/shapes/Point';
import { Rectangle } from '../../../utils/geometry/shapes/Rectangle';
import { PointerTracker } from '../PointerHandler';
import { IObj } from '../../models/objs/IObj';
import { AbstractShape } from '../../models/shapes/AbstractShape';
import { Registry } from '../../Registry';
import { getIntersectingViews } from '../../data/stores/ShapeStore';
import { colors } from '../../ui_components/react/styles';
import { AbstractCanvasPanel } from '../../models/modules/AbstractCanvasPanel';
import { Canvas2dPanel } from '../../models/modules/Canvas2dPanel';
import { Canvas3dPanel } from '../../models/modules/Canvas3dPanel';
import { UI_Region } from '../../models/UI_Panel';
import { AbstractTool, createRectFromMousePointer } from './AbstractTool';
import { PointerToolLogic } from './PointerTool';
import { Cursor } from "./Tool";

export class SelectionToolLogicForWebGlCanvas implements RectangleSelectionToolLogic<IObj> {
    private registry: Registry;
    private canvas: Canvas3dPanel;
    private texture: AdvancedDynamicTexture;
    private rect: GuiRectangle;

    constructor(registry: Registry, canvas: Canvas3dPanel) {
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
    private canvas: Canvas2dPanel;

    constructor(registry: Registry, canvas: Canvas2dPanel) {
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
//     private canvas: Canvas2dPanel;
//     private pointerToolLogic: PointerToolLogicForSvgCanvas;

//     constructor(registry: Registry, canvas: Canvas2dPanel) {
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
export class SelectTool<D> extends AbstractTool<D> {
    private selectionLogic: RectangleSelectionToolLogic<D>;
    private pointerLogic: PointerToolLogic<D>;

    constructor(pointerLogic: PointerToolLogic<D>, selectionLogic: RectangleSelectionToolLogic<D>, canvas: AbstractCanvasPanel<D>, registry: Registry) {
        super(SelectToolId, canvas, registry);
        this.selectionLogic = selectionLogic;
        this.pointerLogic = pointerLogic;
    }

    down(pointer: PointerTracker<D>) {
        if (!this.pointerLogic.down(pointer)) {
            this.selectionLogic.down();
        }
    }

    click(pointer: PointerTracker<D>) {
        if (!this.pointerLogic.click(pointer)) {
            this.canvas.data.selection.clear();
            this.registry.services.render.scheduleRendering(this.canvas.region, UI_Region.Sidepanel);
        }
    }

    drag(pointer: PointerTracker<D>) {
        let changed = this.pointerLogic.drag(pointer);

        if (!changed) {
            this.rectangleSelection = this.selectionLogic.createSelectionRect(pointer);
            this.selectionLogic.drag(pointer, this.rectangleSelection);
        }

        this.registry.services.render.scheduleRendering(this.canvas.region);
    }

    dragEnd(pointer: PointerTracker<D>) {
        let changed = this.pointerLogic.up(pointer);
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

    over(item) {
        this.pointerLogic.hover(item);
        this.registry.services.render.scheduleRendering(this.canvas.region);
    }
    out(item) {
        this.pointerLogic.unhover(item);
        this.registry.services.render.scheduleRendering(this.canvas.region);
    }
}