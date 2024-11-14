import { Locator, Page } from '@playwright/test';
import { DataFrame, toInteractiveDataFrame, LocatorID, Attributes } from 'html-table-to-dataframe';

export class InteractiveDataFrame {
  private page: Page;
  readonly tableLocator: Locator;
  readonly cellLocator: string | undefined;

  constructor(page: Page, tableLocator: Locator, cellLocator?: string) {
    this.page = page;
    this.tableLocator = tableLocator;
    this.cellLocator = cellLocator;
  }

  async enterByKey(row: number, key: string, value: string | number) {
    const locator = await this.getLocator(row, key);
    const valueStr = value.toString();
    await locator.fill(valueStr);
    await locator.evaluate((el) => el.blur());
  }

  async toggleButton(row: number, key: string, state: 'on' | 'off' = 'on') {
    const locator = await this.getLocator(row, key);
    const activeState = await locator.locator('button[role="switch"]').getAttribute('aria-checked');

    if ((activeState === 'false' && state === 'on') || (activeState === 'true' && state === 'off')) {
      await locator.click();
    }
  }

  /**
   * Selects an option from a table cell based on a given row and key.
   *
   * This method simulates the selection of a dropdown option. It interacts with different dropdown types
   * based on the provided `framework` parameter:
   * - If `framework` is `"angular-mat"`, it selects an option from an Angular Material dropdown (`mat-option`).
   * - If `framework` is `"tailwind"`, it assumes a Tailwind CSS dropdown and selects the option accordingly.
   * - If `framework` is not provided or is not one of the above, it defaults to interacting with a regular HTML `<select>` dropdown.
   *
   * @param {number} row - The row number in the table where the dropdown is located.
   * @param {string} key - The key used to identify the column in the table (used to find the specific cell).
   * @param {string} optionValue - The value of the option to select.
   * @param {("angular-mat" | "tailwind")?} framework - The framework type:
   *                                                      - `"angular-mat"`: Select from an Angular Material dropdown.
   *                                                      - `"tailwind"`: Select from a Tailwind CSS dropdown.
   *                                                      - If omitted, defaults to a standard HTML dropdown.
   */

  async selectByKey(row: number, key: string, optionValue: string, framework?: 'angular-mat') {
    const locator = await this.getLocator(row, key);
    await locator.click();

    if (framework === 'angular-mat') {
      // mat-option not connected to the parent and separate in the DOM
      const optionLocator = this.page.locator(`mat-option[role="option"]:text("${optionValue}")`);
      await optionLocator.click();
    } else {
      // For other cases (default dropdown), use selectOption for normal dropdowns
      await locator.selectOption({ value: optionValue });
    }
  }

  private async getLocator(row: number, key: string) {
    const table = await this.getInteractiveTableData();

    if (row > table.length + 1) {
      throw new Error(`rowIndex ${row} is too high!`);
    }

    const rowLocator = table[row];
    if (!rowLocator[key]) {
      throw new Error(`${key} was not found check header!`);
    }

    // Get the correct Locator using preferred data-test-id/id
    // https://github.com/microsoft/playwright/pull/32506
    const cell = rowLocator[key] as LocatorID;
    const attributes = cell.attributes as Attributes;

    let dataTestId = undefined;
    if (this.cellLocator) {
      dataTestId = attributes[this.cellLocator];
    }
    const id = attributes['id'];
    const name = attributes['name'];

    if (dataTestId) {
      return this.tableLocator.getByTestId(dataTestId);
    } else if (id) {
      return this.tableLocator.locator(`#${id}`);
    } else if (name) {
      return this.tableLocator.locator(`[name="${name}"]`);
    } else {
      throw new Error('Neither data-test-id, id, nor name found in attributes.');
    }
  }

  private async getInteractiveTableData(): Promise<DataFrame[]> {
    const outerHtml = await this.tableLocator.evaluate((el) => el.outerHTML);
    return toInteractiveDataFrame(outerHtml);
  }
}
