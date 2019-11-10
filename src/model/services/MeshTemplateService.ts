import { Point } from "@nightshifts.inc/geometry";
import { WorldItemDefinition } from "../../WorldItemDefinition";
import { MeshTemplate } from "../../MeshTemplate";

export interface MeshTemplateService<M, S> {
    hasTemplate(type: string): boolean;
    getTemplate(type: string): MeshTemplate<M, S>;
    getTemplateDimensions(type: string): Point;
    loadAll(meshDescriptors: WorldItemDefinition[]): Promise<unknown>;
}