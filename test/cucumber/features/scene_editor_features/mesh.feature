Feature: Mesh

    Scenario: Change mesh scale on sidepanel
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


    Scenario: Change mesh rotation on sidepanel
        Given empty editor
        And views on canvas 'scene-editor':
            | Type       | Bounds          | Selected |
            | mesh-view  | 50:50,60:60     | true     |
        When hover over canvas 'scene-editor'
        And change param 'rotation' to '30' in panel 'object-settings-panel'
        Then obj properties are:
            | Id            | Type       | Rotation   |
            | mesh-obj-1    | mesh-obj   | 30         |

    Scenario: Change mesh position on sidepanel
        Given empty editor
        And views on canvas 'scene-editor':
            | Type       | Bounds          | Selected |
            | mesh-view  | 50:50,60:60     | true     |
        When hover over canvas 'scene-editor'
        Then obj properties are:
            | Id            | Type       | Pos        |
            | mesh-obj-1    | mesh-obj   | 5.5:0:-5.5 |
        When change param 'pos-x' to '10' in panel 'object-settings-panel'
        Then obj properties are:
            | Id            | Type       | Pos       |
            | mesh-obj-1    | mesh-obj   | 10:0:-5.5 |
        When change param 'pos-y' to '15' in panel 'object-settings-panel'
        Then obj properties are:
            | Id            | Type       | Pos        |
            | mesh-obj-1    | mesh-obj   | 10:15:-5.5 |
        When change param 'pos-z' to '0' in panel 'object-settings-panel'
        Then obj properties are:
            | Id            | Type       | Pos       |
            | mesh-obj-1    | mesh-obj   | 10:15:0   |

    Scenario: Change mesh model on sidepanel
        Given empty editor
        And views on canvas 'scene-editor':
            | Type       | Bounds          | Selected |
            | mesh-view  | 50:50,60:60     | true     |
        When hover over canvas 'scene-editor'
        And change param 'model' to 'model1.babylon' in panel 'object-settings-panel'
        Then obj properties are:
            | Id            | Type       | Model          |
            | mesh-obj-1    | mesh-obj   | model1.babylon |

    Scenario: Change mesh texture on sidepanel
        Given empty editor
        And views on canvas 'scene-editor':
            | Type       | Bounds          | Selected |
            | mesh-view  | 50:50,60:60     | true     |
        When hover over canvas 'scene-editor'
        And change param 'texture' to 'texture1.png' in panel 'object-settings-panel'
        Then obj properties are:
            | Id            | Type       | Texture      |
            | mesh-obj-1    | mesh-obj   | texture1.png |