import { Locator, Page } from "@playwright/test";
import InteractiveDataFrame from "../../src/interactive-dataframe";

export class TablesBasePage {
    constructor(public readonly page: Page) {}
}