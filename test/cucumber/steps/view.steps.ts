import { TableDefinition, Then, World } from "cucumber";
import { View } from "../../../src/core/models/views/View";
import expect from 'expect';

export enum ViewTableProp {
    Id = 'Id',
    Type = 'Type'
}

Then('canvas contains:', function (tableDef: TableDefinition) {
    canvasContains(this, tableDef);
});

Then('dump views', function() {
    console.log(this.registry.data.view.scene.getAllViews().map(v => v.id).join(', '));
});

function collectViewTablePropsToCheck(tableDef: TableDefinition): ViewTableProp[] {
    return <ViewTableProp[]> tableDef.raw()[0];
}

function canvasContains(world: World, tableDef: TableDefinition) {
    const views = world.registry.data.view.scene.getAllViews();
    const ViewTableProp = collectViewTablePropsToCheck(tableDef);

    tableDef.rows().forEach((row: string[]) => {
        const viewToCheck: View = views.find((v: View) => v.id === row[0]);

        if (!viewToCheck) {
            throw new Error(`View with id '${row[0]}' was expected, but not found.`);
        }

        row.forEach((expectedPropValue: string, propIdx: number) => {
            const prop: ViewTableProp = ViewTableProp[propIdx];
            expect(getViewProperty(viewToCheck, prop)).toEqual(expectedPropValue);
        })
    });
}

function getViewProperty(view: View, prop: ViewTableProp) {

    switch(prop) {
        case ViewTableProp.Id:
            return  view.id;
        case ViewTableProp.Type:
            return view.viewType;
        default:
            return '';
    }
}
