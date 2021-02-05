import { Given, TableDefinition, Then, World } from "cucumber";
import expect from 'expect';
import { AbstractShape } from "../../../src/core/models/shapes/AbstractShape";
import { Canvas2dPanel } from "../../../src/core/plugin/Canvas2dPanel";
import { NodeEditorPanelId } from "../../../src/modules/graph_editor/NodeEditorModule";
import { SketchEditorPanelId } from "../../../src/modules/sketch_editor/main/SketchEditorModule";
import { ModelDumper } from "./common/ModelDumper";
import { collectViewTableProps, getViewProperty, ViewTableProp } from "./common/viewTestUtils";
import { NodeEditorTestUtils } from "./utils/canvas/NodeEditorTestUtils";
import { SceneEditorTestUtils } from "./utils/canvas/SceneEditorTestUtilts";

Given('views on canvas \'{word}\':', function (canvasId: string, tableDef: TableDefinition) {
    switch(canvasId) {
        case NodeEditorPanelId:
            NodeEditorTestUtils.createViewsFromTable(this.registry, tableDef);
            break;
        case SketchEditorPanelId:
            SceneEditorTestUtils.createViewsFromTable(this.registry, tableDef);
            break;
    }
});

Then('canvas contains:', function (tableDef: TableDefinition) {
    const canvasPanel = this.registry.ui.helper.hoveredPanel as Canvas2dPanel<AbstractShape>; 

    canvasContains(tableDef, canvasPanel.data.items.getAllItems(), true);
});

Then('canvas contains some of:', function (tableDef: TableDefinition) {
    const canvasPanel = this.registry.ui.helper.hoveredPanel as Canvas2dPanel<AbstractShape>; 

    canvasContains(tableDef, canvasPanel.data.items.getAllItems(), false);
});

Then('canvas is empty', function () {
    const canvasPanel = this.registry.ui.helper.hoveredPanel as Canvas2dPanel<AbstractShape>; 

    expect(canvasPanel.data.items.getAllItems().length).toEqual(0);
});

Then('canvas selection contains:', function (tableDef: TableDefinition) {
    const canvasPanel = this.registry.ui.helper.hoveredPanel as Canvas2dPanel<AbstractShape>; 

    canvasContains(tableDef, canvasPanel.data.selection.getAllItems(), true);
});

Then('canvas selection contains some of:', function (tableDef: TableDefinition) {
    const canvasPanel = this.registry.ui.helper.hoveredPanel as Canvas2dPanel<AbstractShape>; 

    canvasContains(tableDef, canvasPanel.data.selection.getAllItems(), true);
});

Then('contained views of \'{word}\' are:', function(viewId: string, tableDef: TableDefinition) {
    const canvasPanel = this.registry.ui.helper.hoveredPanel as Canvas2dPanel<AbstractShape>;
    
    const view = canvasPanel.data.items.getItemById(viewId);

    if (!view) {
        throw new Error(`View with id '${viewId}' not found on canvas '${canvasPanel.id}'`);1
    }

    canvasContains(tableDef, view.containedShapes, true);
});

Then('contained views of \'{word}\' partially are:', function(viewId: string, tableDef: TableDefinition) {
    const canvasPanel = this.registry.ui.helper.hoveredPanel as Canvas2dPanel<AbstractShape>;
    
    const view = canvasPanel.data.items.getItemById(viewId);

    if (!view) {
        throw new Error(`View with id '${viewId}' not found on canvas '${canvasPanel.id}'`);1
    }

    canvasContains(tableDef, view.containedShapes, false);
});

Then('dump contained views of \'{word}\':', function(viewId: string, tableDef: TableDefinition) {
    const canvasPanel = this.registry.ui.helper.hoveredPanel as Canvas2dPanel<AbstractShape>;
    const view = canvasPanel.data.items.getItemById(viewId);
    
    if (!view) {
        throw new Error(`View with id '${viewId}' not found on canvas '${canvasPanel.id}'`);
    }
    
    const viewTableProps = collectViewTableProps(tableDef);
    
    new ModelDumper().dumpViews(viewTableProps, view.containedShapes);
});

Then('view properties are:', function (tableDef: TableDefinition) {
    viewPropertiesAre(this, tableDef);
});

Then('dump views:', function(tableDef: TableDefinition) {
    const viewTableProps = collectViewTableProps(tableDef);
    const canvasPanel = this.registry.ui.helper.hoveredPanel as Canvas2dPanel<AbstractShape>;
    new ModelDumper().dumpViews(viewTableProps, canvasPanel.data.items.getAllItems());
});

function viewPropertiesAre(world: World, tableDef: TableDefinition) {
    const views = world.registry.data.sketch.items.getAllItems();
    const viewTableProps = collectViewTableProps(tableDef);

    if (viewTableProps[0] !== ViewTableProp.Id) {
        throw new Error('To check the properties of a specific view, the first column of the table has to be the \'Id\' column.');
    }

    tableDef.rows().forEach((row: string[]) => {
        const viewToCheck: AbstractShape = views.find((v: AbstractShape) => v.id === row[0]);

        if (!viewToCheck) {
            throw new Error(`View with id '${row[0]}' was expected, but not found.`);
        }

        row.forEach((expectedPropValue: string, propIdx: number) => {
            const prop: ViewTableProp = viewTableProps[propIdx];
            expect(getViewProperty(viewToCheck, prop)).toEqual(expectedPropValue);
        })
    });
}

function canvasContains(tableDef: TableDefinition, views: AbstractShape[], exactMatch: boolean) {
    const viewTableProps = collectViewTableProps(tableDef);

    if (exactMatch) {
        expect(views.length).toEqual(tableDef.rows().length);
    }

    tableDef.rows().forEach((row: string[]) => {
        const viewToCheck: AbstractShape = views.find((v: AbstractShape) => v.id === row[0]);

        if (!viewToCheck) {
            throw new Error(`View with id '${row[0]}' was expected, but not found.`);
        }

        row.forEach((expectedPropValue: string, propIdx: number) => {
            const prop: ViewTableProp = viewTableProps[propIdx];
            expect(getViewProperty(viewToCheck, prop)).toEqual(expectedPropValue);
        })
    });
}