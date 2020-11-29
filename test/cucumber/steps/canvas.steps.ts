
import { Then, When } from 'cucumber';
import { Canvas2dPanel } from '../../../src/core/plugin/Canvas2dPanel';
import { Point } from '../../../src/utils/geometry/shapes/Point';
import { createFakeMouseEvent } from './common/inputTestUtils';
import { createFakeUIElement, createFakeUIElementForView } from './common/uiTestHelpers';
import { findViewOrContainedView } from './common/viewTestUtils';
import expect from 'expect';

When('hover over canvas \'{word}\'', function(panelId: string) {
    this.registry.ui.helper.hoveredPanel = this.registry.ui.canvas.getCanvas(panelId); 
});

When('mouse down at \'{int}:{int}\'', function(x: number, y: number) {
    const canvasPanel = this.registry.ui.helper.hoveredPanel; 
    canvasPanel.toolController.mouseDown(createFakeMouseEvent(x, y), createFakeUIElement({ canvasPanel })); 
});

When('mouse click at \'{int}:{int}\'', function(x: number, y: number) {
    const canvasPanel = this.registry.ui.helper.hoveredPanel as Canvas2dPanel;
    
    const hoveredView = canvasPanel.getViewStore().getAllViews().find(view => view.getBounds().containsPoint(new Point(x, y)));

    if (hoveredView) {
        canvasPanel.toolController.mouseEnter(createFakeMouseEvent(x, y), hoveredView, createFakeUIElement({ canvasPanel })); 
    } else {
        this.registry.services.pointer.hoveredView = undefined;
    }

    canvasPanel.toolController.mouseDown(createFakeMouseEvent(x, y), createFakeUIElement({ canvasPanel })); 
    canvasPanel.toolController.mouseUp(createFakeMouseEvent(x, y), createFakeUIElement({ canvasPanel })); 
});

When('mouse click on \'{word}\'', function(viewId: string) {
    const canvasPanel = this.registry.ui.helper.hoveredPanel as Canvas2dPanel; 

    const view = canvasPanel.getViewStore().getById(viewId);

    if (!view) { throw new Error(`View not found with id: ${viewId}`); }

    const center = view.getBounds().getBoundingCenter();

    canvasPanel.toolController.mouseEnter(createFakeMouseEvent(center.x, center.y), view, createFakeUIElement({ canvasPanel })); 
    canvasPanel.toolController.mouseDown(createFakeMouseEvent(center.x, center.y), createFakeUIElement({ canvasPanel })); 
    canvasPanel.toolController.mouseUp(createFakeMouseEvent(center.x, center.y), createFakeUIElement({ canvasPanel })); 
    canvasPanel.toolController.mouseLeave(createFakeMouseEvent(center.x, center.y), view, createFakeUIElement({ canvasPanel })); 
});

When('mouse drags from \'{int}:{int}\' to \'{int}:{int}\'', function(xStart: number, yStart: number, xEnd: number, yEnd: number) {
    const canvasPanel = this.registry.ui.helper.hoveredPanel as Canvas2dPanel; 

    const hoveredView = canvasPanel.getViewStore().getAllViews().find(view => view.getBounds().containsPoint(new Point(xStart, yStart)));

    canvasPanel.toolController.mouseMove(createFakeMouseEvent(xStart, yStart), createFakeUIElement({ canvasPanel })); 

    if (hoveredView) {
        canvasPanel.toolController.mouseEnter(createFakeMouseEvent(xStart, yStart), hoveredView, createFakeUIElement({ canvasPanel })); 
    } else {
        this.registry.services.pointer.hoveredView = undefined;
    }

    canvasPanel.toolController.mouseMove(createFakeMouseEvent(xStart + 1, yStart + 1), createFakeUIElement({ canvasPanel })); 

    canvasPanel.toolController.mouseDown(createFakeMouseEvent(xStart, yStart), createFakeUIElement({ canvasPanel })); 
    canvasPanel.toolController.mouseMove(createFakeMouseEvent(xEnd, yEnd), createFakeUIElement({ canvasPanel })); 
    canvasPanel.toolController.mouseUp(createFakeMouseEvent(xEnd, yEnd), createFakeUIElement({ canvasPanel })); 
});

