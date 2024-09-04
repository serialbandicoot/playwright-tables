import { Locator } from '@playwright/test';
import {
  toDataFrame,
  expectTableRowCountToBeGreaterThan,
  expectColumnValuesToBeInRange,
  expectColumnValuesToMatchRegex,
  expectColumnValuesToBeNumbers,
  expectColumnToMatchWhenFilteredBy,
} from 'html-table-to-dataframe';
import { Nullable } from 'html-table-to-dataframe/dist/types/types';

type DataFrame = { [key: string]: string }[] | null;

async function getDataFrame(locator: Locator, headers?: string[]): Promise<DataFrame> {
  const outerHtml = await locator.evaluate((el) => el.outerHTML);
  return toDataFrame(outerHtml, headers);
}

type AssertionFn<T extends unknown[]> = (tableData: { [key: string]: string }[], ...args: T) => void;

async function assertWithHandling<T extends unknown[]>(
  locator: Locator,
  assertionFn: AssertionFn<T>,
  headers?: string[],
  ...args: T
): Promise<{ message: () => string; pass: boolean }> {
  const dataFrame = await getDataFrame(locator, headers);

  if (!dataFrame || dataFrame.length === 0) {
    return {
      message: () => 'DataFrame is null or empty',
      pass: false,
    };
  }

  // If headers are not provided, derive them from the first row of the DataFrame
  if (!headers || headers.length === 0) {
    headers = Object.keys(dataFrame[0]);
  }

  try {
    assertionFn(dataFrame, ...args);
    return {
      message: () => 'passed',
      pass: true,
    };
  } catch (error) {
    return {
      message: () => (error as Error).message,
      pass: false,
    };
  }
}

const playwrightTables = {
  async expectTableRowCountToBeGreaterThan(locator: Locator, expected: number, headers?: string[]) {
    return assertWithHandling(
      locator,
      (tableData) => {
        expectTableRowCountToBeGreaterThan(tableData, expected);
      },
      headers,
    );
  },

  async expectColumnValuesToMatchRegex(locator: Locator, columnHeader: string, regexPattern: string, headers?: string[]) {
    return assertWithHandling(
      locator,
      (tableData) => {
        expectColumnValuesToMatchRegex(tableData, columnHeader, regexPattern);
      },
      headers,
    );
  },

  async expectColumnValuesToBeInRange(
    locator: Locator,
    columnHeader: string,
    minValue: number,
    maxValue: number,
    headers?: string[],
  ) {
    return assertWithHandling(
      locator,
      (tableData) => {
        expectColumnValuesToBeInRange(tableData, columnHeader, minValue, maxValue);
      },
      headers,
    );
  },

  async expectColumnValuesToBeNumbers(locator: Locator, columnHeader: string, headers?: string[]) {
    return assertWithHandling(
      locator,
      (tableData) => {
        expectColumnValuesToBeNumbers(tableData, columnHeader);
      },
      headers,
    );
  },

  async expectColumnToMatchWhenFilteredBy(
    locator: Locator,
    targetColumn: string,
    targetValue: Nullable<string>,
    filterColumn: string,
    filterValue: Nullable<string>,
    headers?: string[],
  ) {
    return assertWithHandling(
      locator,
      (tableData) => {
        expectColumnToMatchWhenFilteredBy(tableData, targetColumn, targetValue, filterColumn, filterValue);
      },
      headers,
    );
  },
};

export default PlaywrightTables;
