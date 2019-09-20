import { MeshTemplate } from "../../MeshTemplate";
import { MeshDescriptor, FileDescriptor } from "../../Config";
import { Point } from "@nightshifts.inc/geometry";

export interface MeshTemplateService<M, S> {
    hasTemplate(type: string): boolean;
    getTemplate(type: string): MeshTemplate<M, S>;
    getTemplateDimensions(type: string): Point;
    loadAll(meshDescriptors: MeshDescriptor<FileDescriptor>[]): Promise<unknown>;
}