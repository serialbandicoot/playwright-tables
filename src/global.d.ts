import { Nullable } from 'html-table-to-dataframe/dist/types/types';

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
        targetValue: Nullable<string>,
        filterColumn: string,
        filterValue: Nullable<string>,
        headers?: string[],
      ): Promise<R>;
    }
  }
}
