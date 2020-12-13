Feature: RayCasting

    Scenario: Cast ray
        Given empty editor
        And views on canvas 'node-editor':
            | Type       | NodeType            | Pos      | 
            | node-view  | ray-caster-node-obj | 100:100  |
        When hover over canvas 'node-editor'
        Then canvas contains:
            | Id          | Bounds            |
            | node-view-1 | 100:100,300:260   |
