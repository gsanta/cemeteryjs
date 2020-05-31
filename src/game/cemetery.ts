import { Registry } from "../core/Registry";
import { GameRegistry } from "./GameRegistry";


export function initCemetery(registry: Registry): GameRegistry {

    return new GameRegistry(registry);
}