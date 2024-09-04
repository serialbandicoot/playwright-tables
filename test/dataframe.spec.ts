import { expect, test } from '@playwright/test';

test.describe('Expect this and that', () => {

    test('verify expectTableRowCountToBeGreaterThan', async ({ page }) => {
        await page.goto("/");
        await expect(page.getByTestId("table1")).expectTableRowCountToBeGreaterThan(3);
    });

    test('verify expectTableRowCountToBeGreaterThan Fails', async ({ page }) => {
        await page.goto("/");
        try{
            await expect(page.getByTestId("table1")).expectTableRowCountToBeGreaterThan(10);
        } catch (error) {
            const errorMessage = error.message;
            errorMessage
        }
        
    });

    test('verify expectColumnValuesToBeInRange', async ({ page }) => {
        await page.goto("/");
        await expect(page.getByTestId("table1")).expectColumnValuesToBeInRange("PersonAge", 1, 100, ["a", "b", "PersonAge"]);
    });

});