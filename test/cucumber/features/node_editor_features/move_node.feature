
Feature: Move node

    Scenario: Move mesh with keys
        Given empty editor
        And views on canvas 'scene-editor':
            | Type       | Bounds          |
            | mesh-view  | 50:50,60:60     |
        When hover over canvas 'node-editor'
        And drop node 'keyboard-node-obj' at '100:100'
        And drop node 'move-node-obj' at '400:100'
        And mouse drags from view 'node-view-1.key1' to view 'node-view-2.input'
        And dump views:
            | Id | Type | Bounds |
        