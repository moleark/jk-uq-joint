import _ from 'lodash';
import { UqBus, DataPush, Joint } from "uq-joint";
import { execSql } from '../../mssql/tools';


/**
 * 客户当前销售导入内部系统
 */
export const faceAssistCustomerNowSales: UqBus = {
    face: '百灵威系统工程部/SalesTask/assistCustomerNowSales',
    from: 'local',
    mapper: {
        customer: "customer@Customer",
        webuser: 'webuser',
        sales: "sales",
        createdate: 'createdate',
    },
    push: async (joint: Joint, uqBus: UqBus, queue: number, data: any): Promise<boolean> => {
        let { customer, webuser, sales, createdate } = data;
        var myDate = new Date();
        createdate = createdate ? createdate : myDate.toLocaleString();
        await execSql(`exec dbs.dbo.updateTonvaCustomerNowSale @Customer, @WebUser, @Sales, @StartDate;`, [
            { 'name': 'Customer', 'value': customer },
            { 'name': 'WebUser', 'value': webuser },
            { 'name': 'Sales', 'value': sales },
            { 'name': 'StartDate', 'value': createdate },
        ])
        return true;
    }
};
