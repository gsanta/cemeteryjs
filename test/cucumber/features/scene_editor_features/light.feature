Feature: Light

    Scenario: Light can be added to canvas

        Given empty editor
        When hover over canvas 'scene-editor'
        And select tool 'light-tool'
        And mouse click at '500:500'
        Then canvas contains:
            | Id             | Type       | Obj         |
            | light-view-1   | light-view | light-obj-1 |
        And change param 'light-y-pos' to '8' in panel 'object-settings-panel'
        Then obj properties are:
            | Id            | Type       | PosY |
            | light-obj-1   | light-obj  | 8    |


    Scenario: Light settings can be changed

        Given empty editor
        And views on canvas 'scene-editor':
            | Type       | Dimensions  |
            | light-view | 50:50,60:60 |
        Then dump views