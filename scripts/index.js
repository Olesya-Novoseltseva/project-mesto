import { initialCards } from './cards.js';

const cardTemplate = document.querySelector('#card-template').content;
const placesList = document.querySelector('.places__list');

const profilePopup = document.querySelector('.popup_type_edit');
const cardPopup = document.querySelector('.popup_type_new-card');
const imagePopup = document.querySelector('.popup_type_image');

const profileName = document.querySelector('.profile__title');
const profileDescription = document.querySelector('.profile__description');
const profileNameInput = profilePopup.querySelector('.popup__input_type_name');
const profileDescriptionInput = profilePopup.querySelector('.popup__input_type_description');
const profileForm = profilePopup.querySelector('.popup__form');
const saveButton = profileForm.querySelector('.popup__button');

const popupImage = document.querySelector('.card__image');
const popupCaption = imagePopup.querySelector('.popup__caption');
const newCardTitle = document.querySelector('.popup__input_type_card-name');
const newCardImage = document.querySelector('.popup__input_type_url');
const cardFormElement = cardPopup.querySelector('.popup__form');

const popups = document.querySelectorAll('.popup');
popups.forEach(popup => popup.classList.add('popup_is-animated'));

function createCard(cardData) {
    const cardElement = cardTemplate.children[0].cloneNode(true);
    const cardImage = cardElement.querySelector('.card__image');
    const cardTitle = cardElement.querySelector('.card__title');
    const cardLikeButton = cardElement.querySelector('.card__like-button');
    const cardDeleteButton = cardElement.querySelector('.card__delete-button');

    cardImage.src = cardData.link;
    cardImage.alt = cardData.name;
    cardTitle.textContent = cardData.name;

    cardLikeButton.addEventListener('click', () => {
        cardLikeButton.classList.toggle('card__like-button_is-active');
    });

    cardDeleteButton.addEventListener('click', () => {
        const cardToRemove = cardDeleteButton.closest('.card');
        cardToRemove.remove();
    });

    cardImage.addEventListener('click', () => {
        const popupImage = imagePopup.querySelector('.popup__image');
        const popupCaption = imagePopup.querySelector('.popup__caption');
        popupImage.src = cardData.link;
        popupImage.alt = cardData.name;
        popupCaption.textContent = cardData.name;
        openModal(imagePopup);
    });

    return cardElement;
}

initialCards.forEach((cardData) => {
    const card = createCard(cardData); 
    placesList.prepend(card);
});

function openModal(popup) {
    popup.classList.add('popup_is-opened');
}

function closeModal(popup) {
    popup.classList.remove('popup_is-opened');
}

popups.forEach((popup) => {
  popup.addEventListener('mousedown', (evt) => {
    if (evt.target === popup) {
      closeModal(popup);
    }
  });
});

document.addEventListener('keydown', (evt) => {
  if (evt.key === 'Escape') {
    const openedPopup = document.querySelector('.popup_is-opened');
    if (openedPopup) {
      closeModal(openedPopup);
    }
  }
});

function validateURL(url) {
  try {
    new URL(url);
    return true;
  } catch (e) {
    return false;
  }
}

function validateCardForm() {
  const cardSaveButton = cardFormElement.querySelector('.popup__button');

  if (newCardTitle.value.length < 2 || newCardTitle.value.length > 40) {
    newCardTitle.setCustomValidity("Длина названия должна быть от 2 до 40 символов.");
  } else {
    newCardTitle.setCustomValidity(""); // Сбрасываем пользовательскую валидацию
  }
  if (validateURL(newCardImage.value)){
    newCardImage.setCustomValidity(""); // Сбрасываем пользовательскую валидацию
  }else{
    newCardImage.setCustomValidity("Введите корректную ссылку.");
  }

  const isTitleValid = newCardTitle.validity.valid;
  const isLinkValid = newCardImage.validity.valid;

  // Управление кнопкой
  if (isTitleValid && isLinkValid) {
    cardSaveButton.disabled = false;
    cardSaveButton.style.backgroundColor = ''; // Возвращаем стандартный цвет
  } else {
    cardSaveButton.disabled = true;
    cardSaveButton.style.backgroundColor = '#C4C4C4'; // Цвет неактивной кнопки
  }

  // Сообщения об ошибках
  document.getElementById('card-name-error').textContent =
    newCardTitle.value ? newCardTitle.validationMessage : '';
  document.getElementById('url-error').textContent =
    newCardImage.value ? newCardImage.validationMessage : '';
}

