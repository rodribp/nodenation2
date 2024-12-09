// Archivo para tener los metodos que manejarán la API
const DOMAIN = 'http://127.0.0.1:5000/';
const URL = DOMAIN + 'api/v1/';
const ADMIN_KEY = '154ccc9c606a437585c1d0459cf7098f';
const INVOICE_KEY = '4ddb9e7599b54a4e89f88e60fb7993af';

//función para consultar a la api de LNBits
const fetchData = async (action, method, key, body) => {
    const response = await fetch(URL + action,
        {
            method: method,
            headers: {
                "X-Api-Key": key,
                "Content-Type": "application/json"
            },
            body: JSON.stringify(body)
        }
    )
    const result = await response.json();
    return result;
}

export const getWalletDetails = async () => {
    const data = await fetchData('wallet', 'GET', INVOICE_KEY);

    return data;
}

export const createInvoice = async (amount, memo) => {
    const data = await fetchData('payments', 'POST', INVOICE_KEY, {
        out: false,
        amount: amount,
        memo: memo,
        expiry: 3600
    })

    return data;
}

export const checkInvoice = async (hash) => {
    const data = await fetchData(`payments/${hash}`, 'GET', INVOICE_KEY);

    return data;
}

export const decodeInvoice = async (bolt) => {
    const data = await fetchData('payments/decode', 'POST', null, {
        data: bolt
    })

    return data;
}

export const payInvoice = async (bolt) => {
    const data = await fetchData('payments', 'POST', ADMIN_KEY, {
        out: true,
        bolt11: bolt
    })

    return data;
}