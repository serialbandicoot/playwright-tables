import { Locator, Page } from '@playwright/test';
import { DataFrame, toInteractiveDataFrame, Attributes, LocatorID } from 'html-table-to-dataframe';

export class InteractiveDataFrame {
  private page: Page;
  readonly tableLocator: Locator;

  constructor(page: Page, tableLocator: Locator) {
    this.page = page;
    this.tableLocator = tableLocator;
  }

  async enterByKey(row: number, key: string, value: string | number) {
    const locator = await this.getLocator(row, key);
    const valueStr = value.toString();
    await locator.fill(valueStr);
    await this.page.keyboard.press('Tab');
  }

  async toggleButton(row: number, key: string, state: 'on' | 'off' = 'on') {
    const locator = await this.getLocator(row, key);
    const activeState = await locator.locator('button[role="switch"]').getAttribute('aria-checked');

    if ((activeState === 'false' && state === 'on') || (activeState === 'true' && state === 'off')) {
      await locator.click();
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

    const dataTestId = attributes['data-test-id'];
    const id = attributes['id'];
    const name = attributes['name'];

    if (attributes['data-test-id']) {
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
