
export interface WgType {
    _attributes: {
        color: string;
        "is-border": string;
        "materials": string;
        model: string;
        scale: string;
        "translate-y": string;
        "type-name": string;
            
    }
}

export interface RawWorldMapJson {
    svg: {
        metadata: {
            "wg-type": WgType[]
        };

        _attributes: {
            "data-wg-width": string;
            "data-wg-height": string;
            "data-wg-pixel-size": string;
            "data-wg-scale-x": string;
            "data-wg-scale-y": string;
        };

        rect: {
            _attributes: {
                "data-wg-x": string,
                "data-wg-y": string,
                "data-wg-type": string
            }
        }[];
    }
}

export interface Rect {
    x: number;
    y: number;
    type: string;
}

export interface TypeMetaData {
    color: string;
    isBorder: boolean;
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