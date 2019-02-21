import { Joint } from "../../uq-joint";
import * as _ from 'lodash';
import { Product, ProductX, ProductChemical } from "../../settings/in/product";

export async function productPullWrite(joint: Joint, data: any) {

    try {
        await joint.uqIn(Product, _.pick(data, ["ID", "BrandID", "ProductNumber", "Description", "DescriptionC"]));
        await joint.uqIn(ProductX, _.pick(data, ["ID", "BrandID", "ProductNumber", "Description", "DescriptionC"]));
        await joint.uqIn(ProductChemical, _.pick(data, ["ID", "ChemicalID", "Purity", "CAS", "MolecularFomula", "MolecularWeight"]));
        return true;
    } catch (error) {
        console.error(error);
        return false;
    }
}