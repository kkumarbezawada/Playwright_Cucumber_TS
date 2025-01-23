Feature: User Authentication tests

  Background:
    Given User navigates to the application

  Scenario: Login should be success
    And User enter the username as "willowtree88@canimmunize.ca"
    And User enter the password as "xR8!sG3@wP1$kLz"
    When User click on the continue button
    Then Login should be success for "willowtree88@canimmunize.ca"

  Scenario: Login should not be success
    Given User enter the username as "test@canimmunize.ca"
    Given User enter the password as "test"
    When User click on the continue button
    Then Login should fail