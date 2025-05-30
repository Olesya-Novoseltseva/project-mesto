import { currentUserId } from '../index.js';
import { closeModal } from './modal.js';
import { createCard } from './card.js';
import { addNewCard, updateUserInfo, updateUserAvatar } from './api.js';
import { validationSettings } from '../index.js';

const profileImage = document.querySelector('.profile__image');

function setLoading(button, isLoading, defaultText = 'Сохранить') {
  if (isLoading) {
    button.textContent = 'Сохранение...';
  } else {
    button.textContent = defaultText;
  }
}

function toggleFormLock(form, isLocked) {
  const inputs = form.querySelectorAll('input, textarea, button');
  inputs.forEach(input => {
    input.disabled = isLocked;
  });
}

export function handleCardFormSubmit(evt) {
  evt.preventDefault();
  const form = evt.target;
  const submitButton = form.querySelector('.popup__button');

  toggleFormLock(form, true); // Блокируем всю форму
  setLoading(submitButton, true);

  addNewCard({ 
    name: form.title.value, 
    link: form.link.value 
  })
    .then(cardData => {
      const card = createCard(cardData, currentUserId);
      document.querySelector('.places__list').prepend(card);
      form.reset(); // Очищаем форму
      closeModal(form.closest('.popup'));
    })
    .catch(err => {
      console.error('Ошибка добавления карточки:', err);
    })
    .finally(() => {
      toggleFormLock(form, false); // Разблокируем форму
      setLoading(submitButton, false);
    });
}


export function handleProfileFormSubmit(evt) {
  evt.preventDefault();
  const form = evt.target;
  const submitButton = form.querySelector('.popup__button');

  toggleFormLock(form, true); // Блокируем всю форму
  setLoading(submitButton, true);

  updateUserInfo({ 
    name: form.name.value, 
    about: form.description.value 
  })
    .then(user => {
      document.querySelector('.profile__title').textContent = user.name;
      document.querySelector('.profile__description').textContent = user.about;
      closeModal(form.closest('.popup'));
    })
    .catch(err => {
      console.error('Ошибка обновления профиля:', err);
    })
    .finally(() => {
      toggleFormLock(form, false); //  Разблокируем форму
      setLoading(submitButton, false);
    });
}


export function handleAvatarFormSubmit(evt) {
  evt.preventDefault();
  const form = evt.target;
  const submitButton = form.querySelector('.popup__button');
  const urlInput = form.querySelector('input[name="avatar"]'); // Изменён селектор
  
  if (!urlInput) {
    console.error('Не найдено поле для ввода URL аватара');
    return;
  }

  const avatarUrl = urlInput.value.trim();

  // Блокируем форму
  toggleFormLock(form, true);
  setLoading(submitButton, true);

  updateUserAvatar(avatarUrl)
    .then(userData => {
      profileImage.style.backgroundImage = `url(${userData.avatar})`;
      form.reset();
      closeModal(form.closest('.popup'));
    })
    .catch(err => {
      console.error('Ошибка при обновлении аватара:', err);
      showInputError(form, urlInput, 'Не удалось обновить аватар', validationSettings);
    })
    .finally(() => {
      toggleFormLock(form, false);
      setLoading(submitButton, false);
    });
}