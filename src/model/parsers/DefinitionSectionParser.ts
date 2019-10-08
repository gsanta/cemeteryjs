import { WorldMapLineListener, WorldMapReader } from "./reader/WorldMapReader";
import { Point } from "@nightshifts.inc/geometry";
import { MeshDescriptor } from '../../Config';

const TYPE_TEST = /^([^=]*)=\s*([^\s]*)/;
const DIMENSIONS_TEST = /DIM\s+(?<num1>\d+(\.\d+)?)(\s+(?<num2>\d+(\.\d+)?))?/;

export class DefinitionSectionParser extends WorldMapLineListener {
    private typeToCharMap: Map<string, string>;
    private meshDescriptors: Partial<MeshDescriptor<any>>[] = [];

    parse(worldMap: string): Partial<MeshDescriptor<any>>[] {
        this.typeToCharMap = new Map();

        new WorldMapReader(this).read(worldMap);

        return this.meshDescriptors;
    }

    public addDefinitionSectionLine(line: string) {
        const typeMatch = line.match(TYPE_TEST);
        const char = typeMatch[1].trim();
        const type = typeMatch[2].trim();
        const dimensions = this.parseDimensions(line);

        this.meshDescriptors.push({
            char,
            type,
            realDimensions: {
                name: 'furniture-dimensions-descriptor' as 'furniture-dimensions-descriptor',
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

    private parseNum(num: string) {
        try {
            return parseFloat(num);
        } catch(e) {
            `${num} is not a number.`
        }
    }
}