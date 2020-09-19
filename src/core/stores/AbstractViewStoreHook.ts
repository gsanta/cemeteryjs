import { View } from "../models/views/View";

export abstract class AbstractViewStoreHook {
    addViewHook(view: View) {}
    removeViewHook(view: View) {}
}