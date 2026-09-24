import { Response } from "../../Core/interfaces/response.interface"

export type Supplier ={
    acc_id: number
    accgasstationid: number
    accountcode_code: string
    cif: string
    city: string
    country: string
    gasstationid: number
    postalcode: string
    state: string
    suppliercompanyname: string
}



export type Model ={
    id: number;
    supplier_id: string;
    dte_type: string;
    model_type: string;
    active: boolean;
    acc_id: number;
    is_multiple: boolean;
    model_name: string;
    model_order: number;
}



export type ResponseModel  = Omit<Response<Model[]>, 'data'> & {
    data: Model[];
}

export type ResponseSupplier  = Omit<Response<Supplier[]>, 'data'> & {
    data: Supplier[];
}