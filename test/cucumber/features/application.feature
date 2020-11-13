Feature: Application

    Scenario: The first test scenario

        Given empty editor
        When hover over canvas 'scene-editor'
        When select tool 'light-tool'
        When mouse click at '500:500'
        Then canvas contains:
            | Id        | Type       |
            | light-view1   | light-view |