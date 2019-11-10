import { ConfigReader } from '../ConfigReader';
import * as convert from 'xml-js';
import { WorldItemType } from '../../../WorldItemType';
import { GlobalConfig } from '../text/GlobalSectionParser';
import { RawWorldMapJson, MetaData, TypeMetaData } from './WorldMapJson';

export class SvgConfigReader implements ConfigReader {
    read(worldMap: string): {worldItemTypes: WorldItemType[], globalConfig: GlobalConfig} {
        const rawJson: RawWorldMapJson = JSON.parse(convert.xml2json(worldMap, {compact: true, spaces: 4}));

        const worldItemTypes = this.processRawJson(rawJson);

        return {worldItemTypes, globalConfig: null};
    }

    private processRawJson(rawJson: RawWorldMapJson): WorldItemType[] {
        const worldItemTypes: WorldItemType[] = [];

        rawJson.svg.metadata['wg-type'].forEach(wgType => {
            const color = wgType._attributes["color"] as string;
            const isBorder = wgType._attributes["is-border"] ? true : false;
            const model = wgType._attributes["model"];
            const scale = wgType._attributes["scale"] ? parseInt(wgType._attributes["scale"], 10) : 1;
            const translateY = wgType._attributes["translate-y"] ? parseInt(wgType._attributes["translate-y"], 10) : 0;
            const typeName = wgType._attributes["type-name"];
            const materials = wgType._attributes["materials"] ? wgType._attributes["materials"].split(", ") : []; 


            worldItemTypes.push(
                {color, isBorder, model, scale, translateY, typeName, materials}
            )
        });

        return worldItemTypes;
    }
}