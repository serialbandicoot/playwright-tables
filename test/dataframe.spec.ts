import { expect, test } from '@playwright/test';

test.describe('Table and Column Tests', () => {

    test('verify toHaveTableRowCountGreaterThan', async ({ page }) => {
        await page.goto("/"); // Ensure this points to the right test page
        await expect(page.getByTestId("table1")).toHaveTableRowCountGreaterThan(3); // 4 rows in the table
    });

    test('verify toHaveTableRowCountGreaterThan Fails', async ({ page }) => {
        await page.goto("/");
        try {
            await expect(page.getByTestId("table1")).toHaveTableRowCountGreaterThan(10); // Fails as there are only 4 rows
        } catch (error) {
            const errorMessage = error.message;
            expect(errorMessage).toContain("Expected row count to be greater than 10, but it was 4."); // Add proper assertion here
        }
    });

    test('verify toHaveColumnValuesInRange', async ({ page }) => {
        await page.goto("/");
        // Testing the Age column which has values [22, 45, 29, 36]
        await expect(page.getByTestId("table1")).toHaveColumnValuesInRange("Age", 20, 50, ["Person", "Likes", "Age"]);
    });

    test('verify toHaveColumnValuesMatchRegex', async ({ page }) => {
        await page.goto("/");
        // Testing Likes column to match any string pattern
        await expect(page.getByTestId("table1")).toHaveColumnValuesMatchRegex("Likes", "^[a-zA-Z\\s]+$");
    });

    test('verify toHaveColumnsValuesMatchRegex', async ({ page }) => {
        await page.goto("/");
        // Testing Likes column to match any string pattern
        await expect(page.getByTestId("table4")).toHaveColumnsValuesToMatchRegex(["Percent1", "Percent2"], "^(100|[1-9]?[0-9])%$");
    });

    test('verify toHaveColumnValuesBeNumbers', async ({ page }) => {
        await page.goto("/");
        // Age column is expected to be numbers
        await expect(page.getByTestId("table1")).toHaveColumnValuesBeNumbers("Age");
    });

    test('verify toHaveColumnMatchWhenFilteredBy', async ({ page }) => {
        await page.goto("/");
        // Verify filtering by person "Dennis", age should be 45
        await expect(page.getByTestId("table1")).toHaveColumnMatchWhenFilteredBy("Age", "45", "Person", "Dennis", ["Person", "Likes", "Age"]);
    });

    test('verify toHaveColumnMatchWhenFilteredBy Fails', async ({ page }) => {
        await page.goto("/");
        try {
            // This will fail as "John" is not present in the table
            await expect(page.getByTestId("table1")).toHaveColumnMatchWhenFilteredBy("Age", "30", "Person", "John", ["Person", "Likes", "Age"]);
        } catch (error) {
            const errorMessage = error.message;
            expect(errorMessage).toContain("Column header \"Person\" with value \"John\" was not found! For [{\"Person\":\"Chris\",\"Likes\":\"HTML tables\",\"Age\":\"22\"},{\"Person\":\"Dennis\",\"Likes\":\"Web accessibility\",\"Age\":\"45\"},{\"Person\":\"Sarah\",\"Likes\":\"JavaScript frameworks\",\"Age\":\"29\"},{\"Person\":\"Karen\",\"Likes\":\"Web performance\",\"Age\":\"36\"}]."); // Add proper assertion here
        }
    });

    test('verify toHaveTableRowCountEqualTo', async ({ page }) => {
        await page.goto("/");

        await expect(page.getByTestId("table1")).toHaveTableRowCountEqualTo(4);
    });

    test('verify toHaveTableRowCountLessThan', async ({ page }) => {
        await page.goto("/");

        await expect(page.getByTestId("table1")).toHaveTableRowCountLessThan(5);
    });

    test('verify toHaveColumnValuesInSet', async ({ page }) => {
        await page.goto("/");
    
        const validLikesSet = new Set(['HTML tables', 'Web accessibility', 'JavaScript frameworks', 'Web performance']);
        
        await expect(page.getByTestId("table1")).toHaveColumnValuesInSet('Likes', validLikesSet);
    });

});