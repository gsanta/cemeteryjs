Feature: Mesh

    Scenario: 1. Change mesh scale on sidepanel
        Given empty editor
        And views on canvas 'scene-editor':
            | Type       | Bounds          | Selected |
            | mesh-view  | 50:50,60:60     | true     |
        When hover over canvas 'scene-editor'
        And change param 'scale-x' to '2' in panel 'object-settings-panel'
        Then obj properties are:
            | Id            | Type       | Scale   |
            | mesh-obj-1    | mesh-obj   | 2:1:1   |
        When change param 'scale-y' to '2' in panel 'object-settings-panel'
        Then obj properties are:
            | Id            | Type       | Scale   |
            | mesh-obj-1    | mesh-obj   | 2:2:1   |
        When change param 'scale-z' to '2' in panel 'object-settings-panel'
        Then obj properties are:
            | Id            | Type       | Scale   |
            | mesh-obj-1    | mesh-obj   | 2:2:2   |


    Scenario: 2. Change mesh rotation on sidepanel
        Given empty editor
        And views on canvas 'scene-editor':
            | Type       | Bounds          | Selected |
            | mesh-view  | 50:50,60:60     | true     |
        When hover over canvas 'scene-editor'
        And change param 'rotation' to '30' in panel 'object-settings-panel'
        Then obj properties are:
            | Id            | Type       | Rotation   |
            | mesh-obj-1    | mesh-obj   | 30         |

    Scenario: 4. Change mesh model on sidepanel
        Given empty editor
        And views on canvas 'scene-editor':
            | Type       | Bounds          | Selected |
            | mesh-view  | 50:50,60:60     | true     |
        When hover over canvas 'scene-editor'
        And change param 'model' to 'model1.babylon' in panel 'object-settings-panel'
        Then obj properties are:
            | Id            | Type       | Model          |
            | mesh-obj-1    | mesh-obj   | model1.babylon |

    Scenario: 5. Change mesh texture on sidepanel
        Given empty editor
        And views on canvas 'scene-editor':
            | Type       | Bounds          | Selected |
            | mesh-view  | 50:50,60:60     | true     |
        When hover over canvas 'scene-editor'
        And change param 'texture' to 'texture1.png' in panel 'object-settings-panel'
        Then obj properties are:
            | Id            | Type       | Texture      |
            | mesh-obj-1    | mesh-obj   | texture1.png |