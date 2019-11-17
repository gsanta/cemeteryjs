import * as convert from 'xml-js';
import { WorldItemDefinition } from '../../../WorldItemDefinition';
import { ConfigReader } from '../ConfigReader';
import { GlobalConfig } from '../text/GlobalSectionParser';
import { RawWorldMapJson, WgDefinition } from './WorldMapJson';
import { Point } from '@nightshifts.inc/geometry';

export class SvgConfigReader implements ConfigReader {
    read(worldMap: string): {worldItemTypes: WorldItemDefinition[], globalConfig: GlobalConfig} {
        const rawJson: RawWorldMapJson = JSON.parse(convert.xml2json(worldMap, {compact: true, spaces: 4}));

        const worldItemTypes = this.parseWorldItemDefinitions(rawJson);

        return {worldItemTypes, globalConfig: this.parseGlobalConfig(rawJson)};
    }

    private parseWorldItemDefinitions(rawJson: RawWorldMapJson): WorldItemDefinition[] {
        if (!rawJson.svg.metadata || !rawJson.svg.metadata['wg-type']) { return; }

        if (rawJson.svg.metadata['wg-type'].length) {
            return rawJson.svg.metadata['wg-type'].map(wgType => this.parseWorldItemDefinition(wgType));
        } else {
            return [this.parseWorldItemDefinition(<WgDefinition> <unknown> rawJson.svg.metadata['wg-type'])];
        }
    }

    parseWorldItemDefinition(wgType: WgDefinition): WorldItemDefinition {
        const color = wgType._attributes["color"] as string;
        const isBorder = wgType._attributes["is-border"] === "true" ? true : false;
        const model = wgType._attributes["model"];
        const shape = wgType._attributes["shape"];
        const scale = wgType._attributes["scale"] ? parseInt(wgType._attributes["scale"], 10) : 1;
        const translateY = wgType._attributes["translate-y"] ? parseInt(wgType._attributes["translate-y"], 10) : 0;
        const typeName = wgType._attributes["type-name"];
        const materials = wgType._attributes["materials"] ? wgType._attributes["materials"].split(", ") : []; 


        return {color, isBorder, model, scale, translateY, typeName, materials, shape};
    }


    private parseGlobalConfig(rawJson: RawWorldMapJson): GlobalConfig {
        const scaleX = rawJson.svg._attributes["data-wg-scale-x"] ? parseInt(rawJson.svg._attributes["data-wg-scale-x"], 10) : 1;
        const scaleY = rawJson.svg._attributes["data-wg-scale-y"] ? parseInt(rawJson.svg._attributes["data-wg-scale-y"], 10) : 1;

        return {
            scale: new Point(scaleX, scaleY)
        }
    }
}