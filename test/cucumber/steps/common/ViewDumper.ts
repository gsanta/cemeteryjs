import { Canvas2dPanel } from "../../../../src/core/plugin/Canvas2dPanel";
import { Registry } from "../../../../src/core/Registry";
import { getViewProperty, ViewTableProp } from "./viewTestUtils";

export class ViewDumper {
    dump(registry: Registry, viewTableProps: ViewTableProp[]) {
        const columns: string[][] = [];

        viewTableProps.forEach(prop => columns.push([prop]));
        const canvasPanel = registry.ui.helper.hoveredPanel as Canvas2dPanel;

        canvasPanel.getViewStore().getAllViews().forEach(view => viewTableProps.forEach((prop, index) => columns[index].push(getViewProperty(view, prop))));

    
        const maxColumnLengths = this.getMaxColumnLengths(columns);
        this.printTable(columns, maxColumnLengths);
    }

    private getMaxColumnLengths(columns: string[][]): number[] {
        return columns.map(column => {
            const columDataLengths = column.map(col => col.length);
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
        const pad = len - str.length;

        for (let i = 0; i < pad; i++) {
            str += ' ';
        }

        return str;
    }
}