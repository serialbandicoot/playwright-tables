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
  GroupType,
  toHaveTableRowCountEqualTo,
  toHaveTableRowCountLessThan,
} from 'html-table-to-dataframe';
import { TableData } from 'html-table-to-dataframe/dist/types/types';

type DataFrame = { [key: string]: string }[] | null;

async function getDataFrame(locator: Locator, headers?: string[]): Promise<DataFrame> {
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

const playwrightTables = {
  async toHaveTableRowCountGreaterThan(locator: Locator, expected: number, headers?: string[]) {
    return assertWithHandling(
      locator,
      (tableData) => {
        toHaveTableRowCountGreaterThan(tableData, expected);
      },
      headers,
    );
  },

  async toHaveColumnValuesMatchingRegex(locator: Locator, columnHeader: string, regexPattern: string, headers?: string[]) {
    return assertWithHandling(
      locator,
      (tableData) => {
        toHaveColumnValuesToMatchRegex(tableData, columnHeader, regexPattern);
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
};

// Exports
import InteractiveDataFrame from './interactive-dataframe';
import { toPrettyPrint } from 'html-table-to-dataframe';
export { toPrettyPrint, toDataFrame, InteractiveDataFrame };

export default playwrightTables;
