import { WorldMapLineListener, WorldMapReader } from "./reader/WorldMapReader";
import { Point } from "@nightshifts.inc/geometry";
import { MeshDescriptor } from '../../Config';

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

export class DefinitionSectionParser extends WorldMapLineListener {
    private typeToCharMap: Map<string, string>;
    private meshDescriptors: MeshDescriptor[] = [];

    parse(worldMap: string): MeshDescriptor[] {
        this.typeToCharMap = new Map();

        new WorldMapReader(this).read(worldMap);

        return this.meshDescriptors;
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

        this.meshDescriptors.push({
            char,
            type,
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
}