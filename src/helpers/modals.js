//buttons
const receiveButton = document.getElementById('receive-button');
const sendButton = document.getElementById('send-button');

//modals
const generateInvoiceModal = document.getElementById('create-invoice-modal');
const pasteInvoiceModal = document.getElementById('paste-invoice-modal');
// archivo js para manejar los modals
document.addEventListener('DOMContentLoaded', () => {
    const modals = document.querySelectorAll('.modal');

    modals.forEach((modal) => {
        // Encuentra todos los botones que cierran este modal
        const closeButtons = modal.querySelectorAll('[data-modal-close]');

        closeButtons.forEach((button) => {
            button.addEventListener('click', () => {
                const modalId = button.getAttribute('data-modal-close');
                const modalToClose = document.getElementById(modalId);

                if (modalToClose) {
                    modalToClose.classList.add('hidden'); // Agrega la clase `hidden` para ocultar el modal
                }

                document.getElementById('amount-details').innerHTML = ''
                document.getElementById('memo-details').innerHTML = ''
                document.getElementById('invoice-pasted').value = ''
                document.getElementById('invoice-slot').innerHTML = ''
                document.getElementById('pay-invoice-button').classList.remove('hidden');
                document.getElementById('close-pay-modal').classList.add('hidden');
                document.getElementById('details-invoice-out').classList.remove('hidden');
                document.getElementById('confirmation-invoice-out-paid').classList.add('hidden');
                document.getElementById('invoice-slot').classList.remove('hidden');
                document.getElementById('confirmation-invoice-in-paid').classList.add('hidden');
            });
        });
    });
});

export function openModal(modalElement) {
    if(modalElement) {
        modalElement.classList.remove('hidden');
        return;
    }

    console.error(`Modal element ${modal} not found.`)
}

sendButton.addEventListener('click', (e) => {
    openModal(pasteInvoiceModal);
})

receiveButton.addEventListener('click', (e) => {
    openModal(generateInvoiceModal);
})