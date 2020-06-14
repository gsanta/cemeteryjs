import { Rectangle } from '../../../core/geometry/shapes/Rectangle';
import { Registry } from '../../../core/Registry';
import { MeshView } from '../../../core/models/views/MeshView';
import { RenderTask } from '../../../core/services/RenderServices';
import { AbstractTool } from './AbstractTool';
import { RectangleSelector } from './RectangleSelector';
import { ToolType } from './Tool';
import { ViewType } from '../../../core/models/views/View';
import { IPointerEvent } from '../../../core/services/input/PointerService';
import { AbstractPlugin } from '../../../core/AbstractPlugin';

export class RectangleTool extends AbstractTool {
    private lastPreviewRect: MeshView;
    private rectSelector: RectangleSelector;

    constructor(plugin: AbstractPlugin, registry: Registry) {
        super(ToolType.Rectangle, plugin, registry);

        this.rectSelector = new RectangleSelector(registry);
    }

    click() {
        const pointer = this.registry.services.pointer.pointer;
        const rect = Rectangle.squareFromCenterPointAndRadius(pointer.down, 50);

        const meshView: MeshView = new MeshView({dimensions: rect});
        meshView.rotation = 0;
        meshView.scale = 1;
        meshView.color = 'grey';

        this.registry.stores.canvasStore.addView(meshView);
        this.registry.stores.selectionStore.clear()
        this.registry.stores.selectionStore.addItem(meshView);

        this.registry.services.level.updateCurrentLevel();
        this.registry.services.game.addConcept(meshView);
        this.registry.services.history.createSnapshot();
        this.registry.services.update.scheduleTasks(RenderTask.RenderVisibleViews, RenderTask.RenderSidebar);
    }

    drag(e: IPointerEvent) {
        super.drag(e)
        if (this.lastPreviewRect) {
            this.registry.stores.canvasStore.removeItem(this.lastPreviewRect);
        }
        this.rectSelector.updateRect(this.registry.services.pointer.pointer);
        this.registry.stores.feedback.rectSelectFeedback.isVisible = false;
        const positions = this.rectSelector.getPositionsInSelection();

        const dimensions = this.registry.stores.feedback.rectSelectFeedback.rect;

        const meshView: MeshView = new MeshView({dimensions});
        meshView.rotation = 0;
        meshView.scale = 1;
        meshView.color = 'grey';

        if (positions.length > 0) {
            this.registry.stores.canvasStore.addView(meshView);
            this.lastPreviewRect = meshView;
    
            this.registry.services.update.scheduleTasks(RenderTask.RenderFocusedView);
        }
    }

    draggedUp() {
        super.draggedUp();

        this.rectSelector.finish();
        this.registry.services.game.addConcept(this.lastPreviewRect);
        if (this.lastPreviewRect) {
            this.lastPreviewRect = null;
        }

        this.registry.services.history.createSnapshot();
        this.registry.services.update.scheduleTasks(RenderTask.RenderVisibleViews, RenderTask.RenderSidebar);
    }

    leave() {
        this.rectSelector.finish();
        return true;
    }
}