When('mouse drags from view \'{word}\' to view \'{word}\'', function(startViewPath: string, endViewPath: string) {
    const canvasPanel = this.registry.ui.helper.hoveredPanel as Canvas2dPanel;

    const view1 = findViewOrContainedView(canvasPanel.getViewStore(), startViewPath);
    const view2 = findViewOrContainedView(canvasPanel.getViewStore(), endViewPath);
    const view1Pos = view1.getBounds().getBoundingCenter();
    const view2Pos = view2.getBounds().getBoundingCenter();

    canvasPanel.toolController.mouseEnter(createFakeMouseEvent(view1Pos.x, view1Pos.y), view1, createFakeUIElement({ canvasPanel })); 
    canvasPanel.toolController.mouseDown(createFakeMouseEvent(view1Pos.x, view1Pos.y), createFakeUIElement({ canvasPanel })); 
    canvasPanel.toolController.mouseLeave(createFakeMouseEvent(view1Pos.x, view1Pos.y), view1, createFakeUIElement({ canvasPanel })); 
    
    canvasPanel.toolController.mouseMove(createFakeMouseEvent(view2Pos.x, view2Pos.y), createFakeUIElement({ canvasPanel })); 

    canvasPanel.toolController.mouseEnter(createFakeMouseEvent(view2Pos.x, view2Pos.y), view2, createFakeUIElement({ canvasPanel })); 
    canvasPanel.toolController.mouseUp(createFakeMouseEvent(view2Pos.x, view2Pos.y), createFakeUIElement({ canvasPanel })); 
});

When('mouse drags from view \'{word}\' to \'{int}:{int}\'', function(startViewPath: string, xEnd: number, yEnd: number) {
    const canvasPanel = this.registry.ui.helper.hoveredPanel as Canvas2dPanel;

    const view1 = findViewOrContainedView(canvasPanel.getViewStore(), startViewPath);
    const view1Pos = view1.getBounds().getBoundingCenter();

    canvasPanel.toolController.mouseEnter(createFakeMouseEvent(view1Pos.x, view1Pos.y), view1, createFakeUIElement({ canvasPanel })); 
    canvasPanel.toolController.mouseDown(createFakeMouseEvent(view1Pos.x, view1Pos.y), createFakeUIElement({ canvasPanel })); 
    canvasPanel.toolController.mouseLeave(createFakeMouseEvent(view1Pos.x, view1Pos.y), view1, createFakeUIElement({ canvasPanel })); 
    
    canvasPanel.toolController.mouseMove(createFakeMouseEvent(xEnd, yEnd), createFakeUIElement({ canvasPanel })); 
    canvasPanel.toolController.mouseUp(createFakeMouseEvent(xEnd, yEnd), createFakeUIElement({ canvasPanel })); 
});

When('mouse move to view \'{word}\'', function(viewPath: string) {
    const canvasPanel = this.registry.ui.helper.hoveredPanel as Canvas2dPanel;

    const view = findViewOrContainedView(canvasPanel.getViewStore(), viewPath);
    const view1Pos = view.getBounds().getBoundingCenter();

    canvasPanel.toolController.mouseEnter(createFakeMouseEvent(view1Pos.x, view1Pos.y), view, createFakeUIElementForView(view, canvasPanel, { canvasPanel })); 
});

When('mouse move to view \'{word}\'', function(viewPath: string) {
    const canvasPanel = this.registry.ui.helper.hoveredPanel as Canvas2dPanel;

    const view = findViewOrContainedView(canvasPanel.getViewStore(), viewPath);
    const view1Pos = view.getBounds().getBoundingCenter();

    canvasPanel.toolController.mouseEnter(createFakeMouseEvent(view1Pos.x, view1Pos.y), view, createFakeUIElementForView(view, canvasPanel, { canvasPanel })); 
});

When('mouse move to \'{int}:{int}\'', function(x: number, y: number) {
    const canvasPanel = this.registry.ui.helper.hoveredPanel as Canvas2dPanel;
    const hoveredView = findViewAtPoint(new Point(x, y));

    if (hoveredView) {
        canvasPanel.toolController.mouseEnter(createFakeMouseEvent(x, y), hoveredView, createFakeUIElement({ canvasPanel })); 
    } else {
        this.registry.services.pointer.hoveredView = undefined;
    }
});

Then('active tool is \'{word}\'', function(toolId: string) {
    const canvasPanel = this.registry.ui.helper.hoveredPanel as Canvas2dPanel;

    expect(canvasPanel.toolController.getActiveTool().id).toEqual(toolId);
});

function findViewAtPoint(point: Point) {
    const canvasPanel = this.registry.ui.helper.hoveredPanel as Canvas2dPanel;

    const viewAtPoint = canvasPanel.getViewStore().getAllViews().find(view => view.getBounds().containsPoint(point));

    return viewAtPoint;
}