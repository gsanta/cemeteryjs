import { WorldMapLineListener, TextWorldMapParser } from "./TextWorldMapParser";
import { Point } from "@nightshifts.inc/geometry";
import { WorldItemType } from '../../../WorldItemType';
import { ConfigReader } from '../ConfigReader';

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


const COLOR_MAP = {
    T: '#BF973B',
    H: '#90602C',
    E: '#5E7ABA',
    O: '#9AC581',
    D: '#D47373',
    I: '#8FBED1',
    W: '#A1A1A1'
}

const DEFAULT_COLOR = '#B0BF3B';


const TYPE_TEST = /^\s*([^\s]*)\s+=\s*([^\s]*)/;
const DIMENSIONS_TEST = /DIM\s+(?<num1>\d+(\.\d+)?)(\s+(?<num2>\d+(\.\d+)?))?/;
const MATERIAL_TEST = /\s+MAT\s+(?:\[(?<singleMat>[^\s]+)\]|\[(?<multiMat>[^\]]+)\])/;
const MODEL_TEST = /\s+MOD\s+([^\s]+)/;
const SHAPE_TEST = /\s+SHAPE\s+([^\s]+)/;
const SCALE_TEST = /\s+SCALE\s+(\d+(?:\.\d+)?)/
const TRANSLATE_Y_TEST = /\s+TRANS_Y\s+(-?\d+(?:\.\d+)?)/;
const BORDER_TEST = /\s*BORDER\s*/;

export class TextConfigReader extends WorldMapLineListener implements ConfigReader {
    private typeToCharMap: Map<string, string>;
    private worldItemTypes: WorldItemType[] = [];
    private globalConfig: GlobalConfig;

    read(worldMap: string): {worldItemTypes: WorldItemType[], globalConfig: GlobalConfig} {
        this.typeToCharMap = new Map();
        this.globalConfig = getDefaultGlobalConfig();

        new TextWorldMapParser(this).read(worldMap);

        return {worldItemTypes: this.worldItemTypes, globalConfig: this.globalConfig};
    }

    public addDefinitionSectionLine(line: string) {
        const typeMatch = line.match(TYPE_TEST);
        const char = typeMatch[1].trim();
        const type = typeMatch[2].trim();
        const dimensions = this.parseDimensions(line);
        const materials = this.parseMaterials(line) || this.getDefaultMaterial(char);
        const modelPath = this.parseModel(line);
        const shape = this.parseShape(line) || 'rect';
        const scale = this.parseScale(line);
        const translateY = this.parseTranslateY(line) || 0;
        const isBorder = this.parseBorder(line);
        this.worldItemTypes.push({
            char,
            typeName: type,
            model: modelPath,
            materials,
            shape,
            scale,
            translateY,
            isBorder,
            realDimensions: dimensions ? {
                width: dimensions.x,
                height: dimensions.y
            } : undefined
        })

        this.typeToCharMap.set(typeMatch[2], typeMatch[1]);
    }

    private parseDimensions(line: string): Point {

        const dimensionsMatch = line.match(DIMENSIONS_TEST);


        if (dimensionsMatch) {
            const x = dimensionsMatch.groups.num1 ? this.parseNum(dimensionsMatch.groups.num1) : 1;
            const y = dimensionsMatch.groups.num2 ? this.parseNum(dimensionsMatch.groups.num2) : x;
            return new Point(x, y);
        }
    }

    private parseMaterials(line: string): string[] {
        const materialMatch = line.match(MATERIAL_TEST);

        if (materialMatch) {
            if (materialMatch.groups.singleMat) {
                return [materialMatch.groups.singleMat];
            } else {
                return materialMatch.groups.multiMat.trim().split(' ').filter(mat => mat !== ' ');
            }
        }
    }

    private getDefaultMaterial(char: string): string[] {
        return COLOR_MAP[char] ? [COLOR_MAP[char]] : [DEFAULT_COLOR];
    }

    private parseModel(line: string): string {
        const modelMatch = line.match(MODEL_TEST);

        if (modelMatch) {
            return modelMatch[1];
        }
    }

    private parseShape(line: string): string {
        const shapeMatch = line.match(SHAPE_TEST);

        if (shapeMatch) {
            return shapeMatch[1];
        }
    }

    private parseScale(line: string): number {
        const scaleMatch = line.match(SCALE_TEST);

        if (scaleMatch) {
            return parseFloat(scaleMatch[1]);
        }

        return 1;
    }

    private parseTranslateY(line: string): number {
        const translateYMatch = line.match(TRANSLATE_Y_TEST);

        if (translateYMatch) {
            return parseFloat(translateYMatch[1]);
        }
    }

    private parseBorder(line: string): boolean {
        const borderMatch = line.match(BORDER_TEST);

        if (borderMatch) {
            return true;
        }

        return false;
    }

    private parseNum(num: string) {
        try {
            return parseFloat(num);
        } catch(e) {
            `${num} is not a number.`
        }
    }

    addGlobalsSectionLine(line: string) {
        const globalParamName = line.trim().match(GLOBALS_SECTION_LINE_REGEX)[0];

        switch(globalParamName) {
            case Globals.SCALE:
                this.parseGlobalScale(line);
                break;
        }
    }

    private parseGlobalScale(line: string) {
        const scaleRegex = /^(\S*)\s*(\d*)\s*(\d*)/;

        const scaleMatch = line.trim().match(scaleRegex);

        if (scaleMatch[3] === '') {
            this.globalConfig.scale = new Point(parseInt(scaleMatch[2], 10), parseInt(scaleMatch[2], 10));
        } else {
            this.globalConfig.scale = new Point(parseInt(scaleMatch[2], 10), parseInt(scaleMatch[3], 10));
        }
    }
}