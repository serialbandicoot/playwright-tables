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
       * await expect(locator).toHaveColumnValuesMatchingRegex("ColumnName", "^\\d+$", ["Header1", "Header2"]);
       **/
      toHaveColumnValuesMatchingRegex(columnHeader: string, regexPattern: string, headers?: string[]): Promise<R>;

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
       * @param tableData - The data of the table, expected to contain only one row.
       * @param column - The column header to check.
       * @param value - The expected value in the column.
       * @example
       * const tableData = [{ col_1: '1', col_2: '3' }];
       * await expect(locator).toHaveColumnToBeValue(tableData, 'col_2', '3');
       **/
      toHaveColumnToBeValue(tableData: { [key: string]: string }[], column: string, value: string): Promise<R>;

      /**
       * Asserts that a column's value in a single row matches the expected value for a group of filters.
       * @param tableData - The data of the table, expected to contain only one row.
       * @param filterGroup - An array of filter groups specifying which columns and values to check.
       * @example
       * const filterGroup = [{ filterColumn: "col_2", filterValue: "3" }];
       * await expect(locator).toHaveColumnGroupToBeValue(tableData, filterGroup);
       **/
      toHaveColumnGroupToBeValue(tableData: { [key: string]: string }[], filterGroup: GroupType[]): Promise<R>;

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
      toHaveColumnGroupToBeValues(tableData: { [key: string]: string }[], filterGroups: GroupType[][]): Promise<R>;

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
       * @param tableData - The table data.
       * @param expectedLength - The expected number of rows.
       * @example
       * await expect(locator).toHaveTableRowCountEqualTo(tableData, 2);
       */
      toHaveTableRowCountEqualTo(tableData: { [key: string]: string }[], expectedLength: number): Promise<R>;

      /**
       * Asserts that the table data has exactly the expected number of rows.
       * @param tableData - The table data.
       * @param expectedLength - The expected number of rows.
       * @example
       * await expect(locator).toHaveTableRowCountLessThan(tableData, 2);
       */
      toHaveTableRowCountLessThan(tableData: { [key: string]: string }[], expectedLength: number): Promise<R>;
    }
  }
}

// Define GroupType for usage with
// - toHaveColumnToMatchGroupWhenFilteredBy
export type GroupType = {
  filterColumn: string;
  filterValue: string;
};

// Exports
import InteractiveDataFrame from './interactive-dataframe';
import { toPrettyPrint, toDataFrame } from 'html-table-to-dataframe';
export { toPrettyPrint, toDataFrame, InteractiveDataFrame };
