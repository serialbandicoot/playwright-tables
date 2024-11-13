import { Locator, Page } from '@playwright/test';
import { DataFrame, toInteractiveDataFrame, LocatorID, Attributes } from 'html-table-to-dataframe';
import { CellLocatorId } from '.';

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

  async selectByKey(row: number, key: string, optionValue: string,
  ) {
    const locator = await this.getLocator(row, key);
    await locator.click()

    await locator.selectOption({ value: optionValue })
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
