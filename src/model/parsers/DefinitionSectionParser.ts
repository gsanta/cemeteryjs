import { WorldMapLineListener, WorldMapReader } from "./reader/WorldMapReader";
import { Point } from "@nightshifts.inc/geometry";
import { MeshDescriptor } from '../../Config';

const TYPE_TEST = /^([^=]*)=\s*([^\s]*)/;
const DIMENSIONS_TEST = /DIM\s+(?<num1>\d+(\.\d+)?)(\s+(?<num2>\d+(\.\d+)?))?/;
const MATERIAL_TEST = /\s+MAT\s+(?:\[(?<singleMat>[^\s]+)\]|\[(?<multiMat>[^\]]+)\])/;
const MODEL_TEST = /\s+MOD\s+([^\s]+)/;
const SHAPE_TEST = /\s+SHAPE\s+([^\s]+)/;
const SCALE_TEST = /\s+SCALE\s+(\d+(?:\.\d+)?)/
const TRANSLATE_Y_TEST = /\s+TRANS_Y\s+(\d+(?:\.\d+)?)/;

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
        const materials = this.parseMaterials(line);
        const modelPath = this.parseModel(line);
        const shape = this.parseShape(line);
        const scale = this.parseScale(line);
        const translateY = this.parseTranslateY(line);

        this.meshDescriptors.push({
            char,
            type,
            model: modelPath,
            materials,
            shape,
            scale,
            translateY,
            realDimensions: {
                width: dimensions.x,
                height: dimensions.y
            }
        })

        this.typeToCharMap.set(typeMatch[2], typeMatch[1]);
    }

    private parseDimensions(line: string): Point {

        const dimensionsMatch = line.match(DIMENSIONS_TEST);

        let dimensions = new Point(1, 1);

        if (dimensionsMatch) {
            const x = dimensionsMatch.groups.num1 ? this.parseNum(dimensionsMatch.groups.num1) : 1;
            const y = dimensionsMatch.groups.num2 ? this.parseNum(dimensionsMatch.groups.num2) : x;
            dimensions = new Point(x, y);
        }

        return dimensions;
    }

    private parseMaterials(line: string): string[] {
        const materialMatch = line.match(MATERIAL_TEST);

        let materials: string[] = [];

        if (materialMatch) {
            if (materialMatch.groups.singleMat) {
                materials = [materialMatch.groups.singleMat];
            } else {
                materials = materialMatch.groups.multiMat.trim().split(' ').filter(mat => mat !== ' ');
            }
        }

        return materials;
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

        return 1;
    }

    private parseNum(num: string) {
        try {
            return parseFloat(num);
        } catch(e) {
            `${num} is not a number.`
        }
    }
}