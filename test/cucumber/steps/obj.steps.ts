import { TableDefinition, Then, World } from "cucumber";
import expect from 'expect';
import { IObj } from "../../../src/core/models/objs/IObj";
import { LightObj, LightObjType } from "../../../src/core/models/objs/LightObj";
import { getObjProperty, ObjTableProp } from "./common/objTestUtils";

Then('obj properties are:', function (tableDef: TableDefinition) {
    objPropertiesAre(this, tableDef);
});

function collectObjTablePropsToCheck(tableDef: TableDefinition): ObjTableProp[] {
    return <ObjTableProp[]> tableDef.raw()[0];
}

function objPropertiesAre(world: World, tableDef: TableDefinition) {
    const objs = world.registry.stores.objStore.getAll();
    const objTableProps = collectObjTablePropsToCheck(tableDef);

    if (objTableProps[0] !== ObjTableProp.Id) {
        throw new Error('To check the properties of a specific obj, the first column of the table has to be the \'Id\' column.');
    }

    tableDef.rows().forEach((row: string[]) => {
        const objToCheck: IObj = objs.find((v: IObj) => v.id === row[0]);

        if (!objToCheck) {
            throw new Error(`Obj with id '${row[0]}' was expected, but not found.`);
        }

        row.forEach((expectedPropValue: string, propIdx: number) => {
            const prop: ObjTableProp = objTableProps[propIdx];
            expect(getObjProperty(objToCheck, prop)).toEqual(expectedPropValue);
        })
    });
}