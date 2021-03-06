"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomerRelatedProducts = exports.CustomerPosition = exports.Position = exports.Research = exports.CustomerResearch = exports.CustomerDepartment = exports.Department = exports.CustomerBuyerAccount = exports.BuyerAccount = exports.CustomerContractor = exports.CustomerHandler = exports.CustomerSetting = exports.InvoiceInfo = exports.Contact = exports.CustomerContacts = exports.CustomerContact = exports.OrganizationCustomer = exports.Organization = exports.Customer = void 0;
const uqs_1 = require("../uqs");
const customerPullWrite_1 = require("../../first/converter/customerPullWrite");
const config_1 = __importDefault(require("config"));
const logger_1 = require("../../tools/logger");
const timeAsQueue_1 = require("../../settings/timeAsQueue");
const promiseSize = config_1.default.get("promiseSize");
exports.Customer = {
    uq: uqs_1.uqs.jkCustomer,
    type: 'tuid',
    entity: 'Customer',
    key: 'CustomerID',
    mapper: {
        $id: 'CustomerID@Customer',
        no: "CustomerID",
        name: 'Name',
        firstName: 'FirstName',
        lastName: 'LastName',
        gender: 'Gender',
        salutation: 'Salutation',
        birthDay: 'BirthDate',
        createTime: 'CreateTime',
        isValid: 'IsValid',
        XYZ: 'XYZ',
    },
    pull: `select top ${promiseSize} ID, CustomerID, OrganizationID, Name, FirstName, LastName, XYZ, Gender, BirthDate, Tel1, Tel2, Mobile, Email as Email1, Email2
           , Fax1, Fax2, Zip, InvoiceTitle, TaxNo, RegisteredAddress, RegisteredTelephone, BankName, BankAccountNumber
           , SalesmanID, CustomerServiceStuffID, IsValid, SalesComanyID as SalesCompanyID, SalesRegionBelongsTo, CreateTime
           from ProdData.dbo.Export_Customer where ID > @iMaxId order by ID`,
    pullWrite: customerPullWrite_1.customerPullWrite,
    firstPullWrite: customerPullWrite_1.customerPullWrite,
};
exports.Organization = {
    uq: uqs_1.uqs.jkCustomer,
    type: 'tuid',
    entity: 'Organization',
    key: 'OrganizationID',
    mapper: {
        $id: 'OrganizationID@Organization',
        no: 'OrganizationID',
        name: 'Name',
        createTime: 'CreateTime',
    },
    pull: `select top ${promiseSize} ID, OrganizationID, UnitName as Name, CreateTime
           from ProdData.dbo.Export_Organization where ID > @iMaxId order by ID`,
    pullWrite: async (joint, uqIn, data) => {
        try {
            data["CreateTime"] = data["CreateTime"] && data["CreateTime"].getTime() / 1000; // dateFormat(data["CreateTime"], "yyyy-mm-dd HH:MM:ss");
            await joint.uqIn(exports.Organization, data);
            return true;
        }
        catch (error) {
            logger_1.logger.error(error);
            throw error;
        }
    }
};
exports.OrganizationCustomer = {
    uq: uqs_1.uqs.jkCustomer,
    type: 'map',
    entity: 'OrganizationCustomer',
    mapper: {
        organization: "OrganizationID@Organization",
        arr1: {
            customer: '^CustomerID@Customer',
        }
    }
};
exports.CustomerContact = {
    uq: uqs_1.uqs.jkCustomer,
    type: 'tuid-arr',
    entity: 'Customer_Contact',
    owner: 'CustomerID',
    key: 'ID',
    mapper: {
        $id: 'ID@Customer_Contact',
        type: 'TypeID',
        content: 'Content',
    }
};
exports.CustomerContacts = {
    uq: uqs_1.uqs.jkCustomer,
    type: 'map',
    entity: 'CustomerContacts',
    mapper: {
        customer: 'CustomerID@Customer',
        arr1: {
            contact: '^ID@Contact',
            isDefault: '^isDefault',
        }
    }
};
exports.Contact = {
    uq: uqs_1.uqs.jkCustomer,
    type: 'tuid',
    entity: 'Contact',
    key: 'ContactID',
    mapper: {
        $id: 'ContactID@Contact',
        name: 'Name',
        organizationName: 'OrganizationName',
        mobile: 'Mobile',
        telephone: 'Telephone',
        email: 'Email',
        addressString: 'Addr',
        address: "AddressID@Address",
    },
    pullWrite: customerPullWrite_1.contactPullWrite,
};
exports.InvoiceInfo = {
    uq: uqs_1.uqs.jkCustomer,
    type: 'tuid',
    entity: 'InvoiceInfo',
    key: 'CustomerID',
    mapper: {
        $id: 'CustomerID@InvoiceInfo',
        title: 'InvoiceTitle',
        taxNo: 'TaxNo',
        address: 'RegisteredAddress',
        telephone: 'RegisteredTelephone',
        bank: 'BankName',
        accountNo: 'BankAccountNumber',
        invoiceType: 'InvoiceType',
    },
};
exports.CustomerSetting = {
    uq: uqs_1.uqs.jkCustomer,
    type: 'map',
    entity: 'CustomerSetting',
    mapper: {
        customer: 'CustomerID@Customer',
        shippingContact: 'ShippingContactID@Contact',
        invoiceContact: 'InvoiceContactID@Contact',
        invoiceType: 'InvoiceTypeID@InvoiceType',
        invoiceInfo: 'InvoiceInfoID@InvoiceInfo',
    }
};
exports.CustomerHandler = {
    uq: uqs_1.uqs.jkCustomer,
    type: 'map',
    entity: 'CustomerHandler',
    mapper: {
        customer: 'CustomerID@Customer',
        salesman: 'SalesmanID@Employee',
        arr1: {
            customerServiceStuff: '^CustomerServiceStuffID@Employee',
        }
    }
};
/*
 * 这个比较特殊：该映射用于将内部的CID导入到Tonva系统
*/
exports.CustomerContractor = {
    uq: uqs_1.uqs.jkCustomer,
    type: 'map',
    entity: 'CustomerContractor',
    mapper: {
        customer: 'CustomerID@Customer',
        arr1: {
            contractor: '^ContractorID@Customer',
        }
    },
    pull: `select top ${promiseSize} ID, CustomerID, ContractorID, CreateTime
           from alidb.ProdData.dbo.Export_CustomerContractor where ID > @iMaxId order by ID`,
};
exports.BuyerAccount = {
    uq: uqs_1.uqs.jkCustomer,
    type: 'tuid',
    entity: 'BuyerAccount',
    key: 'BuyerAccountID',
    mapper: {
        $id: 'BuyerAccountID@BuyerAccount',
        no: "BuyerAccountID",
        organization: "OrganizationID@Organization",
        description: 'Name',
        createTime: 'CreateTime',
        isValid: 'IsValid',
    },
};
exports.CustomerBuyerAccount = {
    uq: uqs_1.uqs.jkCustomer,
    type: 'map',
    entity: 'CustomerBuyerAccount',
    mapper: {
        customer: 'CustomerID@Customer',
        arr1: {
            buyerAccount: '^BuyerAccountID@BuyerAccount',
        }
    },
    pull: pullCustomerBuyerAccount,
    pullWrite: async (joint, uqIn, data) => {
        data["CreateTime"] = data["CreateTime"] && data['CreateTime'].getTime() / 1000;
        await joint.uqIn(exports.BuyerAccount, data);
        await joint.uqIn(exports.CustomerBuyerAccount, data);
        return true;
    }
};
pullCustomerBuyerAccount.lastLenght = 0;
async function pullCustomerBuyerAccount(joint, uqIn, queue) {
    let sql = `select top --topn-- DATEDIFF(s, '1970-01-01', a.Update__time) as ID, a.MakeOrderCID as CustomerID, a.Contractor as BuyerAccountID
            , case when a.Invalid = 0 then '-' else '' end as [$]
            , c.UnitID as Organization, c.Name, c.FirstName, c.LastName
            , case c.C5 when 'xx' then 0 else 1 end as IsValid
            , c.creaDate as CreateTime
            from dbs.dbo.MakeOrderPersonAndContractorRelationship a
                 inner join dbs.dbo.Customers c on a.Contractor = c.CID
            where a.Update__time >= DATEADD(s, @iMaxId, '1970-01-01')
            order by a.Update__time`;
    try {
        let ret = await timeAsQueue_1.timeAsQueue(sql, queue, pullCustomerBuyerAccount.lastLenght);
        if (ret !== undefined) {
            pullCustomerBuyerAccount.lastLenght = ret.lastLength;
            return ret.ret;
        }
    }
    catch (error) {
        logger_1.logger.error(error);
        throw error;
    }
}
exports.Department = {
    uq: uqs_1.uqs.jkCustomer,
    type: "tuid",
    entity: "Department",
    key: "deptid",
    mapper: {
        $id: "deptid@Department",
        no: "deptid",
        name: "deptname",
        organization: "unitid@Organization"
    },
    pull: ` select top ${promiseSize} ID,  unitid, deptid, deptname
            from    ProdData.dbo.Export_Department
            where   ID > @iMaxId order by ID`
};
exports.CustomerDepartment = {
    uq: uqs_1.uqs.jkCustomer,
    type: 'map',
    entity: 'CustomerDepartment',
    mapper: {
        customer: 'customer@Customer',
        arr1: {
            department: '^deptid@Department',
        }
    },
    pull: ` select top ${promiseSize} ID, customer, deptid
            from    ProdData.dbo.Export_CustomerDepartment
            where   ID > @iMaxId order by ID`
};
exports.CustomerResearch = {
    uq: uqs_1.uqs.jkCustomer,
    type: 'map',
    entity: 'CustomerResearch',
    mapper: {
        customer: 'customer@Customer',
        arr1: {
            research: '^research@Research',
            createTime: '^createdate',
        }
    },
    pull: ` select top ${promiseSize} ID, customer, research, createdate, case IsDeleted when 1 then '-' else '' end as [$]
            from    ProdData.dbo.Export_ResearchDetail
            where   type = 'C' and ID > @iMaxId order by ID`
};
exports.Research = {
    uq: uqs_1.uqs.jkCustomer,
    type: "tuid",
    entity: "Research",
    key: "research",
    mapper: {
        customer: 'customer@Customer',
        mapper: {
            $id: "research@Research",
            no: "research",
            name: "researchname",
            createTime: "createdate"
        },
    },
    pull: ` select top ${promiseSize} ID, research, researchname, createdate
            from    ProdData.dbo.Export_Research
            where   type = 'C' and ID > @iMaxId order by ID`
};
exports.Position = {
    uq: uqs_1.uqs.jkCustomer,
    type: "tuid",
    entity: "Position",
    key: "research",
    mapper: {
        $id: "research@Position",
        no: "research",
        name: "researchname"
    },
    pull: ` select top ${promiseSize} ID, research, researchname
            from    ProdData.dbo.Export_Research
            where   type = 'B' and ID > @iMaxId order by ID`
};
exports.CustomerPosition = {
    uq: uqs_1.uqs.jkCustomer,
    type: 'map',
    entity: 'CustomerPosition',
    mapper: {
        customer: 'customer@Customer',
        arr1: {
            research: '^research@Research',
        }
    },
    pull: ` select top ${promiseSize}ID,  customer,research
            from    ProdData.dbo.Export_ResearchDetail
            where   type = 'B' and ID > @iMaxId order by ID`
};
exports.CustomerRelatedProducts = {
    uq: uqs_1.uqs.jkCustomer,
    type: 'map',
    entity: 'CustomerRelatedProducts',
    mapper: {
        customer: 'customer@Customer',
        arr1: {
            product: '^product@ProductX',
            sort: 'ID',
        }
    },
    pull: ` select  top ${promiseSize}ID,  customer, product
            from    ProdData.dbo.Export_CustomerProduct
            where   ID > @iMaxId order by ID`
};
//# sourceMappingURL=customer.js.map