import { Locator } from '@playwright/test';
import {
  toDataFrame,
  toHaveTableRowCountGreaterThan,
  toHaveColumnValuesToMatchRegex,
  toHaveColumnValuesToBeInRange,
  toHaveColumnValuesToBeNumbers,
  toHaveColumnToMatchWhenFilteredBy,
  toHaveColumnToMatchGroupWhenFilteredBy,
  toHaveColumnToNotMatch,
  toHaveTableRowCount,
  toHaveColumnGroupToBeValue,
  toHaveColumnGroupToBeValues,
  toHaveTableToNotMatch,
  toHaveTableToMatch,
  toHaveColumnToBeValue,
  toHaveTableRowCountEqualTo,
  toHaveTableRowCountLessThan,
  toHaveColumnValuesInSet,
  GroupType,
  TableData,
  toHaveColumnsValuesToMatchRegex,
} from 'html-table-to-dataframe';

type DataFrame = { [key: string]: string }[] | null;

/* eslint-disable @typescript-eslint/no-namespace */
declare global {
  namespace PlaywrightTest {
    interface Matchers<R> {
      /**
       * Asserts that the table's row count is greater than the specified number.
       * @param expected - The minimum number of rows expected.
       * @param headers - An optional array of headers to use for the table.
       * @example
       * await expect(locator).toHaveTableRowCountGreaterThan(5, ["Header1", "Header2"]);
       **/
      toHaveTableRowCountGreaterThan(expected: number, headers?: string[]): Promise<R>;

      /**
       * Asserts that all values in a specified column match a given regular expression.
       * @param columnHeader - The header of the column to validate.
       * @param regexPattern - The regular expression pattern that the column values should match.
       * @param headers - An optional array of headers to use for the table.
       * @example
       * await expect(locator).toHaveColumnValuesMatchRegex("ColumnName", "^\\d+$", ["Header1", "Header2"]);
       **/
      toHaveColumnValuesMatchRegex(columnHeader: string, regexPattern: string, headers?: string[]): Promise<R>;

      /**
       * Asserts that all values in a specified column match a given regular expression.
       * @param columnHeaders - The list of column header of the column to validate.
       * @param regexPattern - The regular expression pattern that the column values should match.
       * @param headers - An optional array of headers to use for the table.
       * @example
       * await expect(locator).toHaveColumnsValuesToMatchRegex("ColumnName", "^\\d+$", ["Header1", "Header2"]);
       **/
      toHaveColumnsValuesToMatchRegex(columnHeaders: string[], regexPattern: string, headers?: string[]): Promise<R>;

      /**
       * Asserts that all values in a specified column are within a given range.
       * @param columnHeader - The header of the column to validate.
       * @param minValue - The minimum value allowed in the column.
       * @param maxValue - The maximum value allowed in the column.
       * @param headers - An optional array of headers to use for the table.
       * @example
       * await expect(locator).toHaveColumnValuesInRange("Age", 18, 65, ["Header1", "Header2"]);
       **/
      toHaveColumnValuesInRange(columnHeader: string, minValue: number, maxValue: number, headers?: string[]): Promise<R>;

      /**
       * Asserts that all values in a specified column are numbers.
       * @param columnHeader - The header of the column to validate.
       * @param headers - An optional array of headers to use for the table.
       * @example
       * await expect(locator).toHaveColumnValuesBeNumbers("Price", ["Header1", "Header2"]);
       **/
      toHaveColumnValuesBeNumbers(columnHeader: string, headers?: string[]): Promise<R>;

      /**
       * Asserts that a column's values match a specified target when filtered by another column.
       * @param targetColumn - The header of the column to validate.
       * @param targetValue - The expected value in the target column.
       * @param filterColumn - The header of the column to filter by.
       * @param filterValue - The value to filter the filter column by.
       * @param headers - An optional array of headers to use for the table.
       * @example
       * await expect(locator).toHaveColumnMatchWhenFilteredBy("TargetColumn", "ExpectedValue", "FilterColumn", "FilterValue", ["Header1", "Header2"]);
       **/
      toHaveColumnMatchWhenFilteredBy(
        targetColumn: string,
        targetValue: string,
        filterColumn: string,
        filterValue: string,
        headers?: string[],
      ): Promise<R>;

      /**
       * Asserts that a column's value in a single row matches the expected value.
       * @param column - The column header to check.
       * @param value - The expected value in the column.
       * @example
       * const tableData = [{ col_1: '1', col_2: '3' }];
       * await expect(locator).toHaveColumnToBeValue(tableData, 'col_2', '3');
       **/
      toHaveColumnToBeValue(column: string, value: string): Promise<R>;

      /**
       * Asserts that a column's value in a single row matches the expected value for a group of filters.
       * @param tableData - The data of the table, expected to contain only one row.
       * @param filterGroup - An array of filter groups specifying which columns and values to check.
       * @example
       * const filterGroup = [{ filterColumn: "col_2", filterValue: "3" }];
       * await expect(locator).toHaveColumnGroupToBeValue(tableData, filterGroup);
       **/
      toHaveColumnGroupToBeValue(filterGroup: GroupType[]): Promise<R>;

      /**
       * Asserts that column values in multiple rows match expected values for a group of filters.
       * @param tableData - The data of the table.
       * @param filterGroups - An array of filter groups where each group specifies the columns and values to check.
       * @example
       * const filterGroups = [
       *   [{ filterColumn: "col_2", filterValue: "3" }],
       *   [{ filterColumn: "col_2", filterValue: "4" }]
       * ];
       * await expect(locator).toHaveColumnGroupToBeValues(tableData, filterGroups);
       **/
      toHaveColumnGroupToBeValues(filterGroups: GroupType[][]): Promise<R>;

      /**
       * Asserts that a table does not match another table's key/value pairs.
       * @param tableData1 - The first table data.
       * @param tableData2 - The second table data.
       * @example
       * await expect(locator).toHaveTableToNotMatch(tableData1, tableData2);
       **/
      toHaveTableToNotMatch(tableData1: { [key: string]: string }[], tableData2: { [key: string]: string }[]): Promise<R>;

      /**
       * Asserts that a table matches another table's key/value pairs.
       * @param tableData1 - The first table data.
       * @param tableData2 - The second table data.
       * @example
       * await expect(locator).toHaveTableToMatch(tableData1, tableData2);
       **/
      toHaveTableToMatch(tableData1: { [key: string]: string }[], tableData2: { [key: string]: string }[]): Promise<R>;

      /**
       * Asserts that the table data has exactly the expected number of rows.
       * @param expectedLength - The expected number of rows.
       * @example
       * await expect(locator).toHaveTableRowCountEqualTo(tableData, 2);
       */
      toHaveTableRowCountEqualTo(expectedLength: number): Promise<R>;

      /**
       * Asserts that the table data has exactly the expected number of rows.
       * @param expectedLength - The expected number of rows.
       * @example
       * await expect(locator).toHaveTableRowCountLessThan(tableData, 2);
       */
      toHaveTableRowCountLessThan(expectedLength: number): Promise<R>;

      /**
       * Asserts that all values in the specified column are within the given set.
       *
       * @param columnHeader - The column header to check.
       * @param targetSet - Set of valid values for the column.
       *
       * @example
       * const set: Set<string> = new Set(["1", "2", "3"]);
       * await expect(locator).toHaveColumnValuesInSet("col_2", set);
       */
      toHaveColumnValuesInSet(columnHeader: string, targetSet: Set<string>): Promise<R>;
    }
  }
}

