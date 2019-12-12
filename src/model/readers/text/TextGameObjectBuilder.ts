import { WorldItem } from "../../..";
import { CombinedWorldItemBuilder } from "../builders/CombinedWorldItemBuilder";
import { FurnitureBuilder } from "../builders/FurnitureBuilder";
import { BorderBuilder } from "../builders/BorderBuilder";
import { RoomBuilder } from "../builders/RoomBuilder";
import { RootWorldItemBuilder } from "../builders/RootWorldItemBuilder";
import { SubareaBuilder } from "../builders/SubareaBuilder";
import { WorldGeneratorServices } from '../../services/WorldGeneratorServices';
import { IWorldMapReader } from "../IWorldMapReader";
import { IInputConverter } from "../IInputConverter";
import { PolygonBuilder } from "../builders/polygon/PolygonBuilder";
import { IGameObjectBuilder } from '../IGameObjectBuilder';


export class TextGameObjectBuilder implements IGameObjectBuilder {
    private services: WorldGeneratorServices;
    private worldMapReader: IWorldMapReader;
    private roomInputConverter: IInputConverter;
    private subareaInputConverter: IInputConverter;

    constructor(
        services: WorldGeneratorServices,
        worldMapReader: IWorldMapReader,
        roomInputConverter: IInputConverter,
        subareaInputConverter: IInputConverter
    ) {
        this.services = services;
        this.worldMapReader = worldMapReader;
        this.roomInputConverter = roomInputConverter;
        this.subareaInputConverter = subareaInputConverter;
    }
    
    build(worldMap: string): WorldItem[] {
        const builder = new CombinedWorldItemBuilder(
            [
                new FurnitureBuilder(this.services, this.worldMapReader),
                new BorderBuilder(this.services, this.worldMapReader),
                new RoomBuilder(this.services, this.worldMapReader, this.roomInputConverter),
                new RootWorldItemBuilder(this.services, this.worldMapReader),
                new SubareaBuilder(this.services, this.worldMapReader, this.subareaInputConverter),
                new PolygonBuilder(this.services, this.worldMapReader)
            ]
        );

        return builder.build(worldMap);
    }
}