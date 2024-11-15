import { Locator, Page } from '@playwright/test';
import { DataFrame, toInteractiveDataFrame, LocatorID, Attributes, DataFrameOptions } from 'html-table-to-dataframe';

/**
 * Represents an interactive data table with methods to interact with and manipulate its cells.
 *
 * This class allows for the following interactions:
 * - Entering values into text fields.
 * - Toggling button states (e.g., switches).
 * - Selecting options from dropdown menus (supports Angular Material and regular HTML selects).
 *
 * The class is designed to work with Playwright, and it provides convenient methods for simulating user actions
 * in an HTML table, based on a specific row and column key.
 */
export class InteractiveDataFrame {
  private page: Page;
  readonly tableLocator: Locator;
  readonly options: DataFrameOptions | undefined;

  /**
   * Initializes a new instance of the InteractiveDataFrame class.
   *
   * @param {Page} page - The Playwright Page instance to interact with.
   * @param {Locator} tableLocator - The Playwright Locator for the table element.
   * @param {DataFrameOptions} [options] - Optional settings to customize the table's interaction (e.g., testId, header).
   */
  constructor(page: Page, tableLocator: Locator, options?: DataFrameOptions) {
    this.page = page;
    this.tableLocator = tableLocator;
    this.options = options;
  }

  /**
   * Enters a value into a cell identified by the given row and key.
   *
   * This method simulates typing into a text field and then blurring (losing focus) the element.
   *
   * @param {number} row - The row number in the table where the cell is located.
   * @param {string} key - The key used to identify the column in the table (used to find the specific cell).
   * @param {string | number} value - The value to enter into the cell.
   */
  async enterByKey(row: number, key: string, value: string | number) {
    const locator = await this.getLocator(row, key);
    const valueStr = value.toString();
    await locator.fill(valueStr);
    await locator.evaluate((el) => el.blur());
  }

  /**
   * Toggles the state of a button (e.g., a switch) in a given table cell.
   *
   * This method checks the current state of the button and toggles it to the desired state, if necessary.
   *
   * @param {number} row - The row number in the table where the button is located.
   * @param {string} key - The key used to identify the column in the table (used to find the specific cell).
   * @param {('on' | 'off')} state - The desired state of the button (default is 'on').
   */
  async toggleButton(row: number, key: string, state: 'on' | 'off' = 'on') {
    const locator = await this.getLocator(row, key);
    const activeState = await locator.locator('button[role="switch"]').getAttribute('aria-checked');

    if ((activeState === 'false' && state === 'on') || (activeState === 'true' && state === 'off')) {
      await locator.click();
    }
  }

  /**
   * Selects an option from a dropdown within a table cell based on the given row and key.
   *
   * This method supports both Angular Material dropdowns (using `mat-option`) and regular HTML `<select>` dropdowns.
   * - If the `framework` is `"angular-mat"`, it will interact with Angular Material dropdowns.
   * - If no framework is specified, it will default to interacting with a standard HTML `<select>` dropdown.
   *
   * @param {number} row - The row number in the table where the dropdown is located.
   * @param {string} key - The key used to identify the column in the table (used to find the specific cell).
   * @param {string} optionValue - The value of the option to select from the dropdown.
   * @param {("angular-mat")?} framework - The framework type:
   *   - `"angular-mat"`: Interact with an Angular Material dropdown.
   *   - If omitted, defaults to a standard HTML dropdown.
   */
  async selectByKey(row: number, key: string, optionValue: string, framework?: 'angular-mat') {
    const locator = await this.getLocator(row, key);
    await locator.click();

    if (framework === 'angular-mat') {
      // Select an option from an Angular Material mat-option dropdown
      const optionLocator = this.page.locator(`mat-option[role="option"] :text-is("${optionValue}")`);
      await optionLocator.click();
    } else {
      // For other cases (default dropdown), use selectOption for standard HTML select dropdowns
      await locator.selectOption({ value: optionValue });
    }
  }

  /**
   * Retrieves the locator for a specific table cell identified by the row and key.
   *
   * This method extracts the correct locator for the cell based on the row number and column key.
   * It uses attributes such as `testId`, `id`, or `name` to locate the cell element.
   *
   * @param {number} row - The row number in the table.
   * @param {string} key - The key used to identify the column.
   * @returns {Locator} - The Playwright Locator for the specified cell.
   * @throws {Error} - Throws an error if the row or key is invalid or if no valid locator is found.
   */
  private async getLocator(row: number, key: string): Promise<Locator> {
    const table = await this.getInteractiveTableData();

    if (row > table.length + 1) {
      throw new Error(`rowIndex ${row} is too high!`);
    }

    const rowLocator = table[row];
    if (!rowLocator[key]) {
      throw new Error(`${key} was not found check header!`);
    }

    // Get the correct Locator using preferred testId
    // https://github.com/microsoft/playwright/pull/32506
    const cell = rowLocator[key] as LocatorID;
    const attributes = cell.attributes as Attributes;

    let testId = undefined;
    if (this.options?.testId) {
      testId = attributes[this.options.testId];
    }
    const id = attributes['id'];
    const name = attributes['name'];

    if (testId) {
      return this.tableLocator.getByTestId(testId);
    } else if (id) {
      return this.tableLocator.locator(`#${id}`);
    } else if (name) {
      return this.tableLocator.locator(`[name="${name}"]`);
    } else {
      throw new Error('Neither testId, id, or name found in attributes.');
    }
  }

  /**
   * Retrieves the table data as an interactive DataFrame, which is a representation of the HTML table.
   *
   * The table's outer HTML is used to generate the DataFrame, which is then used to locate and interact with the table's cells.
   *
   * @returns {Promise<DataFrame[]>} - A promise that resolves to an array of DataFrames representing the table data.
   */
  private async getInteractiveTableData(): Promise<DataFrame[]> {
    const outerHtml = await this.tableLocator.evaluate((el) => el.outerHTML);
    return toInteractiveDataFrame(outerHtml, this.options);
  }
}
