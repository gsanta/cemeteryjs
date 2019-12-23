import * as convert from 'xml-js';
import { GameObjectTemplate, WorldItemRole } from '../../services/GameObjectTemplate';
import { IConfigReader } from '../IConfigReader';
import { GlobalConfig } from '../text/GlobalSectionParser';
import { RawWorldMapJson, WgDefinition } from './WorldMapJson';
import { Point } from '../../../model/geometry/shapes/Point';

export class SvgConfigReader implements IConfigReader {
    read(worldMap: string): {gameObjectTemplates: GameObjectTemplate[], globalConfig: GlobalConfig} {
        const rawJson: RawWorldMapJson = JSON.parse(convert.xml2json(worldMap, {compact: true, spaces: 4}));

        const gameObjectTemplates = this.parseWorldItemDefinitions(rawJson);

        return {gameObjectTemplates, globalConfig: this.parseGlobalConfig(rawJson)};
    }

    private parseWorldItemDefinitions(rawJson: RawWorldMapJson): GameObjectTemplate[] {
        if (!rawJson.svg.metadata || !rawJson.svg.metadata['wg-type']) { return; }

        const worldItemDefinitions: GameObjectTemplate[] = [];

        if (rawJson.svg.metadata['wg-type'].length) {
            rawJson.svg.metadata['wg-type'].forEach(wgType => {
                worldItemDefinitions.push(this.parseWorldItemDefinition(wgType, worldItemDefinitions));
            })
        } else {
            worldItemDefinitions.push(this.parseWorldItemDefinition(<WgDefinition> <unknown> rawJson.svg.metadata['wg-type'], worldItemDefinitions));
        }

        return worldItemDefinitions;
    }

    parseWorldItemDefinition(wgType: WgDefinition, existingWorldItemDefinitions: GameObjectTemplate[]): GameObjectTemplate {
        const color = wgType._attributes["color"] as string;
        const model = wgType._attributes["model"];
        const shape = wgType._attributes["shape"];
        const scale = wgType._attributes["scale"] ? parseFloat(wgType._attributes["scale"]) : 1;
        const translateY = wgType._attributes["translate-y"] ? parseFloat(wgType._attributes["translate-y"]) : 0;
        const typeName = wgType._attributes["type-name"];
        const materials = wgType._attributes["materials"] ? wgType._attributes["materials"].split(" ") : [];
        const roles = wgType._attributes["roles"] ? wgType._attributes["roles"].split(" ").map(role => WorldItemRole.fromString(role)) : [];


        return {id: GameObjectTemplate.generateId(existingWorldItemDefinitions), color, roles, model, scale, translateY, typeName, materials, shape};
    }


    private parseGlobalConfig(rawJson: RawWorldMapJson): GlobalConfig {
        const scaleX = rawJson.svg._attributes["data-wg-scale-x"] ? parseInt(rawJson.svg._attributes["data-wg-scale-x"], 10) : 1.5;
        const scaleY = rawJson.svg._attributes["data-wg-scale-y"] ? parseInt(rawJson.svg._attributes["data-wg-scale-y"], 10) : 1.5;

        return {
            scale: new Point(scaleX, scaleY)
        }
    }
}