import { GwmWorldItem } from './model/GwmWorldItem';
import _ = require('lodash');
import { GwmWorldItemGenerator } from './parsing/GwmWorldItemGenerator';
import { CombinedWorldItemGenerator } from './parsing/decorators/CombinedWorldItemGenerator';
import { AdditionalDataConverter, AdditionalDataConvertingWorldItemDecorator } from './parsing/decorators/AdditionalDataConvertingWorldItemDecorator';
import { ScalingWorldItemGeneratorDecorator } from './parsing/decorators/ScalingWorldItemGeneratorDecorator';

export interface ParseOptions<T> {
    xScale: number;
    yScale: number;
    additionalDataConverter: AdditionalDataConverter<T>;
}

export const defaultParseOptions: ParseOptions<any> = {
    xScale: 1,
    yScale: 1,
    additionalDataConverter: _.identity,
}

/**
 * Generates a list of `GwmWorldItem` objects, which describe your world, based on a `gwm (game world map)` format
 * string.
 */
export class GwmWorldMapParser {
    private worldItemGenerator: GwmWorldItemGenerator;

    private constructor(worldItemGenerator: GwmWorldItemGenerator =
            new AdditionalDataConvertingWorldItemDecorator(
                new ScalingWorldItemGeneratorDecorator(
                    new CombinedWorldItemGenerator()
                )
            )
        ) {
        this.worldItemGenerator = worldItemGenerator;
    }

    public parse(worldMap: string): GwmWorldItem[] {
        return this.worldItemGenerator.generateFromStringMap(worldMap);
    }

    public static createWithOptions<T>(options: ParseOptions<T> = defaultParseOptions): GwmWorldMapParser {
        return new GwmWorldMapParser(
            new AdditionalDataConvertingWorldItemDecorator<T>(
                new ScalingWorldItemGeneratorDecorator(
                    new CombinedWorldItemGenerator(),
                    { x: options.xScale, y: options.yScale }
                ),
                options.additionalDataConverter
            )
        )
    }

    public static createWithCustomWorldItemGenerator(worldItemGenerator: GwmWorldItemGenerator): GwmWorldMapParser {
        return new GwmWorldMapParser(worldItemGenerator);
    }
}
