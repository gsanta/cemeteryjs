import { PointerEventTypes, PointerInfo } from "babylonjs";
import { Point } from "../../../../utils/geometry/shapes/Point";
import { Registry } from "../../../Registry";
import { IPointerEvent } from "../../../services/input/PointerService";
import { Bab_EngineFacade } from "./Bab_EngineFacade";

export class Bab_PointerService {
    private engineFacade: Bab_EngineFacade;
    private registry: Registry;

    constructor(registry: Registry, engineFacade: Bab_EngineFacade) {
        this.engineFacade = engineFacade;
        this.registry = registry;

        this.engineFacade.onReady(() => this.init());
    }

    private init() {
        const tools = this.engineFacade.toolService;

        this.engineFacade.scene.onPointerObservable.add((pointerInfo) => {
            switch(pointerInfo.type) {
                case PointerEventTypes.POINTERUP:
                    tools.getSelectedTool().up(pointerInfo);
                break;
                case PointerEventTypes.POINTERMOVE:
                    this.registry.services.pointer.pointerMove(undefined, this.convertToIPointerEvent(pointerInfo), undefined);
                break;
            }
        });
    }

    private convertToIPointerEvent(pointerInfo: PointerInfo): IPointerEvent {
        return {
            pointers: [{id: 1, pos: new Point(pointerInfo.event.offsetX, pointerInfo.event.offsetY), isDown: false}],
            preventDefault: () => pointerInfo.event.preventDefault(),
            button: 'left',
            isAltDown: !!pointerInfo.event.altKey,
            isShiftDown: !!pointerInfo.event.shiftKey,
            isCtrlDown: !!pointerInfo.event.ctrlKey,
            isMetaDown: !!pointerInfo.event.metaKey,
        };
    }
}