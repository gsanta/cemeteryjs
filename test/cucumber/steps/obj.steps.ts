import { TableDefinition, Then, World } from "cucumber";
import expect from 'expect';
import { IObj } from "../../../src/core/models/objs/IObj";
import { LightObj, LightObjType } from "../../../src/core/models/objs/LightObj";
import { ViewTableProp } from "./common/viewTestUtils";

Then('obj properties are:', function (tableDef: TableDefinition) {
    objPropertiesAre(this, tableDef);
});

function collectObjTablePropsToCheck(tableDef: TableDefinition): ViewTableProp[] {
    return <ViewTableProp[]> tableDef.raw()[0];
}

function objPropertiesAre(world: World, tableDef: TableDefinition) {
    const objs = world.registry.stores.objStore.getAll();
    const viewTableProps = collectObjTablePropsToCheck(tableDef);

    if (viewTableProps[0] !== ViewTableProp.Id) {
        throw new Error('To check the properties of a specific obj, the first column of the table has to be the \'Id\' column.');
    }

    tableDef.rows().forEach((row: string[]) => {
        const objToCheck: IObj = objs.find((v: IObj) => v.id === row[0]);

        if (!objToCheck) {
            throw new Error(`Obj with id '${row[0]}' was expected, but not found.`);
        }

        row.forEach((expectedPropValue: string, propIdx: number) => {
            const prop: ViewTableProp = viewTableProps[propIdx];
            expect(getObjProperty(objToCheck, prop)).toEqual(expectedPropValue);
        })
    });
}

function getObjProperty(obj: IObj, prop: ViewTableProp) {
    switch(prop) {
        case ViewTableProp.Id:
            return obj.id;
        case ViewTableProp.Type:
            return obj.objType;
    }

    if (obj.objType === LightObjType) {
        return getLightObjProperty(<LightObj> obj, prop);
    }
}

function getLightObjProperty(obj: LightObj, prop: ViewTableProp) {
    switch(prop) {
        case ViewTableProp.Pos:
            return obj.getPosition().toString();
        case ViewTableProp.PosY:
            return obj.getPosition().y.toString();
    }
}

