import { Given, TableDefinition, Then, World } from "cucumber";
import { View } from "../../../src/core/models/views/View";
import expect from 'expect';
import { Canvas2dPanel } from "../../../src/core/plugin/Canvas2dPanel";
import { Rectangle } from "../../../src/utils/geometry/shapes/Rectangle";
import { Point } from "../../../src/utils/geometry/shapes/Point";
import { getViewProperty, setViewProperty, ViewTableProp } from "./common/viewTestUtils";
import { ViewDumper } from "./common/ViewDumper";

Given('views on canvas \'{word}\':', function (canvasId: string, tableDef: TableDefinition) {
    const viewTableProps = collectViewTableProps(tableDef);

    if (viewTableProps[0] !== ViewTableProp.Type) {
        throw new Error('To register views the first column of the table has to be the \'Type\' column');
    }
    
    const canvasPanel = (this.registry.ui.canvas.getCanvas(canvasId) as Canvas2dPanel);

    tableDef.rows().forEach((row: string[]) => {
        const dimensionsIndex = viewTableProps.indexOf(ViewTableProp.Bounds);
        let dimensions: Rectangle = dimensionsIndex !== -1 ? Rectangle.fromString(row[dimensionsIndex]) : new Rectangle(new Point(100, 100), new Point(110, 110));
        const view = canvasPanel.getViewStore().getViewFactory(row[0]).instantiateOnCanvas(canvasPanel, dimensions);

        row.forEach(((prop, index) => setViewProperty(view, viewTableProps[index], prop)))
    });
});

Then('canvas contains:', function (tableDef: TableDefinition) {
    const canvasPanel = this.registry.ui.helper.hoveredPanel as Canvas2dPanel; 

    canvasContains(tableDef, canvasPanel.getViewStore().getAllViews(), true);
});

Then('canvas contains some of:', function (tableDef: TableDefinition) {
    const canvasPanel = this.registry.ui.helper.hoveredPanel as Canvas2dPanel; 

    canvasContains(tableDef, canvasPanel.getViewStore().getAllViews(), false);
});

Then('canvas is empty', function () {
    const canvasPanel = this.registry.ui.helper.hoveredPanel as Canvas2dPanel; 

    expect(canvasPanel.getViewStore().getAllViews().length).toEqual(0);
});

Then('canvas selection contains:', function (tableDef: TableDefinition) {
    const canvasPanel = this.registry.ui.helper.hoveredPanel as Canvas2dPanel; 

    canvasContains(tableDef, canvasPanel.getViewStore().getSelectedViews(), true);
});

Then('canvas selection contains some of:', function (tableDef: TableDefinition) {
    const canvasPanel = this.registry.ui.helper.hoveredPanel as Canvas2dPanel; 

    canvasContains(tableDef, canvasPanel.getViewStore().getSelectedViews(), true);
});

Then('view properties are:', function (tableDef: TableDefinition) {
    viewPropertiesAre(this, tableDef);
});

Then('dump views:', function(tableDef: TableDefinition) {
    const viewTableProps = collectViewTableProps(tableDef);
    new ViewDumper().dump(this.registry, viewTableProps);
});


function viewPropertiesAre(world: World, tableDef: TableDefinition) {
    const views = world.registry.data.view.scene.getAllViews();
    const viewTableProps = collectViewTableProps(tableDef);

    if (viewTableProps[0] !== ViewTableProp.Id) {
        throw new Error('To check the properties of a specific view, the first column of the table has to be the \'Id\' column.');
    }

    tableDef.rows().forEach((row: string[]) => {
        const viewToCheck: View = views.find((v: View) => v.id === row[0]);

        if (!viewToCheck) {
            throw new Error(`View with id '${row[0]}' was expected, but not found.`);
        }

        row.forEach((expectedPropValue: string, propIdx: number) => {
            const prop: ViewTableProp = viewTableProps[propIdx];
            expect(getViewProperty(viewToCheck, prop)).toEqual(expectedPropValue);
        })
    });
}

function collectViewTableProps(tableDef: TableDefinition): ViewTableProp[] {
    return <ViewTableProp[]> tableDef.raw()[0];
}

function canvasContains(tableDef: TableDefinition, views: View[], exactMatch: boolean) {
    const viewTableProps = collectViewTableProps(tableDef);

    if (exactMatch) {
        expect(views.length).toEqual(tableDef.rows().length);
    }

    tableDef.rows().forEach((row: string[]) => {
        const viewToCheck: View = views.find((v: View) => v.id === row[0]);

        if (!viewToCheck) {
            throw new Error(`View with id '${row[0]}' was expected, but not found.`);
        }

        row.forEach((expectedPropValue: string, propIdx: number) => {
            const prop: ViewTableProp = viewTableProps[propIdx];
            expect(getViewProperty(viewToCheck, prop)).toEqual(expectedPropValue);
        })
    });
}