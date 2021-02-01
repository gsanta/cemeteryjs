
import { Then, When } from 'cucumber';
import { Canvas2dPanel } from '../../../src/core/plugin/Canvas2dPanel';
import { Point } from '../../../src/utils/geometry/shapes/Point';
import { createFakeMouseEvent } from './common/inputTestUtils';
import { findViewOrContainedView } from './common/viewTestUtils';
import expect from 'expect';
import { SketchEditorPanelId } from '../../../src/modules/sketch_editor/main/SketchEditorModule';
import { NodeEditorPanelId } from '../../../src/modules/graph_editor/NodeEditorModule';
import { NodeEditorPerspectiveName, SceneEditorPerspectiveName } from '../../../src/core/services/UI_PerspectiveService';
import { AbstractShape } from '../../../src/core/models/shapes/AbstractShape';
import { PointerHandler } from '../../../src/core/controller/PointerHandler';
import { MouseEventAdapter } from '../../../src/core/controller/MouseEventAdapter';

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
    
    const hoveredView = canvasPanel.getViewStore().getAllItems().find(view => view.getBounds().containsPoint(new Point(x, y)));

    if (hoveredView) {
        canvasPanel.pointer.pointerEnter(hoveredView); 
    } else {
        canvasPanel.pointer.pointer.hoveredItem = undefined;
    }

    let pointerEvent = MouseEventAdapter.mouseDown(createFakeMouseEvent(x, y));
    canvasPanel.pointer.pointerDown(pointerEvent); 
    canvasPanel.pointer.pointerUp(pointerEvent); 
});

When('mouse click on \'{word}\'', function(viewId: string) {
    const canvasPanel = this.registry.ui.helper.hoveredPanel as Canvas2dPanel<AbstractShape>; 

    const shape = canvasPanel.getViewStore().getItemById(viewId);

    if (!shape) { throw new Error(`View not found with id: ${viewId}`); }

    const center = shape.getBounds().getBoundingCenter();

    canvasPanel.pointer.pointerEnter(shape);
    let pointerEvent = MouseEventAdapter.mouseDown(createFakeMouseEvent(center.x, center.y));
    canvasPanel.pointer.pointerDown(pointerEvent);
    pointerEvent = MouseEventAdapter.mouseUp(createFakeMouseEvent(center.x, center.y)); 
    canvasPanel.pointer.pointerUp(pointerEvent);
    canvasPanel.pointer.pointerLeave(shape); 
});

When('mouse drags from \'{int}:{int}\' to \'{int}:{int}\'', function(xStart: number, yStart: number, xEnd: number, yEnd: number) {
    const canvasPanel = this.registry.ui.helper.hoveredPanel as Canvas2dPanel<AbstractShape>; 

    const hoveredView = canvasPanel.getViewStore().getAllItems().find(view => view.getBounds().containsPoint(new Point(xStart, yStart)));

    let pointerEvent = MouseEventAdapter.mouseMove(createFakeMouseEvent(xStart, yStart));
    canvasPanel.pointer.pointerMove(pointerEvent); 

    if (hoveredView) {
        canvasPanel.pointer.pointerEnter(hoveredView); 
    } else {
        canvasPanel.pointer.pointer.hoveredItem = undefined;
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

    const view1 = findViewOrContainedView(canvasPanel.getViewStore(), startViewPath);
    const view2 = findViewOrContainedView(canvasPanel.getViewStore(), endViewPath);
    const view1Pos = view1.getBounds().getBoundingCenter();
    const view2Pos = view2.getBounds().getBoundingCenter();

    let pointerEvent = MouseEventAdapter.mouseMove(createFakeMouseEvent(view1Pos.x, view1Pos.y)); 
    canvasPanel.pointer.pointerEnter(view1); 
    canvasPanel.pointer.pointerDown(pointerEvent); 
    canvasPanel.pointer.pointerLeave(view1); 
    
    pointerEvent = MouseEventAdapter.mouseMove(createFakeMouseEvent(view2Pos.x, view2Pos.y)); 
    canvasPanel.pointer.pointerMove(pointerEvent); 
    canvasPanel.pointer.pointerEnter(view2); 
    canvasPanel.pointer.pointerUp(pointerEvent); 
});

When('mouse drags from view \'{word}\' to \'{int}:{int}\'', function(startViewPath: string, xEnd: number, yEnd: number) {
    const canvasPanel = this.registry.ui.helper.hoveredPanel as Canvas2dPanel<AbstractShape>;

    const view1 = findViewOrContainedView(canvasPanel.getViewStore(), startViewPath);
    const view1Pos = view1.getBounds().getBoundingCenter();

    let pointerEvent = MouseEventAdapter.mouseMove(createFakeMouseEvent(view1Pos.x, view1Pos.y)); 
    canvasPanel.pointer.pointerEnter(view1); 
    canvasPanel.pointer.pointerDown(pointerEvent); 
    canvasPanel.pointer.pointerLeave(view1); 
    
    pointerEvent = MouseEventAdapter.mouseMove(createFakeMouseEvent(xEnd, yEnd)); 
    canvasPanel.pointer.pointerMove(pointerEvent); 
    canvasPanel.pointer.pointerUp(pointerEvent); 
});

When('mouse move to view \'{word}\'', function(viewPath: string) {
    const canvasPanel = this.registry.ui.helper.hoveredPanel as Canvas2dPanel<AbstractShape>;

    const view = findViewOrContainedView(canvasPanel.getViewStore(), viewPath);
    const view1Pos = view.getBounds().getBoundingCenter();

    canvasPanel.pointer.pointerEnter(view); 
});

When('mouse move to view \'{word}\'', function(viewPath: string) {
    const canvasPanel = this.registry.ui.helper.hoveredPanel as Canvas2dPanel<AbstractShape>;

    const view = findViewOrContainedView(canvasPanel.getViewStore(), viewPath);
    const view1Pos = view.getBounds().getBoundingCenter();

    canvasPanel.pointer.pointerEnter(view); 
});

When('mouse move to \'{int}:{int}\'', function(x: number, y: number) {
    const canvasPanel = this.registry.ui.helper.hoveredPanel as Canvas2dPanel<AbstractShape>;
    const hoveredView = findViewAtPoint(new Point(x, y));

    if (hoveredView) {
        canvasPanel.pointer.pointerEnter(hoveredView); 
    } else {
        canvasPanel.pointer.pointer.hoveredItem = undefined;
    }
});

Then('active tool is \'{word}\'', function(toolId: string) {
    const canvasPanel = this.registry.ui.helper.hoveredPanel as Canvas2dPanel<AbstractShape>;

    expect(canvasPanel.tool.getActiveTool().id).toEqual(toolId);
});

function findViewAtPoint(point: Point) {
    const canvasPanel = this.registry.ui.helper.hoveredPanel as Canvas2dPanel<AbstractShape>;

    const viewAtPoint = canvasPanel.getViewStore().getAllItems().find(view => view.getBounds().containsPoint(point));

    return viewAtPoint;
}