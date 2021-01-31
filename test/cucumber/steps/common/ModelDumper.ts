import { NodeObj } from "../../../../src/core/models/objs/node_obj/NodeObj";
import { AbstractShape } from "../../../../src/core/models/shapes/AbstractShape";
import { Registry } from "../../../../src/core/Registry";
import { getObjProperty, ObjTableProp } from "./objTestUtils";
import { getViewProperty, ViewTableProp } from "./viewTestUtils";

export class ModelDumper {
    dumpViews(viewTableProps: ViewTableProp[], views: AbstractShape[]) {
        console.log(viewTableProps.join(', '))
        const columns: string[][] = [];

        viewTableProps.forEach(prop => columns.push([prop]));

        views.forEach(view => viewTableProps.forEach((prop, index) => columns[index].push(getViewProperty(view, prop))));
    
        const maxColumnLengths = this.getMaxColumnLengths(columns);
        this.printTable(columns, maxColumnLengths);
    }

    dumpObjs(registry: Registry, objTableProps: ObjTableProp[]) {
        const columns: string[][] = [];

        objTableProps.forEach(prop => columns.push([prop]));

        registry.stores.objStore.getAllItems().forEach(obj => objTableProps.forEach((prop, index) => columns[index].push(getObjProperty(registry, obj, prop))));
    
        const maxColumnLengths = this.getMaxColumnLengths(columns);
        this.printTable(columns, maxColumnLengths);
    
    }

    dumpNodeParams(nodeObj: NodeObj) {
        const columns: string[][] = [];

        const paramNames = nodeObj.getParams().map(param => param.name);

        paramNames.forEach(prop => columns.push([prop]));
        paramNames.forEach((prop, index) => columns[index].push(nodeObj.param[paramNames[index]].val));
    
        const maxColumnLengths = this.getMaxColumnLengths(columns);
        this.printTable(columns, maxColumnLengths);
    }

    private getMaxColumnLengths(columns: string[][]): number[] {
        return columns.map(column => {
            const columDataLengths = column.map(col => col ? col.length : 1);
            columDataLengths.sort((a, b) => b - a);
    
            return columDataLengths[0];
        });
    }

    private printTable(columns: string[][], maxColumnLengths: number[]) {
        console.log(`----------------------------------`);
    
        for (let i = 0; i < columns[0].length; i++) {
            let strs: string[] = [];
            for (let j = 0; j < columns.length; j++) {
                const paddedStr = this.padString(columns[j][i], maxColumnLengths[j]);
                strs.push(paddedStr);
            }
    
            console.log(`      | ${strs.join(' | ')} |`);
        }
    }

    private padString(str: string, len: number) {
        const pad = len - (str ? str.length : 1);

        for (let i = 0; i < pad; i++) {
            str += ' ';
        }

        return str;
    }
}