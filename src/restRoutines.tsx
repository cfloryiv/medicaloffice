
import API from './api';

async function getNameFromAddress(id: string) {
    let name;
    let promise = await getAddressPromise(id);
    let address = await promise[0];
    if (address === undefined) {
        name = await id;
    } else {
        name = await address.name;
    }
    return name;
}
function getAddressPromise(id: string): any {
    return API.get(`api/dental/addresses?userid=${id}`)
        .then((res) => {
            return res.data;
        })
}
async function getInsuranceFromName(name: string) {
    let insurance;
    let promise = await getInsurance(name);
    insurance = await promise[0];
    return insurance;
}
function getInsurance(name: string): any {
    return API.get(`api/dental/insurances?name=${name}`)
        .then(res=> {
            return res.data;
        })
}

export { getNameFromAddress, getInsuranceFromName }