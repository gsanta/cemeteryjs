
Feature: Light

    Scenario: Move mesh with keys
        Given empty editor
        And views on canvas 'scene-editor':
            | Type       | Bounds          |
            | mesh-view  | 50:50,60:60     |
        When hover over canvas 'node-editor'
        