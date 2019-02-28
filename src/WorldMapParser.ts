import { WorldMapToMatrixGraphConverter } from './matrix_graph/conversion/WorldMapToMatrixGraphConverter';
import { FurnitureInfoGenerator } from './parsing/furniture_parsing/FurnitureInfoGenerator';
import { WorldItem } from './model/WorldItem';
import _ = require('lodash');
import { WorldItemGenerator } from './parsing/WorldItemGenerator';
import { CombinedWorldItemGenerator } from './parsing/CombinedWorldItemGenerator';
import { AdditionalDataConverter, AdditionalDataConvertingWorldItemDecorator } from './parsing/decorators/AdditionalDataConvertingWorldItemDecorator';
import { ScalingWorldItemGeneratorDecorator } from './parsing/ScalingWorldItemGeneratorDecorator';

export interface ParseOptions<T> {
    xScale: number;
    yScale: number;
    additionalDataConverter: AdditionalDataConverter<T>;
}

export const defaultParseConfig: ParseOptions<any> = {
    xScale: 1,
    yScale: 1,
    additionalDataConverter: _.identity,
}

export class WorldMapParser {
    private worldItemGenerator: WorldItemGenerator;

    private constructor(worldItemGenerator: WorldItemGenerator =
            new AdditionalDataConvertingWorldItemDecorator(
                new ScalingWorldItemGeneratorDecorator(
                    new CombinedWorldItemGenerator()
                )
            )
        ) {
        this.worldItemGenerator = worldItemGenerator;
    }

    public parse(worldMap: string): WorldItem[] {
        return this.worldItemGenerator.generateFromStringMap(worldMap);
    }

    public static createWithOptions<T>(options: ParseOptions<T> = defaultParseConfig): WorldMapParser {
        return new WorldMapParser(
            new AdditionalDataConvertingWorldItemDecorator<T>(
                new ScalingWorldItemGeneratorDecorator(
                    new CombinedWorldItemGenerator(),
                    { x: options.xScale, y: options.yScale }
                ),
                options.additionalDataConverter
            )
        )
    }

    public static createWithCustomWorldItemGenerator(worldItemGenerator: WorldItemGenerator): WorldMapParser {
        return new WorldMapParser(worldItemGenerator);
    }
}
