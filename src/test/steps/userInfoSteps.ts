import { Given, When, Then, setDefaultTimeout } from "@cucumber/cucumber";
import { expect } from "@playwright/test";
import { fixture } from "../../hooks/pageFixture";
import * as userDetails from "../../helper/util/test-data/userOnUserInfoPage.json";
import * as newUser from "../../helper/util/test-data/addUser.json";

setDefaultTimeout(60 * 1000 * 2)

const currFirstName = userDetails.UserInfo["First Name"];
const currLastName = userDetails.UserInfo["Last Name"];
const currEmail = userDetails.UserInfo["Email"];
var newFirstName;
var newLastName;
var newEmail;

var roles, roleTable, roleTableCols, roleRows, roleCount, roleKeys;

When('User selects {string} from Users page', async function (email) {
    await selectUser(fixture, email);
});

When('User verifies user information', async function () {
    const userInfo = fixture.page.locator("[class=ant-descriptions-view]:below(:text('User Info'))");
    fixture.logger.info(await userInfo.textContent());
    await expect(userInfo).toBeVisible();
    await verifyUserInfo(userDetails, userInfo);
});

When('User verifies roles information', async function () {
    await verifyRoles(userDetails);
});

When('User verifies organizations information', async function () {
    await verifyOrgs(userDetails);
});

When('User verifies new user information', async function () {
    const userInfo = fixture.page.locator("[class=ant-descriptions-view]:below(:text('User Info'))");
    fixture.logger.info(await userInfo.textContent());
    await expect(userInfo).toBeVisible();
    await verifyUserInfo(newUser, userInfo);
});

When('User verifies new roles information', async function () {
    await verifyRoles(newUser);
});

When('User verifies new organizations information', async function () {
    await verifyOrgs(newUser);
});

When('User clicks edit button on User Info page', async function () {
    await fixture.page.getByTestId('edit').click();
});

When('User enter the firstname as {string}, lastname as {string}, lastname as {string}', async function (firstname, lastname, email) {
    newFirstName = firstname;
    newLastName = lastname;
    newEmail = email;
    
    await editAndVerifyUser(userDetails, newFirstName, newLastName, newEmail, fixture, currFirstName, currLastName);
});

When('User reverts the user details', async function () {    
    await editAndVerifyUser(userDetails, currFirstName, currLastName, currEmail, fixture, newFirstName, newLastName);
});

When('User clicks on add role button on User Info page', async function () {
    await fixture.page.getByRole('button', { name: 'Add Role' }).click();
});

When('User adds {string} role', async function (role) {    
    await addRole(userDetails, fixture, 'Call Centre Agent');
});

When('User removes {string} role', async function (role) {    
    await removeRole(userDetails, fixture, 'Call Centre Agent');
});

async function selectUser(fixture, email) {
    const table = fixture.page.locator('.ant-table-content > div');
    const rows = table.locator("tbody tr")
    const user = rows.filter({
      has: fixture.page.locator("td"),
      hasText: email
    });  
    await user.click();
}

async function verifyUserInfo(userDetails: { UserInfo: { "First Name": string; "Last Name": string; Email: string; "Email Status": string; UserId: string; "Account Status": string; "Last Login": string; }; Roles: { Role: string; Description: string; }[]; Organizations: { Name: string; "Organization Code": string; }[]; }, userInfo) {
    const userInfoTable = userInfo.locator("table");
    const userInfoRows = userInfoTable.locator("tr");
    
    for (let i = 0; i < await userInfoRows.count(); i++) {
        const userInfoCols = userInfoRows.nth(i).locator("th");
        const userInfoCells = userInfoRows.nth(i).locator("td");
        for (let j = 0; j < await userInfoCols.count(); j++) {
            if (userDetails.UserInfo[await userInfoCols.nth(j).textContent()] != "") {
                expect(await userInfoCells.nth(j).textContent()).toEqual(userDetails.UserInfo[await userInfoCols.nth(j).textContent()]);   
            }
        }
    }
}
  
async function verifyRoles(userDetails: { UserInfo: { "First Name": string; "Last Name": string; Email: string; "Email Status": string; UserId: string; "Account Status": string; "Last Login": string; }; Roles: { Role: string; Description: string; }[]; Organizations: { Name: string; "Organization Code": string; }[]; }) {
    roles = fixture.page.locator("[class=ant-table]:near(:text('Roles'))");
    roleTable = roles.locator("table");
    roleTableCols = roles.locator("thead th");
    roleRows = roleTable.locator("tbody tr");
    roleCount = userDetails.Roles.length;
    roleKeys = Object.keys(userDetails.Roles[0]);

    for (let i = 0; i < roleCount; i++) {
      expect(await roleTableCols.nth(i).textContent()).toEqual(roleKeys[i]);
      const roleAttribute = await roleRows.nth(i).locator("td");
      for (let j = 0; j < roleKeys.length; j++) {
        expect(await roleAttribute.nth(j).textContent()).toEqual(userDetails.Roles[i][roleKeys[j]]);
      }
    }
}
  
