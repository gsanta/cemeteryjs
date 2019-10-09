import { Point } from "@nightshifts.inc/geometry";
import { MeshDescriptor } from "../../Config";
import { MeshTemplate } from "../../MeshTemplate";

export interface MeshTemplateService<M, S> {
    hasTemplate(type: string): boolean;
    getTemplate(type: string): MeshTemplate<M, S>;
    getTemplateDimensions(type: string): Point;
    loadAll(meshDescriptors: MeshDescriptor[]): Promise<unknown>;
}