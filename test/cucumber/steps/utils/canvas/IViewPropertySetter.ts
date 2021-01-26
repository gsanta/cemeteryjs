import { AbstractShape } from "../../../../../src/core/models/shapes/AbstractShape";
import { ViewTableProp } from "../../common/viewTestUtils";

export interface IViewPropertySetter {
    setViewProperty(view: AbstractShape, prop: ViewTableProp, val: string);
}