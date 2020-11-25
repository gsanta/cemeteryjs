Feature: Mesh

    Scenario: Change mesh scale on sidepanel
        Given empty editor
        And views on canvas 'scene-editor':
            | Type       | Bounds          | Selected |
            | mesh-view  | 50:50,60:60     | true     |
        When hover over canvas 'scene-editor'
        And change param 'scale' to '2' in panel 'object-settings-panel'
        Then obj properties are:
            | Id            | Type       | Scale   |
            | mesh-obj-1    | mesh-obj   | 2:2     |