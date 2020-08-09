import { AbstractPlugin } from '../../../core/AbstractPlugin';
import { Rectangle } from '../../../core/geometry/shapes/Rectangle';
import { MeshView } from '../../../core/models/views/MeshView';
import { Registry } from '../../../core/Registry';
import { IPointerEvent } from '../../../core/services/input/PointerService';
import { AbstractTool, createRectFromMousePointer } from './AbstractTool';
import { ToolType } from './Tool';
import { UI_Region } from '../../../core/UI_Plugin';
import { Point } from '../../../core/geometry/shapes/Point';

export class RectangleTool extends AbstractTool {
    rectangleFeedback: Rectangle;
    private lastPreviewRect: MeshView;

    constructor(plugin: AbstractPlugin, registry: Registry) {
        super(ToolType.Rectangle, plugin, registry);
    }

    click() {
        const pointer = this.registry.services.pointer.pointer;
        const rect = Rectangle.squareFromCenterPointAndRadius(pointer.down, 50);

        const meshView: MeshView = new MeshView({dimensions: rect});
        meshView.setRotation(0);
        meshView.setScale(1);
        meshView.color = 'grey';

        this.registry.stores.canvasStore.addMeshView(meshView);
        this.registry.stores.selectionStore.clear()
        this.registry.stores.selectionStore.addItem(meshView);

        this.registry.services.level.updateCurrentLevel();

        this.registry.services.history.createSnapshot();
        
        this.registry.services.render.scheduleRendering(UI_Region.Canvas1, UI_Region.Canvas2, UI_Region.Sidepanel);
    }

    drag(e: IPointerEvent) {
        super.drag(e)

        if (this.lastPreviewRect) {
            this.registry.stores.canvasStore.removeItem(this.lastPreviewRect);
        }

        this.rectangleFeedback = createRectFromMousePointer(this.registry.services.pointer.pointer);
        const positions = this.getPositionsInSelection();

        const meshView: MeshView = new MeshView({dimensions: this.rectangleFeedback});
        meshView.setRotation(0);
        meshView.setScale(1);
        meshView.color = 'grey';

        if (positions.length > 0) {
            this.registry.stores.canvasStore.addMeshView(meshView);
            this.lastPreviewRect = meshView;
    
            this.registry.services.render.scheduleRendering(this.plugin.region);
        }
    }

    draggedUp() {
        super.draggedUp();

        this.rectangleFeedback = undefined;
        this.registry.services.game.addConcept(this.lastPreviewRect);
        if (this.lastPreviewRect) {
            this.lastPreviewRect = null;
        }

        this.registry.services.history.createSnapshot();
        this.registry.services.render.scheduleRendering(UI_Region.Canvas1, UI_Region.Canvas2, UI_Region.Sidepanel);
    }

    leave() {
        this.rectangleFeedback = undefined;
        return true;
    }

    private getPositionsInSelection(): Point[] {
        const rect = this.rectangleFeedback;
        const xStart = rect.topLeft.x; 
        const yStart = rect.topLeft.y;
        const xEnd = rect.bottomRight.x;
        const yEnd = rect.bottomRight.y;

        const positions: Point[] = [];
        for (let i = xStart; i < xEnd; i++) {
            for (let j = yStart; j < yEnd; j++) {
                positions.push(new Point(i, j));
            }
        }
        return positions;
    }
}