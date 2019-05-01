import { GwmWorldItem } from '../GwmWorldItem';


export interface GwmWorldItemTransformator {
    transform(gwmWorldItems: GwmWorldItem[]): GwmWorldItem[];
}