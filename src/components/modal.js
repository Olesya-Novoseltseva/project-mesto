import { hideInputError } from './validation';

export function openModal(popup) {
    popup.classList.add('popup_is-opened');

    // Очищаем ошибки валидации
    const form = popup.querySelector('form');
    if (form) {
        const inputs = form.querySelectorAll('input');
        inputs.forEach(input => {
            hideInputError(form, input, {
                inputErrorClass: 'popupinput_type_error',
                errorClass: 'popuperror_visible'
            });
        })
}
}

export function closeModal(popup) {
    popup.classList.remove('popup_is-opened');
}