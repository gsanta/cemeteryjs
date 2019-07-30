import { WorldItemInfo } from "../../WorldItemInfo";

export interface DefaultConverter<T> {
    (worldItemInfo: WorldItemInfo): T
}

export interface BorderConverter<T extends> {

}

export interface Converter<T> {
    convert(worldItemInfo: WorldItemInfo[], convertDefault): T[];
}