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
  DataFrameOptions,
} from 'html-table-to-dataframe';

type DataFrame = { [key: string]: string }[] | null;

/* eslint-disable @typescript-eslint/no-namespace */
declare global {
  namespace PlaywrightTest {
    interface Matchers<R> {
      /**
       * Asserts that the table's row count is greater than the specified number.
       * @param expected - The minimum number of rows expected.
       * @param options: - Options for header and footer
       * @example
       * await expect(locator).toHaveTableRowCountGreaterThan(5, {header: ["Header1", "Header2"]});
       **/
      toHaveTableRowCountGreaterThan(expected: number, options?: DataFrameOptions): Promise<R>;

      /**
       * Asserts that all values in a specified column match a given regular expression.
       * @param columnHeader - The header of the column to validate.
       * @param regexPattern - The regular expression pattern that the column values should match.
       * @param options: - Options for header and footer
       * @example
       * await expect(locator).toHaveColumnValuesMatchRegex("ColumnName", "^\\d+$", {header: ["Header1", "Header2"]});
       **/
      toHaveColumnValuesMatchRegex(columnHeader: string, regexPattern: string, options?: DataFrameOptions): Promise<R>;

      /**
       * Asserts that all values in a specified column match a given regular expression.
       * @param columnHeaders - The list of column header of the column to validate.
       * @param regexPattern - The regular expression pattern that the column values should match.
       * @param options: - Options for header and footer
       * @example
       * await expect(locator).toHaveColumnsValuesToMatchRegex("ColumnName", "^\\d+$", {header: ["Header1", "Header2"]});
       **/
      toHaveColumnsValuesToMatchRegex(columnHeaders: string[], regexPattern: string, options?: DataFrameOptions): Promise<R>;

      /**
       * Asserts that all values in a specified column are within a given range.
       * @param columnHeader - The header of the column to validate.
       * @param minValue - The minimum value allowed in the column.
       * @param maxValue - The maximum value allowed in the column.
       * @param options: - Options for header and footer
       * @example
       * await expect(locator).toHaveColumnValuesInRange("Age", 18, 65, {header: ["Header1", "Header2"]});
       **/
      toHaveColumnValuesInRange(
        columnHeader: string,
        minValue: number,
        maxValue: number,
        options?: DataFrameOptions,
      ): Promise<R>;

      /**
       * Asserts that all values in a specified column are numbers.
       * @param columnHeader - The header of the column to validate.
       * @param options: - Options for header and footer
       * @example
       * await expect(locator).toHaveColumnValuesBeNumbers("Price", {header: ["Header1", "Header2"]});
       **/
      toHaveColumnValuesBeNumbers(columnHeader: string, options?: DataFrameOptions): Promise<R>;

      /**
       * Asserts that a column's values match a specified target when filtered by another column.
       * @param targetColumn - The header of the column to validate.
       * @param targetValue - The expected value in the target column.
       * @param filterColumn - The header of the column to filter by.
       * @param filterValue - The value to filter the filter column by.
       * @param options: - Options for header and footer
       * @example
       * await expect(locator).toHaveColumnToMatchWhenFilteredBy("TargetColumn", "ExpectedValue", "FilterColumn", "FilterValue", {header: ["Header1", "Header2"]});
       **/
      toHaveColumnToMatchWhenFilteredBy(
        targetColumn: string,
        targetValue: string,
        filterColumn: string,
        filterValue: string,
        options?: DataFrameOptions,
      ): Promise<R>;

      /**
       * Asserts that a column's values match a specified target when filtered by another column.
       * @param targetColumn - The header of the column to validate.
       * @param targetValue - The expected value in the target column.
       * @param filterGroup - An array of filter groups specifying which columns and values to check.
       * @param options: - Options for header and footer
       * @example
       * await expect(locator).toHaveColumnToMatchGroupWhenFilteredBy(targetColumn, targetValue, filterGroups, {header: {header: ["Header1", "Header2"]}});
       **/
      toHaveColumnMatchGroupWhenFilteredBy(
        targetColumn: string,
        targetValue: string,
        filterGroup: GroupType[],
        options?: DataFrameOptions,
      ): Promise<R>;

      /**
       * Asserts that a column's value in a single row matches the expected value.
       * @param column - The column header to check.
       * @param value - The expected value in the column.
       * @example
       * const tableData = [{ col_1: '1', col_2: '3' }];
       * await expect(locator).toHaveColumnToBeValue(tableData, 'col_2', '3');
       **/
      toHaveColumnToBeValue(column: string, value: string, options?: DataFrameOptions): Promise<R>;

      /**
       * Asserts that a column's value in a single row matches the expected value for a group of filters.
       * @param tableData - The data of the table, expected to contain only one row.
       * @param filterGroup - An array of filter groups specifying which columns and values to check.
       * @example
       * const filterGroup = [{ filterColumn: "col_2", filterValue: "3" }];
       * await expect(locator).toHaveColumnGroupToBeValue(tableData, filterGroup);
       **/
      toHaveColumnGroupToBeValue(filterGroup: GroupType[], options?: DataFrameOptions): Promise<R>;

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
      toHaveColumnGroupToBeValues(filterGroups: GroupType[][], options?: DataFrameOptions): Promise<R>;

      /**
       * Asserts that a table does not match another table's key/value pairs.
       * @param tableData1 - The first table data.
       * @param tableData2 - The second table data.
       * @example
       * await expect(locator).toHaveTableToNotMatch(tableData1, tableData2);
       **/
      toHaveTableToNotMatch(
        tableData1: { [key: string]: string }[],
        tableData2: { [key: string]: string }[],
        options?: DataFrameOptions,
      ): Promise<R>;

      /**
       * Asserts that a table matches another table's key/value pairs.
       * @param tableData1 - The first table data.
       * @param tableData2 - The second table data.
       * @example
       * await expect(locator).toHaveTableToMatch(tableData1, tableData2);
       **/
      toHaveTableToMatch(
        tableData1: { [key: string]: string }[],
        tableData2: { [key: string]: string }[],
        options?: DataFrameOptions,
      ): Promise<R>;

      /**
       * Asserts that the table data has exactly the expected number of rows.
       * @param expectedLength - The expected number of rows.
       * @example
       * await expect(locator).toHaveTableRowCountEqualTo(tableData, 2);
       */
      toHaveTableRowCountEqualTo(expectedLength: number, options?: DataFrameOptions): Promise<R>;

      /**
       * Asserts that the table data has exactly the expected number of rows.
       * @param expectedLength - The expected number of rows.
       * @example
       * await expect(locator).toHaveTableRowCountLessThan(tableData, 2);
       */
      toHaveTableRowCountLessThan(expectedLength: number, options?: DataFrameOptions): Promise<R>;

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
      toHaveColumnValuesInSet(columnHeader: string, targetSet: Set<string>, options?: DataFrameOptions): Promise<R>;

      /**
       * Asserts that a specified column does not contain a certain value, ensuring a
       * row is no longer available (e.g., when a record is deleted or archived).
       *
       * @param targetColumn - The column header to check.
       * @param targetValue - The value that should not be present in the column.
       *
       * @example
       * const tableData = [
       *   { col_1: "1", col_2: "3" },
       *   { col_1: "2", col_2: "1e" },
       * ];
       * await expect(tableData).toHaveColumnToNotMatch("col_1", "2");
       */
      toHaveColumnToNotMatch(targetColumn: string, targetValue: string, options?: DataFrameOptions): Promise<R>;
    }
  }
}

