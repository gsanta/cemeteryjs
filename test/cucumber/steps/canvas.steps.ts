
import { Then, When } from 'cucumber';
import expect from 'expect';
import { MouseEventAdapter } from '../../../src/core/controller/MouseEventAdapter';
import { IPointerEventType } from '../../../src/core/controller/PointerHandler';
import { AbstractShape } from '../../../src/core/models/shapes/AbstractShape';
import { Canvas2dPanel } from '../../../src/core/plugin/Canvas2dPanel';
import { NodeEditorPerspectiveName, SceneEditorPerspectiveName } from '../../../src/core/services/UI_PerspectiveService';
import { ShapeStore } from '../../../src/core/stores/ShapeStore';
import { NodeEditorPanelId } from '../../../src/modules/graph_editor/NodeEditorModule';
import { SketchEditorPanelId } from '../../../src/modules/sketch_editor/main/SketchEditorModule';
import { Point } from '../../../src/utils/geometry/shapes/Point';
import { createFakeMouseEvent } from './common/inputTestUtils';
import { findViewOrContainedView } from './common/viewTestUtils';

When('change canvas to \'{word}\'', function(panelId: string) {
    switch(panelId) {
        case SketchEditorPanelId:
            this.registry.services.uiPerspective.activatePerspective(SceneEditorPerspectiveName);
        break;
        case NodeEditorPanelId:
            this.registry.services.uiPerspective.activatePerspective(NodeEditorPerspectiveName);
        break;
    }
});

When('hover over canvas \'{word}\'', function(panelId: string) {
    this.registry.ui.helper.hoveredPanel = this.registry.services.module.ui.getCanvas(panelId); 
});

When('mouse down at \'{int}:{int}\'', function(x: number, y: number) {
    const canvasPanel = this.registry.ui.helper.hoveredPanel;
    let pointerEvent = MouseEventAdapter.mouseDown(createFakeMouseEvent(x, y));
    canvasPanel.pointer.pointerDown(pointerEvent); 
});

When('mouse click at \'{int}:{int}\'', function(x: number, y: number) {
    const canvasPanel = this.registry.ui.helper.hoveredPanel as Canvas2dPanel<AbstractShape>;
    
    const shape = canvasPanel.data.items.getAllItems().find(view => view.getBounds().containsPoint(new Point(x, y)));

    if (shape) {
        canvasPanel.pointer.pointerOver({pickedItemId: shape.id, pointers: [], eventType: IPointerEventType.PointerOver}); 
    } else {
        canvasPanel.pointer.pointer.pickedItem = undefined;
    }

    let pointerEvent = MouseEventAdapter.mouseDown(createFakeMouseEvent(x, y));
    canvasPanel.pointer.pointerDown(pointerEvent); 
    canvasPanel.pointer.pointerUp(pointerEvent); 
});

When('mouse click on \'{word}\'', function(viewId: string) {
    const canvasPanel = this.registry.ui.helper.hoveredPanel as Canvas2dPanel<AbstractShape>; 

    const shape = canvasPanel.data.items.getItemById(viewId);

    if (!shape) { throw new Error(`View not found with id: ${viewId}`); }

    const center = shape.getBounds().getBoundingCenter();

    canvasPanel.pointer.pointerOver({pickedItemId: shape.id, pointers: [], eventType: IPointerEventType.PointerOver});
    let pointerEvent = MouseEventAdapter.mouseDown(createFakeMouseEvent(center.x, center.y));
    canvasPanel.pointer.pointerDown(pointerEvent);
    pointerEvent = MouseEventAdapter.mouseUp(createFakeMouseEvent(center.x, center.y)); 
    canvasPanel.pointer.pointerUp(pointerEvent);
    canvasPanel.pointer.pointerOut({pickedItemId: shape.id, pointers: [], eventType: IPointerEventType.PointerOut}); 
});

When('mouse drags from \'{int}:{int}\' to \'{int}:{int}\'', function(xStart: number, yStart: number, xEnd: number, yEnd: number) {
    const canvasPanel = this.registry.ui.helper.hoveredPanel as Canvas2dPanel<AbstractShape>; 

    const shape = canvasPanel.data.items.getAllItems().find(view => view.getBounds().containsPoint(new Point(xStart, yStart)));

    let pointerEvent = MouseEventAdapter.mouseMove(createFakeMouseEvent(xStart, yStart));
    canvasPanel.pointer.pointerMove(pointerEvent); 

    if (shape) {
        canvasPanel.pointer.pointerOver({pickedItemId: shape.id, pointers: [], eventType: IPointerEventType.PointerOver}); 
    } else {
        canvasPanel.pointer.pointer.pickedItem = undefined;
    }

    pointerEvent = MouseEventAdapter.mouseMove(createFakeMouseEvent(xStart + 1, yStart + 1));
    canvasPanel.pointer.pointerMove(pointerEvent); 

    pointerEvent = MouseEventAdapter.mouseDown(createFakeMouseEvent(xStart, yStart));
    canvasPanel.pointer.pointerDown(pointerEvent);
    pointerEvent = MouseEventAdapter.mouseMove(createFakeMouseEvent(xEnd, yEnd)); 
    canvasPanel.pointer.pointerMove(pointerEvent);
    pointerEvent = MouseEventAdapter.mouseUp(createFakeMouseEvent(xEnd, yEnd)); 
    canvasPanel.pointer.pointerUp(pointerEvent); 
});

