
import { Then, When } from 'cucumber';
import { Canvas2dPanel } from '../../../src/core/plugin/Canvas2dPanel';
import { Point } from '../../../src/utils/geometry/shapes/Point';
import { createFakeMouseEvent } from './common/inputTestUtils';
import { findViewOrContainedView } from './common/viewTestUtils';
import expect from 'expect';
import { SketchEditorPanelId } from '../../../src/modules/sketch_editor/main/SketchEditorModule';
import { NodeEditorPanelId } from '../../../src/modules/graph_editor/NodeEditorModule';
import { NodeEditorPerspectiveName, SceneEditorPerspectiveName } from '../../../src/core/services/UI_PerspectiveService';

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
    canvasPanel.tool.mouseDown(createFakeMouseEvent(x, y)); 
});

When('mouse click at \'{int}:{int}\'', function(x: number, y: number) {
    const canvasPanel = this.registry.ui.helper.hoveredPanel as Canvas2dPanel;
    
    const hoveredView = canvasPanel.getViewStore().getAllShapes().find(view => view.getBounds().containsPoint(new Point(x, y)));

    if (hoveredView) {
        canvasPanel.tool.mouseEnter(createFakeMouseEvent(x, y), hoveredView); 
    } else {
        canvasPanel.pointer.hoveredView = undefined;
    }

    canvasPanel.tool.mouseDown(createFakeMouseEvent(x, y)); 
    canvasPanel.tool.mouseUp(createFakeMouseEvent(x, y)); 
});

When('mouse click on \'{word}\'', function(viewId: string) {
    const canvasPanel = this.registry.ui.helper.hoveredPanel as Canvas2dPanel; 

    const view = canvasPanel.getViewStore().getById(viewId);

    if (!view) { throw new Error(`View not found with id: ${viewId}`); }

    const center = view.getBounds().getBoundingCenter();

    canvasPanel.tool.mouseEnter(createFakeMouseEvent(center.x, center.y), view); 
    canvasPanel.tool.mouseDown(createFakeMouseEvent(center.x, center.y)); 
    canvasPanel.tool.mouseUp(createFakeMouseEvent(center.x, center.y)); 
    canvasPanel.tool.mouseLeave(createFakeMouseEvent(center.x, center.y), view); 
});

When('mouse drags from \'{int}:{int}\' to \'{int}:{int}\'', function(xStart: number, yStart: number, xEnd: number, yEnd: number) {
    const canvasPanel = this.registry.ui.helper.hoveredPanel as Canvas2dPanel; 

    const hoveredView = canvasPanel.getViewStore().getAllShapes().find(view => view.getBounds().containsPoint(new Point(xStart, yStart)));

    canvasPanel.tool.mouseMove(createFakeMouseEvent(xStart, yStart)); 

    if (hoveredView) {
        canvasPanel.tool.mouseEnter(createFakeMouseEvent(xStart, yStart), hoveredView); 
    } else {
        canvasPanel.pointer.hoveredView = undefined;
    }

    canvasPanel.tool.mouseMove(createFakeMouseEvent(xStart + 1, yStart + 1)); 

    canvasPanel.tool.mouseDown(createFakeMouseEvent(xStart, yStart)); 
    canvasPanel.tool.mouseMove(createFakeMouseEvent(xEnd, yEnd)); 
    canvasPanel.tool.mouseUp(createFakeMouseEvent(xEnd, yEnd)); 
});

When('mouse drags from view \'{word}\' to view \'{word}\'', function(startViewPath: string, endViewPath: string) {
    const canvasPanel = this.registry.ui.helper.hoveredPanel as Canvas2dPanel;

    const view1 = findViewOrContainedView(canvasPanel.getViewStore(), startViewPath);
    const view2 = findViewOrContainedView(canvasPanel.getViewStore(), endViewPath);
    const view1Pos = view1.getBounds().getBoundingCenter();
    const view2Pos = view2.getBounds().getBoundingCenter();

    canvasPanel.tool.mouseEnter(createFakeMouseEvent(view1Pos.x, view1Pos.y), view1); 
    canvasPanel.tool.mouseDown(createFakeMouseEvent(view1Pos.x, view1Pos.y)); 
    canvasPanel.tool.mouseLeave(createFakeMouseEvent(view1Pos.x, view1Pos.y), view1); 
    
    canvasPanel.tool.mouseMove(createFakeMouseEvent(view2Pos.x, view2Pos.y)); 

    canvasPanel.tool.mouseEnter(createFakeMouseEvent(view2Pos.x, view2Pos.y), view2); 
    canvasPanel.tool.mouseUp(createFakeMouseEvent(view2Pos.x, view2Pos.y)); 
});

When('mouse drags from view \'{word}\' to \'{int}:{int}\'', function(startViewPath: string, xEnd: number, yEnd: number) {
    const canvasPanel = this.registry.ui.helper.hoveredPanel as Canvas2dPanel;

    const view1 = findViewOrContainedView(canvasPanel.getViewStore(), startViewPath);
    const view1Pos = view1.getBounds().getBoundingCenter();

    canvasPanel.tool.mouseEnter(createFakeMouseEvent(view1Pos.x, view1Pos.y), view1); 
    canvasPanel.tool.mouseDown(createFakeMouseEvent(view1Pos.x, view1Pos.y)); 
    canvasPanel.tool.mouseLeave(createFakeMouseEvent(view1Pos.x, view1Pos.y), view1); 
    
    canvasPanel.tool.mouseMove(createFakeMouseEvent(xEnd, yEnd)); 
    canvasPanel.tool.mouseUp(createFakeMouseEvent(xEnd, yEnd)); 
});

When('mouse move to view \'{word}\'', function(viewPath: string) {
    const canvasPanel = this.registry.ui.helper.hoveredPanel as Canvas2dPanel;

    const view = findViewOrContainedView(canvasPanel.getViewStore(), viewPath);
    const view1Pos = view.getBounds().getBoundingCenter();

    canvasPanel.tool.mouseEnter(createFakeMouseEvent(view1Pos.x, view1Pos.y), view); 
});

When('mouse move to view \'{word}\'', function(viewPath: string) {
    const canvasPanel = this.registry.ui.helper.hoveredPanel as Canvas2dPanel;

    const view = findViewOrContainedView(canvasPanel.getViewStore(), viewPath);
    const view1Pos = view.getBounds().getBoundingCenter();

    canvasPanel.tool.mouseEnter(createFakeMouseEvent(view1Pos.x, view1Pos.y), view); 
});

When('mouse move to \'{int}:{int}\'', function(x: number, y: number) {
    const canvasPanel = this.registry.ui.helper.hoveredPanel as Canvas2dPanel;
    const hoveredView = findViewAtPoint(new Point(x, y));

    if (hoveredView) {
        canvasPanel.tool.mouseEnter(createFakeMouseEvent(x, y), hoveredView); 
    } else {
        canvasPanel.pointer.hoveredView = undefined;
    }
});

Then('active tool is \'{word}\'', function(toolId: string) {
    const canvasPanel = this.registry.ui.helper.hoveredPanel as Canvas2dPanel;

    expect(canvasPanel.tool.getActiveTool().id).toEqual(toolId);
});

function findViewAtPoint(point: Point) {
    const canvasPanel = this.registry.ui.helper.hoveredPanel as Canvas2dPanel;

    const viewAtPoint = canvasPanel.getViewStore().getAllShapes().find(view => view.getBounds().containsPoint(point));

    return viewAtPoint;
}