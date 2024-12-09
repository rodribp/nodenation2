import { openModal } from "./helpers/modals.js";
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
const memoDetails = document.getElementById('memoDetails');

//confirmation
const inPaid = document.getElementById('confirmation-invoice-in-paid');
const outPaid = document.getElementById('confirmation-invoice-out-paid');

genInvoiceButton.addEventListener('click', (e) => {
    openModal(showInvoiceModal);
})

readInvoiceButton.addEventListener('click', (e) => {
    openModal(payInvoiceModal);
})

payInvoiceButton.addEventListener('click', (e) => {
    e.target.classList.add('hidden');
    closeInvoiceModal.classList.remove('hidden');
    document.getElementById('details-invoice-out').classList.add('hidden');
    outPaid.classList.remove('hidden');
})