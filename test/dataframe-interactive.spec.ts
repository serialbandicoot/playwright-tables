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

        const group: GroupType[] = [
            { filterColumn: "Person", filterValue: "Karen" },
            { filterColumn: "Likes", filterValue:  "Going Loco"},
          ];
        await expect(tablePage.table2Locator).toHaveColumnToBeValue("Age", "999")
        await expect(tablePage.table2Locator).toHaveColumnToBeValue("Likes", "Going Loco")
        await expect(tablePage.table2Locator).toHaveColumnToBeValue("Person", "Karen")
    });   

});