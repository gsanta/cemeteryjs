import { Shape } from "@nightshifts.inc/geometry";

  declare global {
    namespace jest {
      interface Matchers<R> {
        toHaveBorders(borderDimensions: Shape[]),
        toHaveAnyWithDimensions(dimensions: Shape)
      }
    }
  }

export {}; // this file needs to be a module
// declare module "jest" {
//     interface Matchers<R> {
//         toBeWithinRange(a: number, b: number): R;
//     }
// }