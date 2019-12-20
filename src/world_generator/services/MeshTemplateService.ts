import { GameObjectTemplate } from "./GameObjectTemplate";
import { MeshTemplate } from "../../MeshTemplate";
import { Point } from "../../model/geometry/shapes/Point";

export interface MeshTemplateService<M, S> {
    hasTemplate(type: string): boolean;
    getTemplate(type: string): MeshTemplate<M, S>;
    getTemplateDimensions(type: string): Point;
    loadAll(meshDescriptors: GameObjectTemplate[]): Promise<unknown>;
}