import { ControllerFacade } from "../../../../src/editor/controllers/ControllerFacade";

export const initialSvg = 
`
<svg data-wg-pixel-size="10" data-wg-width="1500" data-wg-height="1000">
    <metadata>
        <wg-type color="#7B7982" is-border="true" scale="1" translate-y="0" type-name="wall" shape="rect"></wg-type>
        <wg-type color="#BFA85C" is-border="true" scale="3" translate-y="-4" type-name="door" materials="assets/models/door/door_material.png" model="assets/models/door/door.babylon"></wg-type>
        <wg-type is-border="false" scale="0.5" translate-y="0" type-name="table" color="#c5541b" materials="assets/models/table_material.png" model="assets/models/table.babylon"></wg-type>
        <wg-type color="#70C0CF" is-border="true" scale="3" translate-y="0" type-name="window" materials="assets/models/window.png" model="assets/models/table.babylon"></wg-type>
        <wg-type color="#9894eb" is-border="false" scale="3" translate-y="0" type-name="chair"></wg-type>
        <wg-type color="#8c7f6f" is-border="false" scale="3" translate-y="1" type-name="shelves"></wg-type>
        <wg-type color="#66553f" is-border="false" scale="3" translate-y="2" type-name="stairs"></wg-type>
        <wg-type is-border="false" scale="1" translate-y="0" type-name="outdoors"></wg-type>
        <wg-type is-border="false" scale="1" translate-y="0" type-name="room"></wg-type>
        <wg-type is-border="false" scale="1" translate-y="0" type-name="player"></wg-type>
        <wg-type is-border="false" scale="1" translate-y="0" type-name="building" shape="polygon"></wg-type>
        <wg-type is-border="false" scale="1" translate-y="0" type-name="model" shape="polygon"></wg-type>
    </metadata>
    <rect width="100px" height="50px" x="50px" y="30px" fill="#7B7982" data-wg-x="50" data-wg-y="30" data-wg-width="100" data-wg-height="50" data-wg-type="building"></rect>
</svg>
`;


export function setupControllers(worldMap?: string): ControllerFacade {
    const controllers = new ControllerFacade();

    worldMap = worldMap ? worldMap : initialSvg;

    controllers.webglCanvasController.unregisterEvents();

    controllers.svgCanvasController.writer.write(worldMap);

    return controllers;
}