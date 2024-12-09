import { openModal } from "./helpers/modals.js";
import { getWalletDetails, createInvoice, checkInvoice, decodeInvoice, payInvoice } from "./helpers/api.js";

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

const updateBalance = async () => {
    const walletDetails = await getWalletDetails();

    document.getElementById('balance-wallet').innerHTML = walletDetails.balance / 1000 + ' SATS'
}

//Cuando el documento carga
document.addEventListener('DOMContentLoaded', async (e) => {
    updateBalance();
})

genInvoiceButton.addEventListener('click', async (e) => {
    if (createInvoiceAmount.value === null || createInvoiceAmount.value === '' || createInvoiceMemo.value === null || createInvoiceMemo.value === '') {
        alert('Los campos de cantidad y memo no pueden quedar vacíos');
        return;
    }

    const invoice = await createInvoice(createInvoiceAmount.value, createInvoiceMemo.value);

    invoiceSlot.innerHTML = invoice.payment_request;
    
    const interval = setInterval(async () => {
        const status = await checkInvoice(invoice.payment_hash);

        if (status.paid) {
            clearInterval(interval);
            updateBalance();
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

    const invoice = await decodeInvoice(bolt11);

    if (invoice.message) {
        alert(invoice.message);
        return;
    }

    amountDetails.innerHTML = invoice.amount_msat / 1000;
    memoDetails.innerHTML = invoice.description;

    sessionStorage.setItem('bolt11', bolt11);

    openModal(payInvoiceModal);
})

payInvoiceButton.addEventListener('click', async (e) => {
    const status = await payInvoice(sessionStorage.getItem('bolt11'));

    if (status.checking_id) {
        updateBalance();

        e.target.classList.add('hidden');
        closeInvoiceModal.classList.remove('hidden');
        document.getElementById('details-invoice-out').classList.add('hidden');
        outPaid.classList.remove('hidden');
    }
})