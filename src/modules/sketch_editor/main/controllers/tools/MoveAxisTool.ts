import { MeshSnapper } from "../../../../../core/engine/adapters/babylonjs/mesh/MeshSnapper";
import { MeshSideInfo } from "../../../../../core/engine/IMeshAdapter";
import { ShapeEventType, ShapeObservable } from "../../../../../core/models/ShapeObservable";
import { AbstractCanvasPanel } from "../../../../../core/plugin/AbstractCanvasPanel";
import { Registry } from "../../../../../core/Registry";
import { sceneAndGameViewRatio } from "../../../../../core/stores/ShapeStore";
import { Point } from "../../../../../utils/geometry/shapes/Point";
import { Point_3 } from "../../../../../utils/geometry/shapes/Point_3";
import { MoveAxisView, MoveAxisShapeType } from "../../models/shapes/edit/MoveAxisShape";
import { AbstractAxisTool } from "./AbstractAxisTool";

export const MoveAxisToolId = 'move-axis-tool';

export class MoveAxisTool extends AbstractAxisTool<MoveAxisView> {
    private snapper: MeshSnapper;
    private currSnapInfo: [MeshSideInfo, MeshSideInfo] = undefined;
    private currPointerAfterSnap: Point;
    private currPointerAfterUnsnap: Point;
    private unsnapped = false;

    constructor(panel: AbstractCanvasPanel, registry: Registry, shapeObservable: ShapeObservable) {
        super(MoveAxisToolId, panel, registry, shapeObservable, MoveAxisShapeType);
        this.snapper = new MeshSnapper(registry);
    }
 
    protected updateX() {
        if (!this.unsnapped) {
            if (!this.currSnapInfo) {
                this.snap();
            } else {
                this.unsnap();
            }
        }

        if (!this.currSnapInfo) {
            console.log('translate')
            let delta = new Point_3(this.registry.services.pointer.pointer.getDiff().x, 0, 0);    
            this.meshView.move(delta);
            this.shapeObservable.emit({shape: this.meshView, eventType: ShapeEventType.PositionChanged});
        }
    }

    protected updateY() {
        const deltaY = -this.registry.services.pointer.pointer.getDiff().y / 10;
        let delta = new Point_3(0, deltaY, 0);    
        
        this.meshView.getObj().translate(delta);

        this.snap();
    }

    protected updateZ() {
        let delta = new Point_3(0, this.registry.services.pointer.pointer.getDiff().y, 0);
        this.meshView.move(delta);
        this.shapeObservable.emit({shape: this.meshView, eventType: ShapeEventType.PositionChanged});
    
        this.snap();
    }

    private snap(): boolean {
        const snapInfo = this.snapper.getSnapInfo(this.meshView.getObj());
        if (snapInfo) {
            this.snapper.snap(...snapInfo);
            this.currSnapInfo = snapInfo;
            this.currPointerAfterSnap = this.registry.services.pointer.pointer.curr.clone();

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
            this.currSnapInfo = undefined;
            this.currPointerAfterSnap = undefined;
            this.unsnapped = true;
            this.currPointerAfterUnsnap = curr.clone();
        }
    }
}