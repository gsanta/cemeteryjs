Feature: Application

    Scenario: The first test scenario

        Given empty editor
        When hover over canvas 'scene-editor'
        When select tool 'light-tool'
        Then test is successful