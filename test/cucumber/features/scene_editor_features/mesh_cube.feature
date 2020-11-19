Feature: Mesh Cube

    Scenario: 1. Add cube to the canvas with click
        Given empty editor
        When hover over canvas 'scene-editor'
        And select tool 'cube-tool'
        And mouse click at '500:500'
        Then dump views:
            | Id | Bounds |
        Then canvas contains:
            | Id          | Type      | Obj        | Bounds          |
            | mesh-view-1 | mesh-view | mesh-obj-1 | 450:450,550:550 |

    Scenario: 2. Add cube to the canvas with drag
        Given empty editor
        When hover over canvas 'scene-editor'
        And select tool 'cube-tool'
        And mouse drags from '500:500' to '520:520'
        Then canvas contains:
            | Id          | Type      | Obj        | Bounds          |
            | mesh-view-1 | mesh-view | mesh-obj-1 | 500:500,520:520 |