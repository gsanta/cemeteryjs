import { WorldItem } from "../../..";
import { CombinedWorldItemBuilder } from "../../builders/CombinedWorldItemBuilder";
import { FurnitureBuilder } from "../../builders/FurnitureBuilder";
import { BorderBuilder } from "../../builders/BorderBuilder";
import { RoomBuilder } from "../../builders/RoomBuilder";
import { RootWorldItemBuilder } from "../../builders/RootWorldItemBuilder";
import { SubareaBuilder } from "../../builders/SubareaBuilder";
import { ServiceFacade } from '../../services/ServiceFacade';
import { WorldMapReader } from "../WorldMapReader";
import { InputConverter } from "../InputConverter";
import { PolygonBuilder } from "../../builders/polygon/PolygonBuilder";
import { IWorldItemBuilder } from '../../io/IWorldItemBuilder';


export class TextWorldItemBuilder implements IWorldItemBuilder {
    private services: ServiceFacade;
    private worldMapReader: WorldMapReader;
    private roomInputConverter: InputConverter;
    private subareaInputConverter: InputConverter;

    constructor(
        services: ServiceFacade,
        worldMapReader: WorldMapReader,
        roomInputConverter: InputConverter,
        subareaInputConverter: InputConverter
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

        return builder.parse(worldMap);
    }
}