When('mouse drags from view \'{word}\' to view \'{word}\'', function(startViewPath: string, endViewPath: string) {
    const canvasPanel = this.registry.ui.helper.hoveredPanel as Canvas2dPanel<AbstractShape>;

    const view1 = findViewOrContainedView(canvasPanel.data.items as ShapeStore, startViewPath);
    const view2 = findViewOrContainedView(canvasPanel.data.items as ShapeStore, endViewPath);
    const view1Pos = view1.getBounds().getBoundingCenter();
    const view2Pos = view2.getBounds().getBoundingCenter();

    let pointerEvent = MouseEventAdapter.mouseMove(createFakeMouseEvent(view1Pos.x, view1Pos.y)); 
    canvasPanel.pointer.pointerOver({pickedItemId: view1.id, pointers: [], eventType: IPointerEventType.PointerOver}); 
    canvasPanel.pointer.pointerDown(pointerEvent); 
    canvasPanel.pointer.pointerOut({pickedItemId: view1.id, pointers: [], eventType: IPointerEventType.PointerOut}); 
    
    pointerEvent = MouseEventAdapter.mouseMove(createFakeMouseEvent(view2Pos.x, view2Pos.y)); 
    canvasPanel.pointer.pointerMove(pointerEvent); 
    canvasPanel.pointer.pointerOver({pickedItemId: view2.id, pointers: [], eventType: IPointerEventType.PointerOver}); 
    canvasPanel.pointer.pointerUp(pointerEvent); 
});

When('mouse drags from view \'{word}\' to \'{int}:{int}\'', function(startViewPath: string, xEnd: number, yEnd: number) {
    const canvasPanel = this.registry.ui.helper.hoveredPanel as Canvas2dPanel<AbstractShape>;

    const shape = findViewOrContainedView(canvasPanel.data.items as ShapeStore, startViewPath);
    const shape1Pos = shape.getBounds().getBoundingCenter();

    let pointerEvent = MouseEventAdapter.mouseMove(createFakeMouseEvent(shape1Pos.x, shape1Pos.y)); 
    canvasPanel.pointer.pointerOver({pickedItemId: shape.id, pointers: [], eventType: IPointerEventType.PointerOver}); 
    canvasPanel.pointer.pointerDown(pointerEvent); 
    canvasPanel.pointer.pointerOut({pickedItemId: shape.id, pointers: [], eventType: IPointerEventType.PointerOut}); 
    
    pointerEvent = MouseEventAdapter.mouseMove(createFakeMouseEvent(xEnd, yEnd)); 
    canvasPanel.pointer.pointerMove(pointerEvent); 
    canvasPanel.pointer.pointerUp(pointerEvent); 
});

When('mouse move to view \'{word}\'', function(viewPath: string) {
    const canvasPanel = this.registry.ui.helper.hoveredPanel as Canvas2dPanel<AbstractShape>;

    const shape = findViewOrContainedView(canvasPanel.data.items as ShapeStore, viewPath);

    canvasPanel.pointer.pointerOver({pickedItemId: shape.id, pointers: [], eventType: IPointerEventType.PointerOver}); 
});

When('mouse move to view \'{word}\'', function(viewPath: string) {
    const canvasPanel = this.registry.ui.helper.hoveredPanel as Canvas2dPanel<AbstractShape>;

    const shape = findViewOrContainedView(canvasPanel.data.items as ShapeStore, viewPath);

    canvasPanel.pointer.pointerOver({pickedItemId: shape.id, pointers: [], eventType: IPointerEventType.PointerOver}); 
});

When('mouse move to \'{int}:{int}\'', function(x: number, y: number) {
    const canvasPanel = this.registry.ui.helper.hoveredPanel as Canvas2dPanel<AbstractShape>;
    const shape = findViewAtPoint(new Point(x, y));

    if (shape) {
        canvasPanel.pointer.pointerOver({pickedItemId: shape.id, pointers: [], eventType: IPointerEventType.PointerOver}); 
    } else {
        canvasPanel.pointer.pointer.pickedItem = undefined;
    }
});

Then('active tool is \'{word}\'', function(toolId: string) {
    const canvasPanel = this.registry.ui.helper.hoveredPanel as Canvas2dPanel<AbstractShape>;

    expect(canvasPanel.tool.getActiveTool().id).toEqual(toolId);
});

function findViewAtPoint(point: Point) {
    const canvasPanel = this.registry.ui.helper.hoveredPanel as Canvas2dPanel<AbstractShape>;

    const viewAtPoint = canvasPanel.data.items.getAllItems().find(view => view.getBounds().containsPoint(point));

    return viewAtPoint;
}