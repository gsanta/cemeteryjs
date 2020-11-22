
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
        And change param 'key1' to 'w' in view 'node-view-1'
        And change param 'mesh' to 'mesh-view-1' in view 'node-view-2'
        Then node params for 'keyboard-node-obj-1' are:
            | key1 |
            | w    |
        Then node params for 'move-node-obj-1' are:
            | mesh           |
            | mesh-view-1    |
