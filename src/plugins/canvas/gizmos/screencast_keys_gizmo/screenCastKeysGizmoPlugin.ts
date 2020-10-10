import { corePlugins } from "../../../../core/plugin/corePlugins";
import { Plugins } from "../../../../core/plugin/Plugins";
import { ScreenCastKeysGizmoFactory } from "./ScreenCastKeysGizmoFactory";

export function register(plugins: Plugins) {
    plugins.canvas.registerGizmo(corePlugins.canvas.gizmos.ScreenCastKeysGimo, ScreenCastKeysGizmoFactory);
}