async function verifyOrgs(userDetails: { UserInfo: { "First Name": string; "Last Name": string; Email: string; "Email Status": string; UserId: string; "Account Status": string; "Last Login": string; }; Roles: { Role: string; Description: string; }[]; Organizations: { Name: string; "Organization Code": string; }[]; }) {
    const orgs = fixture.page.locator("[class=ant-table]:near(:text('Organizations'))");
    const orgTable = orgs.locator("table");
    const orgTableCols = orgs.locator("thead th");
    const orgRows = orgTable.locator("tbody tr");
    const orgsCount = userDetails.Organizations.length;
    const orgKeys = Object.keys(userDetails.Organizations[0]);

    for (let i = 0; i < orgsCount; i++) {
      expect(await orgTableCols.nth(i).textContent()).toEqual(orgKeys[i]);
      const orgAttribute = orgRows.nth(i).locator("td");
      for (let j = 0; j < orgKeys.length; j++) {
        expect(await orgAttribute.nth(j).textContent()).toEqual(userDetails.Organizations[i][orgKeys[j]]);
      }
    }
}
  
async function editAndVerifyUser(userDetails: { UserInfo: { "First Name": string; "Last Name": string; Email: string; "Email Status": string; UserId: string; "Account Status": string; "Last Login": string; }; Roles: { Role: string; Description: string; }[]; Organizations: { Name: string; "Organization Code": string; }[]; }, firstname: string, lastname: string, email: string, fixture, currFirstName: string, currLastName: string) {
    userDetails.UserInfo["First Name"] = firstname;
    userDetails.UserInfo["Last Name"] = lastname;
    userDetails.UserInfo["Email"] = email;
    console.log(userDetails.UserInfo);
  
    await fixture.page.getByLabel('First Name *').fill(userDetails.UserInfo["First Name"]);
    await fixture.page.getByLabel('Last Name *').fill(userDetails.UserInfo["Last Name"]);
    await fixture.page.getByLabel('Email *').fill(userDetails.UserInfo["Email"]);

    await fixture.page.getByLabel(currFirstName + ' ' + currLastName).getByLabel('Save').click();

    const userName = firstname + ' ' + lastname;
    await expect(fixture.page.getByRole('heading', { name: userName })).toBeVisible();
}

async function addRole(userDetails: { UserInfo: { "First Name": string; "Last Name": string; Email: string; "Email Status": string; UserId: string; "Account Status": string; "Last Login": string; }; Roles: { Role: string; Description: string; }[]; Organizations: { Name: string; "Organization Code": string; }[]; }, fixture, role) {
    const roleModal = fixture.page.locator("[class=ant-modal-content]").filter({
      has: fixture.page.locator("td"),
      hasText: 'Add to User'
    });
  
    const roleModalTable = await roleModal.locator("table");
    await expect(roleModalTable).toBeVisible();
    const roleModalTableCols = roleModalTable.locator("thead tr th");
    console.log(await roleModalTableCols.count())
    const roleModalTableRows = roleModalTable.locator("tbody tr");
    console.log(await roleModalTableRows.count())
    
    for (let i = 0; i < await roleModalTableRows.count(); i++) {
      const roleModalTableRow = roleModalTableRows.nth(i).locator("td");
      if (await roleModalTableRow.nth(0).textContent() == role) {
        await roleModalTableRow.nth(2).click();
      }
    }
  
    await expect(fixture.page.getByText('Role Call Centre Agent successfully added to user (Sample User).')).toBeVisible();
    await fixture.page.getByRole('button', { name: 'Done' }).click();
    userDetails.Roles.push(
      {
        Role: "Call Centre Agent",
        Description: "Call Centre agent able to book and manage patient appointments"
      }
    )

    const userName = userDetails.UserInfo["First Name"] + ' ' + userDetails.UserInfo["Last Name"];
    await expect(fixture.page.getByRole('heading', { name: userName })).toBeVisible();
    await fixture.page.pause();
}
  
async function removeRole(userDetails: { UserInfo: { "First Name": string; "Last Name": string; Email: string; "Email Status": string; UserId: string; "Account Status": string; "Last Login": string; }; Roles: { Role: string; Description: string; }[]; Organizations: { Name: string; "Organization Code": string; }[]; }, fixture, role) {
    await fixture.page.getByRole('row', { name: role }).getByLabel('Remove').click();
    await fixture.page.getByRole('button', { name: 'Yes' }).click();
    userDetails.Roles.pop();
    await expect(fixture.page.getByText('Organization admin user was successfully removed from the organization.')).toBeVisible();
}