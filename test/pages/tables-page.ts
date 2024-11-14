import { Locator, Page } from "@playwright/test";
import { TablesBasePage } from "./base-page";
import { InteractiveDataFrame } from "../../src/interactive-dataframe";

export class TablePage extends TablesBasePage {
    readonly table2Locator: Locator;
    readonly table4Locator: Locator;
    readonly table2: InteractiveDataFrame;
    readonly table4: InteractiveDataFrame;
    
    constructor(public override readonly page: Page) {
        super(page);
        this.table2Locator = this.page.getByTestId("table2");
        this.table2 = new InteractiveDataFrame(this.page, this.table2Locator, "data-test-id");
        this.table4Locator = this.page.getByTestId("table4");
        this.table4 = new InteractiveDataFrame(this.page, this.table4Locator, "data-test-id");
    }
}