import styled from "styled-components";
import { Canvas } from "./Canvas";
import * as React from 'react'
import SplitPane from 'react-split-pane';
import { Toolbar } from "./Toolbar";
import { PropertyPanel } from "./PropertyPanel";

const AppStyled = styled.div`
    width: calc(100% - 300px);
    height: 100%;

    .Resizer {
        background: #000;
        opacity: .2;
        z-index: 1;
        -moz-box-sizing: border-box;
        -webkit-box-sizing: border-box;
        box-sizing: border-box;
        -moz-background-clip: padding;
        -webkit-background-clip: padding;
        background-clip: padding-box;
    }

     .Resizer:hover {
        -webkit-transition: all 2s ease;
        transition: all 2s ease;
    }

     .Resizer.horizontal {
        height: 11px;
        margin: -5px 0;
        border-top: 5px solid rgba(255, 255, 255, 0);
        border-bottom: 5px solid rgba(255, 255, 255, 0);
        cursor: row-resize;
        width: 100%;
    }

    .Resizer.horizontal:hover {
        border-top: 5px solid rgba(0, 0, 0, 0.5);
        border-bottom: 5px solid rgba(0, 0, 0, 0.5);
    }

    .Resizer.vertical {
        width: 11px;
        margin: 0 -5px;
        border-left: 5px solid rgba(255, 255, 255, 0);
        border-right: 5px solid rgba(255, 255, 255, 0);
        cursor: col-resize;
    }

    .Resizer.vertical:hover {
        border-left: 5px solid rgba(0, 0, 0, 0.5);
        border-right: 5px solid rgba(0, 0, 0, 0.5);
    }
    .Resizer.disabled {
      cursor: not-allowed;
    }
    .Resizer.disabled:hover {
      border-color: transparent;
    }
`;

export const App = () => {
    return (
        <AppStyled>
             <SplitPane split="vertical" minSize={50} maxSize={50}>
                <Toolbar/>

                <SplitPane split="vertical" defaultSize={200} minSize={200} maxSize={500} primary="second">
                    <Canvas/>
                    <PropertyPanel/>
                </SplitPane>
            </SplitPane>
        </AppStyled>
    );
}