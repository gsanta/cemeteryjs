
import { WorldMapLineListener, WorldMapReader } from "./reader/WorldMapReader";
import { Point } from "@nightshifts.inc/geometry";

const GLOBALS_SECTION_LINE_REGEX = /^(\S*)/;

export enum Globals {
    SCALE = 'scale'
}

export interface GlobalConfig {
    scale: Point;
}

function getDefaultGlobalConfig(): GlobalConfig {
    return {
        scale: new Point(1, 2)
    }
}

export class GlobalsSectionParser extends WorldMapLineListener {
    private globalConfig: GlobalConfig;

    parse(worldMap: string): GlobalConfig {
        this.globalConfig = getDefaultGlobalConfig();

        new WorldMapReader(this).read(worldMap);

        return this.globalConfig;
    }
    
    addGlobalsSectionLine(line: string) {
        const globalParamName = line.trim().match(GLOBALS_SECTION_LINE_REGEX)[0];

        switch(globalParamName) {
            case Globals.SCALE:
                this.parseScale(line);
                break;
        }
    }

    private parseScale(line: string) {
        const scaleRegex = /^(\S*)\s*(\d*)\s*(\d*)/;

        const scaleMatch = line.trim().match(scaleRegex);

        if (scaleMatch[3] === '') {
            this.globalConfig.scale = new Point(parseInt(scaleMatch[2], 10), parseInt(scaleMatch[2], 10));
        } else {
            this.globalConfig.scale = new Point(parseInt(scaleMatch[2], 10), parseInt(scaleMatch[3], 10));
        }
    }
}