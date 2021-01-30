import { PointerEventTypes, PointerInfo } from "babylonjs";
import { SceneEditorPanelId } from "../../../../modules/scene_editor/main/SceneEditorModule";
import { Point } from "../../../../utils/geometry/shapes/Point";
import { AbstractCanvasPanel } from "../../../plugin/AbstractCanvasPanel";
import { Registry } from "../../../Registry";
import { IPointerEvent } from "../../../controller/PointerHandler";
import { Bab_EngineFacade } from "./Bab_EngineFacade";
import { IObj } from "../../../models/objs/IObj";

export class Bab_PointerService {
    private engineFacade: Bab_EngineFacade;
    private registry: Registry;

    constructor(registry: Registry, engineFacade: Bab_EngineFacade) {
        this.engineFacade = engineFacade;
        this.registry = registry;

        this.engineFacade.onReady(() => this.init());
    }

    private init() {
        // TODO: find a better solution
        const canvas: AbstractCanvasPanel<IObj> = this.registry.services.module.ui.getCanvas(SceneEditorPanelId);
        const tools = this.engineFacade.toolService;

        this.engineFacade.scene.onPointerObservable.add((pointerInfo) => {
            switch(pointerInfo.type) {
                case PointerEventTypes.POINTERUP:
                    tools.getSelectedTool().up(pointerInfo);
                break;
                case PointerEventTypes.POINTERMOVE:
                    canvas.pointer.pointerMove(this.convertToIPointerEvent(pointerInfo), undefined);
                break;
            }
        });
    }

    private convertToIPointerEvent(pointerInfo: PointerInfo): IPointerEvent {
        return null;
        // return {
        //     pointers: [{id: 1, pos: new Point(pointerInfo.event.offsetX, pointerInfo.event.offsetY), isDown: false}],
        //     preventDefault: () => pointerInfo.event.preventDefault(),
        //     button: 'left',
        //     isAltDown: !!pointerInfo.event.altKey,
        //     isShiftDown: !!pointerInfo.event.shiftKey,
        //     isCtrlDown: !!pointerInfo.event.ctrlKey,
        //     isMetaDown: !!pointerInfo.event.metaKey,
        // };
    }
}