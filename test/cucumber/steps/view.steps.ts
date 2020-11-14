import { Given, TableDefinition, Then, World } from "cucumber";
import { View } from "../../../src/core/models/views/View";
import expect from 'expect';
import { LightViewType } from '../../../src/core/models/views/LightView';

export enum ViewTableProp {
    Id = 'Id',
    Type = 'Type',
    Obj = 'Obj'
}

Given('views in canvas \'{word}\':', function (tableDef: TableDefinition) {

    const viewTableProps = collectViewTableProps(tableDef);

    if (viewTableProps[0] !== ViewTableProp.Type) {
        throw new Error('To register views the first column of the table has to be the \'Type\' column');
    }
    
    tableDef.rows().forEach((row: string[]) => {
        switch(row[0]) {
            case LightViewType:
                this.registry.
        }
    });
});

Then('canvas contains:', function (tableDef: TableDefinition) {
    canvasContains(this, tableDef);
});

Then('view properties are:', function (tableDef: TableDefinition) {
    viewPropertiesAre(this, tableDef);
});

Then('dump views', function() {
    console.log(this.registry.data.view.scene.getAllViews().map(v => v.id).join(', '));
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

function canvasContains(world: World, tableDef: TableDefinition) {
    const views = world.registry.data.view.scene.getAllViews();
    const viewTableProps = collectViewTableProps(tableDef);

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

function getViewProperty(view: View, prop: ViewTableProp) {

    switch(prop) {
        case ViewTableProp.Id:
            return  view.id;
        case ViewTableProp.Type:
            return view.viewType;
        case ViewTableProp.Obj:
            return view.getObj() && view.getObj().id;
        default:
            return '';
    }
}
