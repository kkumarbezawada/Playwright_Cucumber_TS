Feature: User Verification Tests

  Background:
    Given User navigates to the application

  Scenario: Verify user details on Users page
    And User enter the username as "willowtree88@canimmunize.ca"
    And User enter the password as "xR8!sG3@wP1$kLz"
    When User click on the continue button
    Then Login should be success for "willowtree88@canimmunize.ca"
    When User navigates to Users section
    Then User verifies details for "willowtree88@canimmunize.ca"