import { setupControllers } from "../controllerTestUtils";
import { FileFormat } from "../../../../src/WorldGenerator";


it ('Can create an svg file of the current editor content', () => {
    const controllers = setupControllers(FileFormat.TEXT);

});