export async function getDataFrame(locator: Locator, options?: DataFrameOptions): Promise<DataFrame> {
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
  return toDataFrame(updatedHtml, options);
}

type AssertionFn<T extends unknown[]> = (tableData: { [key: string]: string }[], ...args: T) => void;

async function assertWithHandling<T extends unknown[]>(
  locator: Locator,
  assertionFn: AssertionFn<T>,
  options?: DataFrameOptions,
  ...args: T
): Promise<{ message: () => string; pass: boolean }> {
  const dataFrame = await getDataFrame(locator, options);

  if (!dataFrame || dataFrame.length === 0) {
    return {
      message: () => 'DataFrame is null or empty',
      pass: false,
    };
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
  async toHaveTableRowCountGreaterThan(locator: Locator, expected: number, options?: DataFrameOptions) {
    return assertWithHandling(
      locator,
      (tableData) => {
        toHaveTableRowCountGreaterThan(tableData, expected);
      },
      options,
    );
  },

  async toHaveColumnValuesMatchRegex(
    locator: Locator,
    columnHeader: string,
    regexPattern: string,
    options?: DataFrameOptions,
  ) {
    return assertWithHandling(
      locator,
      (tableData) => {
        toHaveColumnValuesToMatchRegex(tableData, columnHeader, regexPattern);
      },
      options,
    );
  },

  async toHaveColumnsValuesToMatchRegex(
    locator: Locator,
    columnHeaders: string[],
    regexPattern: string,
    options?: DataFrameOptions,
  ) {
    return assertWithHandling(
      locator,
      (tableData) => {
        toHaveColumnsValuesToMatchRegex(tableData, columnHeaders, regexPattern);
      },
      options,
    );
  },

  async toHaveColumnValuesInRange(
    locator: Locator,
    columnHeader: string,
    minValue: number,
    maxValue: number,
    options?: DataFrameOptions,
  ) {
    return assertWithHandling(
      locator,
      (tableData) => {
        toHaveColumnValuesToBeInRange(tableData, columnHeader, minValue, maxValue);
      },
      options,
    );
  },

  async toHaveColumnValuesBeNumbers(locator: Locator, columnHeader: string, options?: DataFrameOptions) {
    return assertWithHandling(
      locator,
      (tableData) => {
        toHaveColumnValuesToBeNumbers(tableData, columnHeader);
      },
      options,
    );
  },

  async toHaveColumnToMatchWhenFilteredBy(
    locator: Locator,
    targetColumn: string,
    targetValue: string,
    filterColumn: string,
    filterValue: string,
    options?: DataFrameOptions,
  ) {
    return assertWithHandling(
      locator,
      (tableData) => {
        toHaveColumnToMatchWhenFilteredBy(tableData, targetColumn, targetValue, filterColumn, filterValue);
      },
      options,
    );
  },

  async toHaveColumnMatchGroupWhenFilteredBy(
    locator: Locator,
    targetColumn: string,
    targetValue: string,
    filterGroups: GroupType[],
    options?: DataFrameOptions,
  ) {
    return assertWithHandling(
      locator,
      (tableData) => {
        toHaveColumnToMatchGroupWhenFilteredBy(tableData, targetColumn, targetValue, filterGroups);
      },
      options,
    );
  },

  async toHaveColumnToNotMatch(locator: Locator, columnHeader: string, value: string, options?: DataFrameOptions) {
    return assertWithHandling(
      locator,
      (tableData) => {
        toHaveColumnToNotMatch(tableData, columnHeader, value);
      },
      options,
    );
  },

  async toHaveTableRowCount(locator: Locator, expected: number, options?: DataFrameOptions) {
    return assertWithHandling(
      locator,
      (tableData) => {
        toHaveTableRowCount(tableData, expected);
      },
      options,
    );
  },

  async toHaveColumnGroupToBeValue(locator: Locator, filterGroups: GroupType[], options?: DataFrameOptions) {
    return assertWithHandling(
      locator,
      (tableData) => {
        toHaveColumnGroupToBeValue(tableData, filterGroups);
      },
      options,
    );
  },

  async toHaveColumnGroupToBeValues(locator: Locator, filterGroupsList: GroupType[][], options?: DataFrameOptions) {
    return assertWithHandling(
      locator,
      (tableData) => {
        toHaveColumnGroupToBeValues(tableData, filterGroupsList);
      },
      options,
    );
  },

  async toHaveColumnToBeValue(locator: Locator, column: string, value: string, options?: DataFrameOptions) {
    return assertWithHandling(
      locator,
      (tableData) => {
        toHaveColumnToBeValue(tableData, column, value);
      },
      options,
    );
  },

  async toHaveTableToNotMatch(locator: Locator, tableData: TableData, options?: DataFrameOptions) {
    return assertWithHandling(
      locator,
      (dataFrame) => {
        toHaveTableToNotMatch(dataFrame, tableData);
      },
      options,
    );
  },

  async toHaveTableToMatch(locator: Locator, tableData: TableData, options?: DataFrameOptions) {
    return assertWithHandling(
      locator,
      (dataFrame) => {
        toHaveTableToMatch(dataFrame, tableData);
      },
      options,
    );
  },

  async toHaveTableRowCountEqualTo(locator: Locator, expectedLength: number, options?: DataFrameOptions) {
    return assertWithHandling(
      locator,
      (dataFrame) => {
        toHaveTableRowCountEqualTo(dataFrame, expectedLength);
      },
      options,
    );
  },

  async toHaveTableRowCountLessThan(locator: Locator, expectedLength: number, options?: DataFrameOptions) {
    return assertWithHandling(
      locator,
      (dataFrame) => {
        toHaveTableRowCountLessThan(dataFrame, expectedLength);
      },
      options,
    );
  },

  async toHaveColumnValuesInSet(locator: Locator, columnHeader: string, targetSet: Set<string>, options?: DataFrameOptions) {
    return assertWithHandling(
      locator,
      (tableData) => {
        toHaveColumnValuesInSet(tableData, columnHeader, targetSet);
      },
      options,
    );
  },
};

export { GroupType, TableData, DataFrameOptions };
export { InteractiveDataFrame } from './interactive-dataframe';
export { PlaywrightTables };
