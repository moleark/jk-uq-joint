import * as _ from 'lodash';
import { UqInTuid, UqInMap, UqInTuidArr, Joint, UqIn, DataPullResult } from "uq-joint";
import { uqs } from "../uqs";
import { customerPullWrite, contactPullWrite } from '../../first/converter/customerPullWrite';
import config from 'config';
import { logger } from '../../tools/logger';
import { uqOutRead } from "../../first/converter/uqOutRead";
import { timeAsQueue } from '../../settings/timeAsQueue';

const promiseSize = config.get<number>("promiseSize");

export const Customer: UqInTuid = {
    uq: uqs.jkCustomer,
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
    pullWrite: customerPullWrite,
    firstPullWrite: customerPullWrite,
};

export const Organization: UqInTuid = {
    uq: uqs.jkCustomer,
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
    pullWrite: async (joint: Joint, uqIn: UqIn, data: any) => {
        try {
            data["CreateTime"] = data["CreateTime"] && data["CreateTime"].getTime() / 1000; // dateFormat(data["CreateTime"], "yyyy-mm-dd HH:MM:ss");
            await joint.uqIn(Organization, data);
            return true;
        } catch (error) {
            logger.error(error);
            throw error;
        }
    }
};

export const OrganizationCustomer: UqInMap = {
    uq: uqs.jkCustomer,
    type: 'map',
    entity: 'OrganizationCustomer',
    mapper: {
        organization: "OrganizationID@Organization",
        arr1: {
            customer: '^CustomerID@Customer',
        }
    }
};

export const CustomerContact: UqInTuidArr = {
    uq: uqs.jkCustomer,
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

export const CustomerContacts: UqInMap = {
    uq: uqs.jkCustomer,
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

export const Contact: UqInTuid = {
    uq: uqs.jkCustomer,
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
    pullWrite: contactPullWrite,
};

export const InvoiceInfo: UqInTuid = {
    uq: uqs.jkCustomer,
    type: 'tuid',
    entity: 'InvoiceInfo',
    key: 'CustomerID',  // CustomerID作为InvoiceInfo的ID
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

export const CustomerSetting: UqInMap = {
    uq: uqs.jkCustomer,
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

export const CustomerHandler: UqInMap = {
    uq: uqs.jkCustomer,
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
export const CustomerContractor: UqInMap = {
    uq: uqs.jkCustomer,
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

export const BuyerAccount: UqInTuid = {
    uq: uqs.jkCustomer,
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

export const CustomerBuyerAccount: UqInMap = {
    uq: uqs.jkCustomer,
    type: 'map',
    entity: 'CustomerBuyerAccount',
    mapper: {
        customer: 'CustomerID@Customer',
        arr1: {
            buyerAccount: '^BuyerAccountID@BuyerAccount',
        }
    },
    pull: pullCustomerBuyerAccount,
    pullWrite: async (joint: Joint, uqIn: UqIn, data: any) => {
        data["CreateTime"] = data["CreateTime"] && data['CreateTime'].getTime() / 1000;
        await joint.uqIn(BuyerAccount, data);
        await joint.uqIn(CustomerBuyerAccount, data);
        return true;
    }
};

pullCustomerBuyerAccount.lastLenght = 0;
async function pullCustomerBuyerAccount(joint: Joint, uqIn: UqIn, queue: number): Promise<DataPullResult> {
    let sql = `select top --topn-- DATEDIFF(s, '1970-01-01', a.Update__time) as ID, a.MakeOrderCID as CustomerID, a.Contractor as BuyerAccountID
            , case when a.Invalid = 0 then '-' else '' end as [$]
            , c.UnitID as Organization, c.Name, c.FirstName, c.LastName
            , case c.C5 when 'xx' then 0 else 1 end as IsValid
            , c.creaDate as CreateTime
            from dbs.dbo.MakeOrderPersonAndContractorRelationship a
                 inner join dbs.dbo.Customers c on a.Contractor = c.CID
            where a.Update__time >= DATEADD(s, @iMaxId, '1970-01-01')
            order by a.Update__time`
    try {
        let ret = await timeAsQueue(sql, queue, pullCustomerBuyerAccount.lastLenght);
        if (ret !== undefined) {
            pullCustomerBuyerAccount.lastLenght = ret.lastLength;
            return ret.ret;
        }
    } catch (error) {
        logger.error(error);
        throw error;
    }
}

export const Department: UqInTuid = {
    uq: uqs.jkCustomer,
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

export const CustomerDepartment: UqInMap = {
    uq: uqs.jkCustomer,
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

export const CustomerResearch: UqInMap = {
    uq: uqs.jkCustomer,
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

export const Research: UqInTuid = {
    uq: uqs.jkCustomer,
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


export const Position: UqInTuid = {
    uq: uqs.jkCustomer,
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

export const CustomerPosition: UqInMap = {
    uq: uqs.jkCustomer,
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


export const CustomerRelatedProducts: UqInMap = {
    uq: uqs.jkCustomer,
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