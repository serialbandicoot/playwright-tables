import { expect, test } from '@playwright/test';
import { TablePage } from './pages/tables-page';
import { toDataFrame } from 'html-table-to-dataframe';

test.describe('Table and Column Tests Interactive', () => {

    test('should enter new row of data', async ({ page }) => {
        await page.goto("/"); 

        const tablePage = new TablePage(page);
        // Background
        await expect(tablePage.table3.tableLocator).toHaveColumnToBeValue("Age", "31");
        
        // Act
        await tablePage.table3.enterByKey(0, "Age", 101);
        
        // Assert
        await expect(tablePage.table3.tableLocator).toHaveColumnToBeValue("Age", "101");
    });   

});