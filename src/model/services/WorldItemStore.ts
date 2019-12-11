import { WorldItemTemplate, WorldItemRole } from '../../WorldItemTemplate';
import { GlobalConfig } from '../readers/text/GlobalSectionParser';
import { WorldItem } from '../../WorldItem';

export class WorldItemStore {
    globalConfig: GlobalConfig;
    
    worldItemTemplates: WorldItemTemplate[];
    worldItemHierarchy: WorldItem[];

    constructor(worldItemTemplates: WorldItemTemplate[] = [], globalConfig?: GlobalConfig) {
        this.setWorldItemTemplates(worldItemTemplates);
        this.globalConfig = globalConfig;
    }

    setWorldItemTemplates(worldItemTemplates: WorldItemTemplate[]) {
        this.worldItemTemplates = worldItemTemplates;
        this.worldItemTemplates.push({
            id: WorldItemTemplate.generateId(this.worldItemTemplates),
            typeName: 'root',
            shape: 'rectangle',
            roles: [WorldItemRole.CONTAINER],
        });
    }
}