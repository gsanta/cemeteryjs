import { TableDefinition } from "cucumber";
import { Canvas2dPanel } from "../../../../../src/core/plugin/Canvas2dPanel";
import { Registry } from "../../../../../src/core/Registry";
import { SceneEditorPanelId } from "../../../../../src/plugins/canvas_plugins/scene_editor/registerSceneEditor";
import { Point } from "../../../../../src/utils/geometry/shapes/Point";
import { Rectangle } from "../../../../../src/utils/geometry/shapes/Rectangle";
import { collectViewTableProps, setViewProperty, ViewTableProp } from "../../common/viewTestUtils";

export class SceneEditorTestUtils {
    static createViewsFromTable(registry: Registry, tableDef: TableDefinition) {
        const viewTableProps = collectViewTableProps(tableDef);
        
        let typeColumnIndex = viewTableProps.indexOf(ViewTableProp.Type);
        if (typeColumnIndex === -1) {
            throw new Error('To register views the the table must contain a \'Type\' column');
        }

        const canvasPanel = <Canvas2dPanel> registry.ui.canvas.getCanvas(SceneEditorPanelId);

        tableDef.rows().forEach((row: string[]) => {
            const dimensionsIndex = viewTableProps.indexOf(ViewTableProp.Bounds);
            let dimensions: Rectangle = dimensionsIndex !== -1 ? Rectangle.fromString(row[dimensionsIndex]) : new Rectangle(new Point(100, 100), new Point(110, 110));
            const view = canvasPanel.getViewStore().getViewFactory(row[0]).instantiateOnCanvas(canvasPanel, dimensions);
    
            row.forEach(((prop, index) => setViewProperty(canvasPanel, view, viewTableProps[index], prop)))
        });
    }
}