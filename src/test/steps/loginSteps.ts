import { Given, When, Then, setDefaultTimeout } from "@cucumber/cucumber";

import { expect } from "@playwright/test";
import { fixture } from "../../hooks/pageFixture";

setDefaultTimeout(60 * 1000 * 2)

Given('User navigates to the application', async function () {
    await fixture.page.goto(process.env.BASEURL);
    fixture.logger.info("Navigated to the application")
})

Given('User enter the username as {string}', async function (username) {
    await fixture.page.getByLabel('Email address').type(username);
});

Given('User enter the password as {string}', async function (password) {
    await fixture.page.getByLabel('Password').type(password);
})

When('User click on the continue button', async function () {
    await fixture.page.getByRole('button', { name: 'Continue' }).click();
    await fixture.page.waitForLoadState();
});

Then('Login should be success for {string}', async function (username) {
    const userProf = fixture.page.locator('.ant-dropdown-trigger > span').filter({ hasText: username });
    await expect(userProf).toBeVisible();
    console.log("Username: " + username);
    fixture.logger.info("Username: " + username);
})

When('Login should fail', async function () {
    const failureMesssage = fixture.page.getByText('Wrong email or password');
    await expect(failureMesssage).toBeVisible();
});
