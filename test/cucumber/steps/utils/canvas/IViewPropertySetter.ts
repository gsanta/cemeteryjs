import { AbstractShape } from "../../../../../src/core/models/views/AbstractShape";
import { ViewTableProp } from "../../common/viewTestUtils";

export interface IViewPropertySetter {
    setViewProperty(view: AbstractShape, prop: ViewTableProp, val: string);
}