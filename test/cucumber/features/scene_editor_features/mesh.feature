Feature: Mesh

    Scenario: Change mesh scale on sidepanel
        Given empty editor
        And views on canvas 'scene-editor':
            | Type       | Bounds          | Selected |
            | mesh-view  | 50:50,60:60     | true     |
        When hover over canvas 'scene-editor'
        And change param to '2' in controller 'scaleX' of panel 'object-settings-panel'
        Then obj properties are:
            | Id            | Type       | Scale   |
            | mesh-obj-1    | mesh-obj   | 2:1:1   |
        When change param to '2' in controller 'scaleY' of panel 'object-settings-panel'
        Then obj properties are:
            | Id            | Type       | Scale   |
            | mesh-obj-1    | mesh-obj   | 2:2:1   |
        When change param to '2' in controller 'scaleZ' of panel 'object-settings-panel'
        Then obj properties are:
            | Id            | Type       | Scale   |
            | mesh-obj-1    | mesh-obj   | 2:2:2   |


    Scenario: Change mesh rotation on sidepanel
        Given empty editor
        And views on canvas 'scene-editor':
            | Type       | Bounds          | Selected |
            | mesh-view  | 50:50,60:60     | true     |
        When hover over canvas 'scene-editor'
        And change param to '30' in controller 'rotateY' of panel 'object-settings-panel'
        Then obj properties are:
            | Id            | Type       | Rotation   |
            | mesh-obj-1    | mesh-obj   | 0:30:0     |

    Scenario: Change mesh position on sidepanel
        Given empty editor
        And views on canvas 'scene-editor':
            | Type       | Bounds          | Selected |
            | mesh-view  | 50:50,60:60     | true     |
        When hover over canvas 'scene-editor'
        Then obj properties are:
            | Id            | Type       | Pos        |
            | mesh-obj-1    | mesh-obj   | 5.5:0:-5.5 |
        When change param to '10' in controller 'posX' of panel 'object-settings-panel'
        Then obj properties are:
            | Id            | Type       | Pos       |
            | mesh-obj-1    | mesh-obj   | 10:0:-5.5 |
        When change param to '15' in controller 'posY' of panel 'object-settings-panel'
        Then obj properties are:
            | Id            | Type       | Pos        |
            | mesh-obj-1    | mesh-obj   | 10:15:-5.5 |
        When change param to '0' in controller 'posZ' of panel 'object-settings-panel'
        Then obj properties are:
            | Id            | Type       | Pos       |
            | mesh-obj-1    | mesh-obj   | 10:15:0   |

    Scenario: Change mesh model on sidepanel
        Given empty editor
        And views on canvas 'scene-editor':
            | Type       | Bounds          | Selected |
            | mesh-view  | 50:50,60:60     | true     |
        When hover over canvas 'scene-editor'
        And change param to 'model1.babylon' in controller 'model' of panel 'object-settings-panel'
        Then obj properties are:
            | Id            | Type       | Model          |
            | mesh-obj-1    | mesh-obj   | model1.babylon |

    Scenario: Change mesh texture on sidepanel
        Given empty editor
        And views on canvas 'scene-editor':
            | Type       | Bounds          | Selected |
            | mesh-view  | 50:50,60:60     | true     |
        When hover over canvas 'scene-editor'
        And change param to 'texture1.png' in controller 'texture' of panel 'object-settings-panel'
        Then obj properties are:
            | Id            | Type       | Texture      |
            | mesh-obj-1    | mesh-obj   | texture1.png |

    Scenario: Clone mesh on sidepanel
        Given empty editor
        And views on canvas 'scene-editor':
            | Type       | Bounds          | Selected |
            | mesh-view  | 50:50,60:60     | true     |
        When hover over canvas 'scene-editor'
        And click button 'clone' in panel 'object-settings-panel'
        Then canvas contains:
            | Id          | Type      | Bounds      |
            | mesh-view-1 | mesh-view | 50:50,60:60 |
            | mesh-view-2 | mesh-view | 55:55,65:65 |
        Then dump objs:
            | mesh-obj-1 | mesh-obj | 5.5:0:-5.5 |
            | mesh-obj-2 | mesh-obj | 6:0:-6     |