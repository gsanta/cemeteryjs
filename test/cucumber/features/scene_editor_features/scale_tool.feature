Feature: Scale tool

    Scenario: 1. Change mesh scale with scale tool
        Given empty editor
        And views on canvas 'scene-editor':
            | Type       | Bounds          | Selected |
            | mesh-view  | 50:50,60:60     | true     |
        When hover over canvas 'scene-editor'
        # And mouse move to view 'mesh-view-1.scale-axis-view-x'
        # Then active tool is 'scale-axis-tool'
        Then dump contained views of 'mesh-view-1':
            | Id | Bounds|
        # Then contained views of 'mesh-view-1' partially are:
        #     | Id                | Type            |
        #     | scale-axis-view-x | scale-axis-view |
        #     | scale-axis-view-y | scale-axis-view |
        #     | scale-axis-view-z | scale-axis-view |
        # When mouse drags from view 'mesh-view-1.scale-axis-view.x'