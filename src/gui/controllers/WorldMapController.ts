import { ControllerFacade } from "./ControllerFacade";
import { MeshDescriptor } from "../../Config";

export class WorldMapController {
    private controllers: ControllerFacade;

    private meshDescriptors: MeshDescriptor[];
    private map: string;

    private worldMap: string;

    constructor(controllers: ControllerFacade) {
        this.controllers = controllers;
    }
    
    getMap(): string {
        if (this.shouldUpdateWorldMap()) {
            this.updateWorldMap();
        }

        return this.worldMap;
    }

    private createDefinitionSection() {
        const meshDescriptors = this.controllers.definitionController.meshDescriptors;

        const lines = meshDescriptors.map(descriptor => this.createDefinitionLine(descriptor));

        return lines.join('\n');
    }

    private createDefinitionLine(meshDescriptor: MeshDescriptor): string {
        let line = `${meshDescriptor.char} = ${meshDescriptor.type}`;

        if (meshDescriptor.isBorder) {
            line += ' BORDER';
        }

        if (meshDescriptor.model) {
            line += ` MOD ${meshDescriptor.model}`;
        }

        if (meshDescriptor.materials && meshDescriptor.materials.length > 0) {
            let materialPaths = '';

            meshDescriptor.materials.forEach(mat => materialPaths += ` ${mat}`);
            
            line += ` MAT [${materialPaths}]`;
        }

        if (meshDescriptor.scale) {
            line += ` SCALE ${meshDescriptor.scale}`
        }

        if (meshDescriptor.translateY) {
            line += ` TRANS_Y ${meshDescriptor.translateY}`
        }

        return line;
    }

    private shouldUpdateWorldMap() {
        return this.map !== this.controllers.textEditorController.text || this.meshDescriptors !== this.controllers.definitionController.meshDescriptors;
    }

    private updateWorldMap() {
        this.worldMap = this.createWorldMap();

        this.map = this.controllers.textEditorController.text;
        this.meshDescriptors = this.controllers.definitionController.meshDescriptors;
    }

    private createWorldMap(): string {
        const map = this.controllers.textEditorController.text;
        const definitions = this.createDefinitionSection();

        return `
map \`

${map.trim()}

\`

definitions \`

${definitions}

\`
`;
    }
}