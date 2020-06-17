import { AbstractTool } from "./AbstractTool";
import { Cursor } from "./Tool";

export class NoopTool extends AbstractTool {


    getCursor() {
        return Cursor.Default;
    }
}