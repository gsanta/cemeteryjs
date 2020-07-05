import { UI_Layout, UI_Container, UI_ElementType, UI_Element, UI_TextField, UI_Row } from "./UI_Element";
import { RowGui, TextFieldGui } from './UI_ReactElements';
import * as React from 'react';
import { InputComponent } from "../gui/inputs/InputComponent";
import { TextFileAssetTask } from "babylonjs";

export class UI_Builder {

    build(layout: UI_Layout): JSX.Element {
        return this.buildContainer(layout);
        // layout

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

    private buildContainer(container: UI_Container): JSX.Element {
        const children = container.children.map(child => {
            if ((child as UI_Container).children !== undefined) {
                return this.buildContainer(child as UI_Container);
            } else {
                return this.buildLeaf(child);
            }
        });

        switch(container.type) {
            case UI_ElementType.Layout:
                return <div>{children}</div>;
            case UI_ElementType.Row:
                const row = container as UI_Row;
                return <RowGui element={row}>{children}</RowGui>;
        }
    }

    private buildLeaf(element: UI_Element): JSX.Element {
        switch(element.type) {
            case UI_ElementType.TextField:
                const textField = element as UI_TextField;
                return <TextFieldGui element={textField}/>;
        }
    }
}   