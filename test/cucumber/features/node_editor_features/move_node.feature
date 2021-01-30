
Feature: Move node

    Scenario: Move mesh with keys
        Given empty editor
        And views on canvas 'scene-editor':
            | Type       | Bounds          |
            | mesh-view  | 50:50,60:60     |
        When change canvas to 'node-editor' 
        When hover over canvas 'node-editor'
        And drop node 'keyboard-node-obj' at '100:100'
        And drop node 'move-node-obj' at '400:100'
        And mouse drags from view 'node-view-1.key1' to view 'node-view-2.input'
        And change param to 'w' in controller 'key1' of view 'node-view-1'
        And change param to 'mesh-obj-1' in controller 'mesh' of view 'node-view-2'
        And change param to '1' in controller 'speed' of view 'node-view-2'
        Then obj properties are:
            | Id          | Pos           |
            | mesh-obj-1  | 5.5:0:-5.5    |
        When hover over canvas 'game-viewer'
        And press key 'w' on canvas 'game-viewer'
        Then obj properties are:
            | Id          | Pos           |
            | mesh-obj-1  | 5.5:0:-4.5    |
        When hover over canvas 'node-editor'
        And change param to 'backward' in controller 'move' of view 'node-view-2'
        And hover over canvas 'game-viewer'
        And press key 'w' on canvas 'game-viewer'
        And press key 'w' on canvas 'game-viewer'
        Then obj properties are:
            | Id          | Pos           |
            | mesh-obj-1  | 5.5:0:-6.5    |
        
