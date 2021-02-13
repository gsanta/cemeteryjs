import { GizmoManager, UtilityLayerRenderer } from "babylonjs";
import { GizmoType } from "../../../../modules/scene_editor/main/GizmoHandler";
import { Point } from "../../../../utils/geometry/shapes/Point";
import { AbstractGameObj } from "../../../models/objs/AbstractGameObj";
import { Registry } from "../../../Registry";
import { IGizmo } from "../../IGizmo";
import { IGizmoAdapter } from "../../IGizmoAdapter";
import { Bab_EngineFacade } from "./Bab_EngineFacade";
import { Bab_PositionGizmo } from "./gizmos/Bab_PositionGizmo";
import { Bab_RotationGizmo } from "./gizmos/Bab_RotationGizmo";
import { Bab_ScaleGizmo } from "./gizmos/Bab_ScaleGizmo";
import { IBabylonGizmo } from "./gizmos/IBabylonGizmo";

export class Bab_GizmoAdapter implements IGizmoAdapter {
    private engineFacade: Bab_EngineFacade;
    private gizmos: Map<string, IBabylonGizmo> = new Map();
    private gizmoMap: Map<GizmoType, IGizmo> = new Map();
    private activeGizmo: IGizmo;

    positionGizmo: Bab_PositionGizmo;
    scaleGizmo: Bab_ScaleGizmo;
    rotationGizmo: Bab_RotationGizmo;

    gizmoManager: GizmoManager;
    utilityLayer: UtilityLayerRenderer;

    constructor(registry: Registry, engineFacade: Bab_EngineFacade) {
        this.engineFacade = engineFacade;

        this.engineFacade.onReady(() => {
            this.utilityLayer = new UtilityLayerRenderer(this.engineFacade.scene);
            this.gizmoManager = new GizmoManager(this.engineFacade.scene, 2, this.utilityLayer);

            this.positionGizmo = new Bab_PositionGizmo(registry, this.engineFacade);
            this.scaleGizmo = new Bab_ScaleGizmo(registry, this.engineFacade);
            this.rotationGizmo = new Bab_RotationGizmo(registry, this.engineFacade);

            this.gizmoMap.set(GizmoType.Position, this.positionGizmo);
            this.gizmoMap.set(GizmoType.Rotation, this.rotationGizmo);
            this.gizmoMap.set(GizmoType.Scale, this.scaleGizmo);
        });
    }

    applyGizmo(obj: AbstractGameObj, gizmoType: GizmoType) {
        this.removeActiveGizmo();

        this.gizmoMap.get(gizmoType).attachTo(obj);
        this.activeGizmo = this.gizmoMap.get(gizmoType);
    }

    removeActiveGizmo() {
        if (this.activeGizmo) {
            this.activeGizmo.detach();
            this.activeGizmo = undefined;
        }
    }

    applyPositionGizmo(obj: AbstractGameObj) {
        this.positionGizmo.attachTo(obj);
    }

    removePositionGizmo() {
        throw new Error("Method not implemented.");
    }

    showGizmo(gizmoType: string) {
        this.gizmos.get(gizmoType).show();
    }

    setGizmoPosition(gizmoType: string, point: Point) {
        this.gizmos.get(gizmoType).setPosition(point);
    }

    registerGizmo(gizmo: IBabylonGizmo) {
        this.gizmos.set(gizmo.gizmoType, gizmo);
    }
}