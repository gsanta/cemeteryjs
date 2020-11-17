Feature: Light

    Scenario: Adding light to canvas
        Given empty editor
        When hover over canvas 'scene-editor'
        And select tool 'light-tool'
        And mouse click at '500:500'
        Then canvas contains:
            | Id             | Type       | Obj         |
            | light-view-1   | light-view | light-obj-1 |
        And change param 'light-pos-y' to '8' in panel 'object-settings-panel'
        Then obj properties are:
            | Id            | Type       | PosY |
            | light-obj-1   | light-obj  | 8    |

    Scenario: Selecting ligth(s) on canvas
        Given empty editor
        And views on canvas 'scene-editor':
            | Type       | Bounds      |
            | light-view | 50:50,60:60     |
            | light-view | 500:500,510:510 |
        When hover over canvas 'scene-editor'
        And select tool 'select-tool'
        And mouse click on 'light-view-1'
        Then canvas selection contains:
            | Id           |
            | light-view-1 |
        When mouse click on 'light-view-2'
        Then canvas selection contains:
            | Id           |
            | light-view-2 |
        When mouse drags from '40:40' to '500:500'
        Then canvas selection contains:
            | Id           |
            | light-view-1 |
        When mouse drags from '40:40' to '600:600'
        Then canvas selection contains:
            | Id           |
            | light-view-1 |
            | light-view-2 |

    Scenario: Deleting ligth(s) on canvas
        Given empty editor
        And views on canvas 'scene-editor':
            | Type       | Bounds          |
            | light-view | 50:50,60:60     |
            | light-view | 200:200,210:210 |
            | light-view | 300:300,310:310 |
            | light-view | 500:500,510:510 |
        When hover over canvas 'scene-editor'
        And select tool 'delete-tool'
        And mouse click on 'light-view-1'
        Then canvas contains:
            | Id           |
            | light-view-2 |
            | light-view-3 |
            | light-view-4 |
        When mouse drags from '40:40' to '300:300'
        Then canvas contains:
            | Id           |
            | light-view-3 |
            | light-view-4 |
        When mouse drags from '300:300' to '600:600'
        Then canvas is empty

    Scenario: Changing light direction on sidepanel
        Given empty editor
        And views on canvas 'scene-editor':
            | Type       | Bounds          | Selected |
            | light-view | 50:50,60:60     | true     |
        When hover over canvas 'scene-editor'
        And change param 'light-dir-x' to '1' in panel 'object-settings-panel'
        Then obj properties are:
            | Id            | Type       | DirX | DirY | DirZ |
            | light-obj-1   | light-obj  | 1    | -1   | 0    |
        When change param 'light-dir-y' to '-2' in panel 'object-settings-panel'
        Then obj properties are:
            | Id            | Type       | DirX | DirY | DirZ |
            | light-obj-1   | light-obj  | 1    | -2   | 0    |

    Scenario: Changing light's diffuse color on sidepanel
        Given empty editor
        And views on canvas 'scene-editor':
            | Type       | Bounds          | Selected |
            | light-view | 50:50,60:60     | true     |
        And change param 'light-color-diffuse' to '#FF0000' in panel 'object-settings-panel'
        Then obj properties are:
            | Id            | Type       | DiffuseColor |
            | light-obj-1   | light-obj  | #FF0000      |

    Scenario: Changing light(s) position with tool
        Given empty editor
        And views on canvas 'scene-editor':
            | Type       | Bounds              |
            | light-view | 50:50,60:60         |
            | light-view | 500:500,510:510     |
        When hover over canvas 'scene-editor'
        And select tool 'select-tool'
        And mouse click at '55:55'
        And mouse drags from '55:55' to '200:200'
        Then canvas contains some of:
            | Id           | Bounds          | Selected |
            | light-view-1 | 195:195,205:205 | true     |
        When mouse click at '100:100'
        And mouse drags from '100:100' to '600:600'
                Then canvas selection contains:
            | Id           |
            | light-view-1 |
            | light-view-2 |
        And mouse drags from '200:200' to '220:220'
        Then canvas contains:
            | Id           | Bounds          |
            | light-view-1 | 215:215,225:225 |
            | light-view-2 | 520:520,530:530 |

    Scenario: Export lights
        Given empty editor
        And views on canvas 'scene-editor':
            | Type       | Bounds              |
            | light-view | 50:50,60:60         |
            | light-view | 500:500,510:510     |
        Then json is:
        """
        {
            "objs": {
                "general": [
                    {
                        "id": "light-obj-1",
                        "objType": "light-obj",
                        "position": {
                            "x": 5.5,
                            "y": 5,
                            "z": -5.5
                        },
                        "direction": {
                            "x": 0,
                            "y": -1,
                            "z": 0
                        },
                        "diffuseColor": "#FFFFFF"
                    },
                    {
                        "id": "light-obj-2",
                        "objType": "light-obj",
                        "position": {
                            "x": 50.5,
                            "y": 5,
                            "z": -50.5
                        },
                        "direction": {
                            "x": 0,
                            "y": -1,
                            "z": 0
                        },
                        "diffuseColor": "#FFFFFF"
                    }
                ],
                "assets": []
            },
            "canvas": {
                "node-editor-panel": [],
                "scene-editor": [
                    {
                        "id": "light-view-1",
                        "type": "light-view",
                        "dimensions": "50:50,60:60",
                        "objId": "light-obj-1"
                    },
                    {
                        "id": "light-view-2",
                        "type": "light-view",
                        "dimensions": "500:500,510:510",
                        "objId": "light-obj-2"
                    }
                ]
            }
        }
        """

    Scenario: Import lights
        Given empty editor
        When import json:
        """
        {
            "objs": {
                "general": [
                    {
                        "id": "light-obj-1",
                        "objType": "light-obj",
                        "position": {
                            "x": 5.5,
                            "y": 5,
                            "z": -5.5
                        },
                        "direction": {
                            "x": 0,
                            "y": -1,
                            "z": 0
                        },
                        "diffuseColor": "#FF0000"
                    },
                    {
                        "id": "light-obj-2",
                        "objType": "light-obj",
                        "position": {
                            "x": 50.5,
                            "y": 5,
                            "z": -50.5
                        },
                        "direction": {
                            "x": 1,
                            "y": -1,
                            "z": 0.5
                        },
                        "diffuseColor": "#FFFFFF"
                    }
                ],
                "assets": []
            },
            "canvas": {
                "node-editor-panel": [],
                "scene-editor": [
                    {
                        "id": "light-view-1",
                        "type": "light-view",
                        "dimensions": "50:50,60:60",
                        "objId": "light-obj-1"
                    },
                    {
                        "id": "light-view-2",
                        "type": "light-view",
                        "dimensions": "500:500,510:510",
                        "objId": "light-obj-2"
                    }
                ]
            }
        }
        """
        And hover over canvas 'scene-editor'
        Then canvas contains:
            | Id             | Type       | Obj         | Bounds          |
            | light-view-1   | light-view | light-obj-1 | 50:50,60:60     |
            | light-view-2   | light-view | light-obj-2 | 500:500,510:510 |
        Then obj properties are:
            | Id            | Type       | DiffuseColor | Dir      | Pos           |
            | light-obj-1   | light-obj  | #FF0000      | 0:-1:0   | 5.5:5:-10.5   |
            | light-obj-2   | light-obj  | #FFFFFF      | 1:-1:0.5 | 50.5:5:-55.5  |

    Scenario: Changing light's parent on sidepanel
        Given empty editor
        And views on canvas 'scene-editor':
            | Type       | Bounds          | Selected |
            | light-view | 50:50,60:60     | true     |
            | mesh-view  | 20:20,30:30     | false    |
        And change param 'light-parent-mesh' to 'mesh-obj-1' in panel 'object-settings-panel'
        Then obj properties are:
            | Id            | Type       | Parent     |
            | light-obj-1   | light-obj  | mesh-obj-1 |
