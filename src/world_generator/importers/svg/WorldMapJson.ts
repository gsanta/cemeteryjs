
export interface WgDefinition {
    _attributes: WgDefinitionAttributes;
}

export interface WgDefinitionAttributes {
    color: string;
    "roles": string;
    "materials": string;
    model: string;
    scale: string;
    "translate-y": string;
    "type-name": string;
}

export interface ToolGroupJson<T = any> {
    _attributes: {
        "data-tool-type": string
    }
}

export interface RawWorldMapJson {
    svg: {
        metadata: {
            "wg-type": WgDefinition[]
        };

        _attributes: {
            "data-wg-width": string;
            "data-wg-height": string;
            "data-wg-pixel-size": string;
            "data-wg-scale-x": string;
            "data-wg-scale-y": string;
        };

        g: ToolGroupJson[];
    }
}

// rect: {
//     _attributes: {
//         "data-wg-x": string,
//         "data-wg-y": string,
//         "data-wg-type": string,
//         "data-wg-name": string
//     }
// }[];

export interface Rect {
    x: number;
    y: number;
    width: number;
    height: number;
    type: string;
    shape: string;
    color: string;
    model: string;
    rotation: number;
    scale: number;
    name: string;
}

export interface TypeMetaData {
    color: string;
    materials: string[];
    model: string;
    scale: number;
    translateY: number;
    typeName: string;
}

export interface MetaData {
    metadata?: {
        wgType: TypeMetaData[];
    }
}

export interface ProcessedWorldMapJson {
    pixelSize: number;
    width: number;
    height: number;
    rects: Rect[];
}