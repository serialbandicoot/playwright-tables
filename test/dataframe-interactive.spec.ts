import { expect, test } from '@playwright/test';
import { TablePage } from './pages/tables-page';
import { GroupType, toHaveColumnGroupToBeValue, toHaveColumnGroupToBeValues } from 'html-table-to-dataframe';

test.describe('Table and Column Tests Interactive', () => {

    test('should enter new row of data', async ({ page }) => {
        await page.goto("/");

        const tablePage = new TablePage(page);

        await tablePage.table2.selectByKey(0, "Person", "Karen");
        await tablePage.table2.enterByKey(0, "Likes", "Going Loco");
        await tablePage.table2.enterByKey(0, "Age", 999);

        await expect(tablePage.table2Locator).toHaveColumnToBeValue("Age", "999")
        await expect(tablePage.table2Locator).toHaveColumnToBeValue("Likes", "Going Loco")
        await expect(tablePage.table2Locator).toHaveColumnToBeValue("Person", "Karen")
    });

    test('should click link', async ({ page }) => {
        await page.goto("/");

        const tablePage = new TablePage(page);
        const link = page.getByTestId('profile-link-1');

        let consoleMessage: string | null = null;

        // Listen for all console events BEFORE triggering anything
        page.on('console', msg => {
            consoleMessage = msg.text();
            console.log('Captured:', consoleMessage);
        });

        // Fire the click action
        await tablePage.table2.clickByKey(0, "Profile");
        await link.click();

        // Verify
        expect(consoleMessage).toContain("Profile link clicked for person 1!");
    });

});