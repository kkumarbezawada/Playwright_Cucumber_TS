Feature: User Edit Tests

  Background:
    Given User navigates to the application

  Scenario: Add and Remove Role to the User
    And User enter the username as "willowtree88@canimmunize.ca"
    And User enter the password as "xR8!sG3@wP1$kLz"
    When User click on the continue button
    Then Login should be success for "willowtree88@canimmunize.ca"
    When User navigates to Users section
    And User selects "sampleuser@canimmunize.ca" from Users page
    And User verifies user information
    And User verifies roles information
    And User verifies organizations information
    When User clicks on add role button on User Info page
    And User adds "Call Centre Agent" role
    And User verifies user information
    When User removes "Call Centre Agent" role
    And User verifies user information
