import { MapperBase } from "./mapper";

export type ConvertId = (prop:string, value:any) => Promise<{p:string, val:any}>;

export async function convert(data:any, mapper:MapperBase, convertId: ConvertId):Promise<any> {
    let body:any = {};
    let {$import} = data;
    if ($import === 'all') {
        for (let i in data) {
            let prop = mapper[i];
            let value = data[i];
            switch (typeof prop) {
            case 'undefined':
                body[i] = value;
                break;
            case 'boolean':
                if (prop === true) {
                    body[i] = value;
                }
                else {                    
                }
                break;
            case 'string':
                //await setFromProp(body, prop, value);
                let {p, val} = await convertId(prop, value);
                body[p] = val;
                break;
            case 'object':
                let arr = prop.$name || i;
                body[arr] = await convert(value, prop, convertId)
                break;
            }
        }
    }
    else {
        for (let i in mapper) {
            if (i.substr(0, 1) === '$') continue;
            let prop = mapper[i];
            let value = data[i];
            switch (typeof prop) {
            case 'boolean':
                if (prop === true) {
                    body[i] = value;
                }
                else {
                }
                break;
            case 'string':
                //await setFromProp(body, prop, value);
                let {p, val} = await convertId(prop, value);
                body[p] = val;
                break;
            case 'object':
                let arr = prop.$name || i;
                body[arr] = await convert(value, prop, convertId)
                break;
            }
        }
    }
    return body;
}
