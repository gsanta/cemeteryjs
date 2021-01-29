import { MeshSnapper } from "../../../../../core/engine/adapters/babylonjs/mesh/MeshSnapper";
import { MeshSideInfo } from "../../../../../core/engine/IMeshAdapter";
import { ObjEventType } from "../../../../../core/models/ObjObservable";
import { ShapeEventType, ShapeObservable } from "../../../../../core/models/ShapeObservable";
import { AbstractCanvasPanel } from "../../../../../core/plugin/AbstractCanvasPanel";
import { Registry } from "../../../../../core/Registry";
import { sceneAndGameViewRatio } from "../../../../../core/stores/ShapeStore";
import { Point } from "../../../../../utils/geometry/shapes/Point";
import { Point_3 } from "../../../../../utils/geometry/shapes/Point_3";
import { MoveAxisShapeType, MoveAxisView } from "../../models/shapes/edit/MoveAxisShape";
import { AbstractAxisTool } from "./AbstractAxisTool";

export const MoveAxisToolId = 'move-axis-tool';

var globalUnsnapped = false;

export class MoveAxisTool extends AbstractAxisTool<MoveAxisView> {
    private snapper: MeshSnapper;
    private currSnapInfo: [MeshSideInfo, MeshSideInfo] = undefined;
    private currPointerAfterSnap: Point;
    private currPointerAfterUnsnap: Point;
    private unsnapped = false;
    private snapVector: Point_3;
    private snapTurnedOff = false;

    constructor(panel: AbstractCanvasPanel, registry: Registry, shapeObservable: ShapeObservable) {
        super(MoveAxisToolId, panel, registry, shapeObservable, MoveAxisShapeType);
        this.snapper = new MeshSnapper(registry);
    }
 
    protected updateX() {
        this.snapOrUnsnap();

        if (!this.currSnapInfo) {
            let delta = new Point_3(this.registry.services.pointer.pointer.getDiff().x, 0, 0);    
            this.meshView.move(delta);
            this.shapeObservable.emit({shape: this.meshView, eventType: ShapeEventType.PositionChanged});
        }
    }

    protected updateY() {
        this.snapOrUnsnap();

        if (!this.currSnapInfo) {
            const deltaY = -this.registry.services.pointer.pointer.getDiff().y / 10;
            let delta = new Point_3(0, deltaY, 0);    
            this.meshView.getObj().translate(delta);
        }

    }

    protected updateZ() {
        this.snapOrUnsnap();

        if (!this.currSnapInfo) {
            let delta = new Point_3(0, this.registry.services.pointer.pointer.getDiff().y, 0);
            this.meshView.move(delta);
            this.shapeObservable.emit({shape: this.meshView, eventType: ShapeEventType.PositionChanged});
        }
    
    }

    private snapOrUnsnap() {
        if (this.snapTurnedOff) {
            return;
        }

        if (!this.currSnapInfo) {
            this.snap();
        } else {
            this.unsnap();
        }
    }

    private snap(): boolean {
        const snapInfo = this.snapper.getSnapInfo(this.meshView.getObj());
        if (snapInfo) {
            this.snapVector = this.snapper.snap(...snapInfo);
            this.currSnapInfo = snapInfo;
            this.currPointerAfterSnap = this.registry.services.pointer.pointer.curr.clone();
            this.registry.data.scene.observable.emit({obj: this.meshView.getObj(), eventType: ObjEventType.PositionChanged});

            return true;
        }

        return false;
    }

    private unsnap() {
        const curr = this.registry.services.pointer.pointer.curr;
        let pointerDiff = curr.clone().subtract(this.currPointerAfterSnap);
        const pointerDiff3 = new Point_3(pointerDiff.x, 0, -pointerDiff.y).div(sceneAndGameViewRatio);
        const unsnapped = this.snapper.unsnap(this.currSnapInfo[0], this.currSnapInfo[1], pointerDiff3);
        if (unsnapped) {
            globalUnsnapped = true;
            this.currSnapInfo = undefined;
            this.currPointerAfterSnap = undefined;
            this.unsnapped = true;
            this.currPointerAfterUnsnap = curr.clone();
            this.registry.data.scene.observable.emit({obj: this.meshView.getObj(), eventType: ObjEventType.PositionChanged});
            this.snapTurnedOff = true;

            setTimeout(() => {
                this.snapTurnedOff = false;
            }, 100);
        }
    }
}