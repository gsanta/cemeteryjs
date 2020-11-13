import { Registry } from "../../../src/core/Registry";

declare module "cucumber" {

    interface World {
        registry: Registry;
    }
}