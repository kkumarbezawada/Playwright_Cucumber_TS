import { Given, When, Then, setDefaultTimeout } from "@cucumber/cucumber";
import { expect } from "@playwright/test";
import { fixture } from "../../hooks/pageFixture";
import * as user from "../../helper/util/test-data/userOnUsersPage.json";
import * as newUser from "../../helper/util/test-data/addUser.json";

setDefaultTimeout(60 * 1000 * 2)

When('User navigates to Users section', async function () {
    await fixture.page.getByRole('menuitem', { name: 'Users' }).click();
    await fixture.page.getByRole('link', { name: 'Users' }).click();
    fixture.logger.info("Navigated to the Users page")
});

Then('User verifies details for {string}', async function (email) {
    const table = fixture.page.locator('.ant-table-content > div');
    const consolidateHeaders = table.locator("thead");
    const actHeaders = consolidateHeaders.locator("tr th");
    const rows = table.locator("tbody tr")

    for (let i = 0; i < user.length; i++) {
      if (user[i].Email == email) {
        var userDetails = user[i];
        fixture.logger.info("User details: " + userDetails)
      }
    }
    await verifyUser(actHeaders, rows, fixture, userDetails);
    fixture.logger.info("User details verified on the Users page")
});

When('User clicks on new User button', async function () {
  await fixture.page.getByTestId('new-user').click();
});

When('User enters new user details', async function () {
  await fixture.page.getByLabel('First Name *').click();
  await fixture.page.getByLabel('First Name *').fill(newUser.UserInfo['First Name']);
  await fixture.page.getByLabel('Last Name *').fill(newUser.UserInfo['Last Name']);
  await fixture.page.getByLabel('Email *').fill(newUser.UserInfo.Email);
  await fixture.page.locator('#rc_select_5').click();
  await fixture.page.locator('#rc_select_5').fill(newUser.Roles[0].Role);
  await fixture.page.getByTitle(newUser.Roles[0].Role, { exact: true }).locator('div').click();
  await fixture.page.locator('#rc_select_5').click();
  await fixture.page.locator('#rc_select_5').fill(newUser.Roles[1].Role);
  await fixture.page.getByTitle(newUser.Roles[1].Role, { exact: true }).locator('div').click();
  await fixture.page.locator('#rc_select_6').click();
  await fixture.page.getByText(newUser.Organizations[0].Name + ' - ' + newUser.Organizations[0].Name).click();
  await fixture.page.locator('#rc_select_6').click();
  await fixture.page.getByText(newUser.Organizations[1].Name + ' - ' + newUser.Organizations[1].Name).click();
  await fixture.page.getByText('Server Generated Password').click();
  await fixture.page.getByText('Server Generated Password').nth(1).click();
});

When('User clicks on save button', async function () {
  await fixture.page.getByLabel('Save').click();
  await expect(fixture.page.getByText('User successfully created')).toBeVisible();
  await expect(fixture.page.getByRole('button', { name: 'OK' })).toBeVisible();
  const pwd = fixture.page.getByLabel('User successfully created').locator('path').nth(3);
  fixture.logger.info(await pwd.textContent());
  await fixture.page.getByRole('button', { name: 'OK' }).click();
  const userName = newUser.UserInfo['First Name'] + ' ' + newUser.UserInfo['Last Name'];
  await expect(fixture.page.getByRole('heading', { name: userName })).toBeVisible();
});

async function verifyUser(actHeaders, rows, fixture, userDetails) {
    const user = rows.filter({
      has: fixture.page.locator("td"),
      hasText: userDetails["First Name"]
    });
  
    await expect(user).toBeVisible();
    
    const expUserKeys = Object.keys(userDetails);
    const userAttribute = await user.locator("td");
    for (let i = 0; i < expUserKeys.length; i++) {
      expect(await actHeaders.nth(i).textContent()).toEqual(expUserKeys[i]);
      
      if (userDetails[expUserKeys[i]] instanceof Object) {
        expect(await userAttribute.nth(i).textContent()).toEqual(userDetails[expUserKeys[i]].join(''));
      } else {
        expect(await userAttribute.nth(i).textContent()).toEqual(userDetails[expUserKeys[i]]);
      }
    }
  }