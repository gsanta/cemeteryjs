import { WorldItemDefinition } from "../../../../WorldItemDefinition";
import { WorldItemDefinitionModel } from "../../world_items/WorldItemDefinitionModel";
import { TextCanvasController } from './TextCanvasController';
import { ICanvasReader } from '../ICanvasReader';

export class TextCanvasReader implements ICanvasReader {
    private textEditorController: TextCanvasController;

    constructor(textEditorController: TextCanvasController) {
        this.textEditorController = textEditorController;
    }

    read(): string {
        return this.createFile(this.textEditorController.worldItemDefinitionModel);
    }

    private createFile(worldItemDefinitionModel: WorldItemDefinitionModel) {
        const definitions = this.createDefinitionSection(worldItemDefinitionModel);
    
            return `
map \`

${this.textEditorController.text.trim()}

\`

definitions \`

${definitions}

\`
`;
    }

    private createDefinitionSection(worldItemDefinitionModel: WorldItemDefinitionModel) {
        const lines = worldItemDefinitionModel.types.map(descriptor => this.createDefinitionLine(descriptor));

        return lines.join('\n');
    }

    private createDefinitionLine(worldItemDefinition: WorldItemDefinition): string {
        let line = `${worldItemDefinition.char} = ${worldItemDefinition.typeName}`;

        if (worldItemDefinition.roles && worldItemDefinition.roles.length > 0) {
            let roles = '';

            worldItemDefinition.roles.forEach(role => roles += ` ${role}`);
            
            line += ` ROLES [${roles}]`;        }

        if (worldItemDefinition.model) {
            line += ` MOD ${worldItemDefinition.model}`;
        }

        if (worldItemDefinition.materials && worldItemDefinition.materials.length > 0) {
            let materialPaths = '';

            worldItemDefinition.materials.forEach(mat => materialPaths += ` ${mat}`);
            
            line += ` MAT [${materialPaths}]`;
        }

        if (worldItemDefinition.scale) {
            line += ` SCALE ${worldItemDefinition.scale}`
        }

        if (worldItemDefinition.translateY) {
            line += ` TRANS_Y ${worldItemDefinition.translateY}`
        }

        return line;
    }
}