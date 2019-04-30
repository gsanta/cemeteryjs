import { GwmWorldItem } from '../model/GwmWorldItem';


export interface GwmWorldItemTransformator {
    transform(gwmWorldItems: GwmWorldItem[]): GwmWorldItem[];
}