// Обработчики событий
newCardTitle.addEventListener('input', validateCardForm);
newCardImage.addEventListener('input', validateCardForm);


// Функция для проверки валидности формы
function validateProfile() {
  // Валидация имени
  if (profileNameInput.value.length < 2 || profileNameInput.value.length > 40) {
    profileNameInput.setCustomValidity("Длина имени должна быть от 2 до 40 символов.");
  } else {
    profileNameInput.setCustomValidity(""); // Сбрасываем пользовательскую валидацию
  }

  // Валидация описания
  if (profileDescriptionInput.value.length < 2 || profileDescriptionInput.value.length > 200) {
    profileDescriptionInput.setCustomValidity("Длина описания должна быть от 2 до 200 символов.");
  } else {
    profileDescriptionInput.setCustomValidity(""); // Сбрасываем пользовательскую валидацию
  }

  const isNameValid = profileNameInput.validity.valid;
  const isDescriptionValid = profileDescriptionInput.validity.valid;

  // Включаем или выключаем кнопку "Сохранить"
  if (isNameValid && isDescriptionValid) {
    saveButton.disabled = false;
    saveButton.style.backgroundColor = ''; // Возвращаем стандартный цвет
  } else {
    saveButton.disabled = true;
    saveButton.style.backgroundColor = '#C4C4C4'; // Цвет неактивной кнопки
  }

  // Отображение сообщений об ошибках
  document.getElementById('name-error').textContent = profileNameInput.value ? profileNameInput.validationMessage : '';
  document.getElementById('description-error').textContent = profileDescriptionInput.value ? profileDescriptionInput.validationMessage : '';
}

// Добавляем слушатели событий на поля ввода
profileNameInput.addEventListener('input', validateProfile);
profileDescriptionInput.addEventListener('input', validateProfile);


// Открытие попапа редактирования профиля
const editButton = document.querySelector('.profile__edit-button');
editButton.addEventListener('click', () => {
    profileNameInput.value = profileName.textContent;
    profileDescriptionInput.value = profileDescription.textContent;
    openModal(profilePopup);
});

// Инициализация состояния кнопки при загрузке страницы
validateProfile();

// Закрытие попапа редактирования профиля
const closeEditButton = profilePopup.querySelector('.popup__close');
closeEditButton.addEventListener('click', () => {
  closeModal(profilePopup);
});

function handleProfileFormSubmit(evt) {
    evt.preventDefault();
    profileName.textContent = profileNameInput.value;
    profileDescription.textContent = profileDescriptionInput.value;
    closeModal(profilePopup);
}

const addButton = document.querySelector('.profile__add-button');
addButton.addEventListener('click', () => {
    newCardTitle.value = newCardTitle.textContent;
    newCardImage.value = newCardImage.textContent;
    openModal(cardPopup);
    validateCardForm();
});


const closeCardButton = cardPopup.querySelector('.popup__close');
closeCardButton.addEventListener('click', () => {
  closeModal(cardPopup);
});

function handleCardFormSubmit(evt) {
    evt.preventDefault();
    const newCardData = {
        name: newCardTitle.value,
        link: newCardImage.value,
    };
    const newCard = createCard(newCardData);
    placesList.prepend(newCard);
    closeModal(cardPopup);
}

// Закрытие попапа картинки
const closeImageButton = imagePopup.querySelector('.popup__close');
closeImageButton.addEventListener('click', () => {
    closeModal(imagePopup);
});

profileForm.addEventListener('submit', handleProfileFormSubmit); 
cardFormElement.addEventListener('submit', handleCardFormSubmit);




