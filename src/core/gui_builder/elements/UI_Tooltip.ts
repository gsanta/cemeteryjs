import { UI_InputElement } from "./UI_InputElement";
import { UI_ElementType } from "./UI_ElementType";
import { AbstractController } from '../../../plugins/scene_editor/settings/AbstractController';
import { UI_Element } from './UI_Element';

export class UI_Tooltip extends UI_InputElement {
    elementType = UI_ElementType.Tooltip;

    label: string;
    shortcut: string;
}