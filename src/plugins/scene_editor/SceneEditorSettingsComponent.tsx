import * as React from 'react';
import { AccordionComponent } from "../../core/gui/misc/AccordionComponent";
import { ViewSettingsComponent } from "./settings/ViewSettingsComponent";
import { SceneEditorPlugin } from "./SceneEditorPlugin";
import { LevelSettingsComponent } from "./settings/LevelSettingsComponent";

export class SceneEditorSettingsComponent extends React.Component<{plugin: SceneEditorPlugin}> {

    render() {

        return (
            <AccordionComponent
                elements={
                    [
                        {
                            title: 'Level Settings',
                            body: <LevelSettingsComponent plugin={this.props.plugin}/>
                        },
                        {
                            title: 'Object Settings',
                            body: <ViewSettingsComponent plugin={this.props.plugin}/>
                        }
                    ]
                }
            />
        );
    }
}