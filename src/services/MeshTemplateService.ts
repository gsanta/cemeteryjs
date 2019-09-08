import { MeshTemplate } from "../MeshTemplate";
import { MeshDescriptor, FileDescriptor } from "../Config";
import { Point } from "@nightshifts.inc/geometry";

export interface MeshTemplateService<M, S> {
    meshTemplates: Map<string, MeshTemplate<M, S>>;
    hasTemplate(type: string): boolean;
    getTemplateDimensions(type: string): Point;
    loadAll(meshDescriptors: MeshDescriptor<FileDescriptor>[]): Promise<unknown>;
}