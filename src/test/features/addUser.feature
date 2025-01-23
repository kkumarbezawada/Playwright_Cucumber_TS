Feature: Add User Tests

  Background:
    Given User navigates to the application

  Scenario: Add User
    And User enter the username as "willowtree88@canimmunize.ca"
    And User enter the password as "xR8!sG3@wP1$kLz"
    When User click on the continue button
    Then Login should be success for "willowtree88@canimmunize.ca"
    When User navigates to Users section
    When User clicks on new User button
    And User enters new user details
    And User clicks on save button
    And User verifies new user information
    And User verifies new roles information
    And User verifies new organizations information
