import { Page } from "@playwright/test";
import { TablesBasePage } from "./base-page";
import { InteractiveDataFrame } from "../../src/interactive-dataframe";

export class TablePage extends TablesBasePage {
    readonly table1: InteractiveDataFrame;
    readonly table2: InteractiveDataFrame;
    readonly table3: InteractiveDataFrame;
    
    constructor(public override readonly page: Page) {
        super(page);
        this.table1 = new InteractiveDataFrame(this.page, this.page.getByTestId("table1"));
        this.table2 = new InteractiveDataFrame(this.page, this.page.getByTestId("table2"));
        this.table3 = new InteractiveDataFrame(this.page, this.page.getByTestId("table3"));
    }
}