import { View } from "../../../../../src/core/models/views/View";
import { ViewTableProp } from "../../common/viewTestUtils";

export interface IViewPropertySetter {
    setViewProperty(view: View, prop: ViewTableProp, val: string);
}