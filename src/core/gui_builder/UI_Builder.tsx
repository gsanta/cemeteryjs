import { UI_Layout, UI_Container, UI_ElementType, UI_Element } from "./UI_Element";
import * as React from 'react';

export class UI_Builder {

    build(layout: UI_Layout) {
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
                return <div>{children}</div>
            case UI_ElementType.Row:
                
        }
    }

    private buildLeaf(element: UI_Element) {

    }
}   