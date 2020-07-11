import { UI_Element } from './elements/UI_Element';
import { RowGui, TextFieldGui } from './UI_ReactElements';
import * as React from 'react';
import { InputComponent } from "../gui/inputs/InputComponent";
import { TextFileAssetTask } from "babylonjs";
import { Registry } from '../Registry';
import { UI_Region } from '../UI_Plugin';
import { ButtonComp } from '../gui/inputs/ButtonComp';
import { UI_AccordionTab } from './elements/UI_Accordion';
import { AccordionTabComp } from '../gui/surfaces/AccordionTabComp';
import { UI_FileUpload } from './elements/UI_FileUpload';
import { FileUploadComp } from '../gui/inputs/FileUploadComp';
import { UI_Row } from './elements/UI_Row';
import { UI_Button } from './elements/UI_Button';
import { UI_ElementType } from './elements/UI_ElementType';
import { UI_TextField } from './elements/UI_TextField';
import { UI_Container } from './elements/UI_Container';

export class UI_Builder {

    private registry: Registry;

    constructor(registry: Registry) {
        this.registry = registry;
    }

    build(region: UI_Region): JSX.Element | JSX.Element[] {
        const plugins = this.registry.services.plugin.findPluginsAtRegion(region);

        return plugins
            .map(plugin => plugin.render())
            .map(layout => this.buildContainer(layout));
    }

    // private buildRecuresively(container: UI_Container): JSX.Element {
    //     switch(container.type) {
    //         case UI_ElementType.Layout:
    //             const children = container.children.map(child => {
    //                 if ((child as UI_Container).children !== undefined) {

    //                 }
    //             }

    //             // return <div>${this.buildRecuresively()}</div>
    //     }

    // }

    private buildContainer(element: UI_Container): JSX.Element {
        const children = element.children.map(child => {
            if ((child as UI_Container).children !== undefined) {
                return this.buildContainer(child as UI_Container);
            } else {
                return this.buildLeaf(child);
            }
        });

        switch(element.type) {
            case UI_ElementType.Layout:
                return <div>{children}</div>;
            case UI_ElementType.Row:
                const row = element as UI_Row;
                return <RowGui element={row}>{children}</RowGui>;
            case UI_ElementType.AccordionTab:
                const accordionTab = element as UI_AccordionTab;
                return <AccordionTabComp element={accordionTab}>{children}</AccordionTabComp>;
        }
    }

    private buildLeaf(element: UI_Element): JSX.Element {
        switch(element.type) {
            case UI_ElementType.TextField:
                const textField = element as UI_TextField;
                return <TextFieldGui element={textField}/>;
            case UI_ElementType.Button:
                const button = element as UI_Button;
                return <ButtonComp element={button}/>;
            case UI_ElementType.FileUpload:
                const fileUpload = element as UI_FileUpload;
                return <FileUploadComp element={fileUpload}/>;
        }
    }
}   