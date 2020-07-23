import { UI_Element } from "./UI_Element";
import { UI_ElementType } from "./UI_ElementType";
import { UI_Layout } from "./UI_Layout";
import { UI_Container } from "./UI_Container";

export class UI_Accordion extends UI_Container {
    elementType = UI_ElementType.Accordion;
    
    children: UI_Element[] = [];
}

export class UI_AccordionTab extends UI_Layout {
    elementType = UI_ElementType.AccordionTab;

    title: string;
}