export async function getDataFrame(locator: Locator, headers?: string[]): Promise<DataFrame> {
  const updatedHtml = await locator.evaluate((element) => {
    // Function to recursively recreate the HTML for each element, including updated input values
    const getUpdatedHTML = (el: Element): string => {
      if (el instanceof HTMLInputElement || el instanceof HTMLTextAreaElement) {
        // For input/textarea elements, overwrite the "value" attribute with the live value
        const attributes = Array.from(el.attributes)
          .filter((attr) => attr.name !== 'value') // Remove any existing 'value' attribute
          .map((attr) => `${attr.name}="${attr.value}"`)
          .join(' ');

        // Return the tag with the updated value for inputs and textareas
        return `<${el.tagName.toLowerCase()} ${attributes} value="${el.value}"></${el.tagName.toLowerCase()}>`;
      } else {
        // Rebuild the HTML for non-input elements
        const childrenHtml = Array.from(el.children)
          .map((child) => getUpdatedHTML(child))
          .join('');

        const attributes = Array.from(el.attributes)
          .map((attr) => `${attr.name}="${attr.value}"`)
          .join(' ');

        return `<${el.tagName.toLowerCase()} ${attributes}>${childrenHtml || el.innerHTML}</${el.tagName.toLowerCase()}>`;
      }
    };

    // Call the recursive function for the root element
    return getUpdatedHTML(element);
  });

  // Now that we have the updated HTML, pass it to toDataFrame as before
  return toDataFrame(updatedHtml, headers);
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

const PlaywrightTables = {
  async toHaveTableRowCountGreaterThan(locator: Locator, expected: number, headers?: string[]) {
    return assertWithHandling(
      locator,
      (tableData) => {
        toHaveTableRowCountGreaterThan(tableData, expected);
      },
      headers,
    );
  },

  async toHaveColumnValuesMatchRegex(locator: Locator, columnHeader: string, regexPattern: string, headers?: string[]) {
    return assertWithHandling(
      locator,
      (tableData) => {
        toHaveColumnValuesToMatchRegex(tableData, columnHeader, regexPattern);
      },
      headers,
    );
  },

  async toHaveColumnsValuesToMatchRegex(
    locator: Locator,
    columnHeaders: string[],
    regexPattern: string,
    headers?: string[],
  ) {
    return assertWithHandling(
      locator,
      (tableData) => {
        toHaveColumnsValuesToMatchRegex(tableData, columnHeaders, regexPattern);
      },
      headers,
    );
  },

  async toHaveColumnValuesInRange(
    locator: Locator,
    columnHeader: string,
    minValue: number,
    maxValue: number,
    headers?: string[],
  ) {
    return assertWithHandling(
      locator,
      (tableData) => {
        toHaveColumnValuesToBeInRange(tableData, columnHeader, minValue, maxValue);
      },
      headers,
    );
  },

  async toHaveColumnValuesBeNumbers(locator: Locator, columnHeader: string, headers?: string[]) {
    return assertWithHandling(
      locator,
      (tableData) => {
        toHaveColumnValuesToBeNumbers(tableData, columnHeader);
      },
      headers,
    );
  },

  async toHaveColumnMatchWhenFilteredBy(
    locator: Locator,
    targetColumn: string,
    targetValue: string,
    filterColumn: string,
    filterValue: string,
    headers?: string[],
  ) {
    return assertWithHandling(
      locator,
      (tableData) => {
        toHaveColumnToMatchWhenFilteredBy(tableData, targetColumn, targetValue, filterColumn, filterValue);
      },
      headers,
    );
  },

  async toHaveColumnMatchGroupWhenFilteredBy(
    locator: Locator,
    targetColumn: string,
    targetValue: string,
    filterGroups: GroupType[],
    headers?: string[],
  ) {
    return assertWithHandling(
      locator,
      (tableData) => {
        toHaveColumnToMatchGroupWhenFilteredBy(tableData, targetColumn, targetValue, filterGroups);
      },
      headers,
    );
  },

  async toHaveColumnToNotMatch(locator: Locator, columnHeader: string, value: string, headers?: string[]) {
    return assertWithHandling(
      locator,
      (tableData) => {
        toHaveColumnToNotMatch(tableData, columnHeader, value);
      },
      headers,
    );
  },

  async toHaveTableRowCount(locator: Locator, expected: number, headers?: string[]) {
    return assertWithHandling(
      locator,
      (tableData) => {
        toHaveTableRowCount(tableData, expected);
      },
      headers,
    );
  },

  async toHaveColumnGroupToBeValue(locator: Locator, filterGroups: GroupType[], headers?: string[]) {
    return assertWithHandling(
      locator,
      (tableData) => {
        toHaveColumnGroupToBeValue(tableData, filterGroups);
      },
      headers,
    );
  },

  async toHaveColumnGroupToBeValues(locator: Locator, filterGroupsList: GroupType[][], headers?: string[]) {
    return assertWithHandling(
      locator,
      (tableData) => {
        toHaveColumnGroupToBeValues(tableData, filterGroupsList);
      },
      headers,
    );
  },

  async toHaveColumnToBeValue(locator: Locator, column: string, value: string, headers?: string[]) {
    return assertWithHandling(
      locator,
      (tableData) => {
        toHaveColumnToBeValue(tableData, column, value);
      },
      headers,
    );
  },

  async toHaveTableToNotMatch(locator: Locator, tableData: TableData, headers?: string[]) {
    return assertWithHandling(
      locator,
      (dataFrame) => {
        toHaveTableToNotMatch(dataFrame, tableData);
      },
      headers,
    );
  },

  async toHaveTableToMatch(locator: Locator, tableData: TableData, headers?: string[]) {
    return assertWithHandling(
      locator,
      (dataFrame) => {
        toHaveTableToMatch(dataFrame, tableData);
      },
      headers,
    );
  },

  async toHaveTableRowCountEqualTo(locator: Locator, expectedLength: number, headers?: string[]) {
    return assertWithHandling(
      locator,
      (dataFrame) => {
        toHaveTableRowCountEqualTo(dataFrame, expectedLength);
      },
      headers,
    );
  },

  async toHaveTableRowCountLessThan(locator: Locator, expectedLength: number, headers?: string[]) {
    return assertWithHandling(
      locator,
      (dataFrame) => {
        toHaveTableRowCountLessThan(dataFrame, expectedLength);
      },
      headers,
    );
  },

  async toHaveColumnValuesInSet(locator: Locator, columnHeader: string, targetSet: Set<string>, headers?: string[]) {
    return assertWithHandling(
      locator,
      (tableData) => {
        toHaveColumnValuesInSet(tableData, columnHeader, targetSet);
      },
      headers,
    );
  },
};

export { GroupType, TableData };
export { InteractiveDataFrame } from './interactive-dataframe';
export { PlaywrightTables };
