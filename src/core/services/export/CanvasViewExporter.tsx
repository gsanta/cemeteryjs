import * as React from 'react';
import { Registry } from "../../Registry";
import { Camera2D } from "../../../plugins/common/camera/Camera2D";
import { IViewExporter } from "./IViewExporter";
import { SceneEditorPlugin } from '../../../plugins/scene_editor/SceneEditorPlugin';

export class CanvasViewExporter implements IViewExporter {
    private registry: Registry;

    constructor(registry: Registry) {
        this.registry = registry;
    }


    export(): JSX.Element {
        const canvasView = this.registry.services.layout.getViewById(SceneEditorPlugin.id);

        return (
            <g
                data-view-type={SceneEditorPlugin.id}
                data-zoom={(canvasView.getCamera() as Camera2D).getScale()}
                data-translate={(canvasView.getCamera() as Camera2D).getTranslate().toString()}
            />
        )
    }
}