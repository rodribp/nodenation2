import { openModal } from "./helpers/modals.js";
import { getWalletDetails, createInvoice, checkInvoice, decodeInvoice, payInvoice } from "./helpers/api.js";

const getBalance = async () => {
    const walletDetails = await getWalletDetails();
    
    document.getElementById('balance').innerHTML = `${walletDetails.balance / 1000} SATS`
}
 
document.addEventListener('DOMContentLoaded', async (e) => {
    getBalance();
})

//buttons
const genInvoiceButton = document.getElementById('generate-invoice-button');
const readInvoiceButton = document.getElementById('read-invoice-button');
const payInvoiceButton = document.getElementById('pay-invoice-button');
const closeInvoiceModal = document.getElementById('close-pay-modal');

//modals
const showInvoiceModal = document.getElementById('show-invoice-modal');
const payInvoiceModal = document.getElementById('pay-invoice-modal');

//fields
const createInvoiceAmount = document.getElementById('create-invoice-amount');
const createInvoiceMemo = document.getElementById('create-invoice-memo');
const invoiceSlot = document.getElementById('invoice-slot');
const readInvoicePasted = document.getElementById('invoice-pasted');
const amountDetails = document.getElementById('amount-details');
const memoDetails = document.getElementById('memo-details');

//confirmation
const inPaid = document.getElementById('confirmation-invoice-in-paid');
const outPaid = document.getElementById('confirmation-invoice-out-paid');

genInvoiceButton.addEventListener('click', async (e) => {
    if (createInvoiceAmount.value === null || createInvoiceAmount.value === '' || isNaN(createInvoiceAmount.value) || createInvoiceMemo.value === null || createInvoiceMemo.value === '') {
        alert('Los campos de cantidad y memo no pueden quedar vacíos')
        return;
    };

    const invoice = await createInvoice(createInvoiceAmount.value, createInvoiceMemo.value);
    const bolt11 = invoice.payment_request;
    const hash = invoice.payment_hash;

    invoiceSlot.innerHTML = bolt11;

    const interval = setInterval(async () => {
        const status = await checkInvoice(hash);

        if (status.paid) {
            clearInterval(interval);
            getBalance();
            inPaid.classList.remove('hidden');
            invoiceSlot.classList.add('hidden');
        }
    }, 3000)

    openModal(showInvoiceModal);
})

readInvoiceButton.addEventListener('click', async (e) => {
    if (readInvoicePasted.value === null || readInvoicePasted.value === '') {
        alert('El campo de la factura no puede quedar vacío');
        return;
    }

    const bolt11 = readInvoicePasted.value;
    const invoiceDetails = await decodeInvoice(bolt11);

    if (invoiceDetails.message) {
        alert(invoiceDetails.message);
        return;
    }
    sessionStorage.setItem('bolt11', bolt11);
    amountDetails.innerHTML = invoiceDetails.amount_msat / 1000;
    memoDetails.innerHTML = invoiceDetails.description;

    openModal(payInvoiceModal);
})

payInvoiceButton.addEventListener('click', async (e) => {    
    const status = await payInvoice(sessionStorage.getItem('bolt11'));

    if (status.checking_id) {
        sessionStorage.clear();
        getBalance();

        e.target.classList.add('hidden');
        closeInvoiceModal.classList.remove('hidden');
        document.getElementById('details-invoice-out').classList.add('hidden');
        outPaid.classList.remove('hidden');
    }
})