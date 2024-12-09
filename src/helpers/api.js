// Archivo para tener los metodos que manejarán la API

const URL = 'http://127.0.0.1:5000/';
const ADMIN_KEY = '154ccc9c606a437585c1d0459cf7098f';
const INVOICE_KEY = '4ddb9e7599b54a4e89f88e60fb7993af';

async function fetchData(action, type, key, body) {
    const response = await fetch(URL + 'api/v1/' + action, {
        method: type,
        headers: {
            "X-Api-Key": key,
            "Content-Type": "application/json"
        },
        body: JSON.stringify(body)
    })

    const data = await response.json();

    return data;
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
    const data = await fetchData('payments/' + hash, 'GET', INVOICE_KEY);

    return data;
}

export const decodeInvoice = async (bolt11) => {
    const data = await fetchData('payments/decode', 'POST', null, {
        data: bolt11
    })

    return data;
}

export const payInvoice = async (bolt11) => {
    const data = await fetchData('payments', 'POST', ADMIN_KEY, {
        bolt11: bolt11
    })

    return data;
}