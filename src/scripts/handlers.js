import { placesList, newCardTitle, newCardImage, cardPopup, profileNameInput, profileDescriptionInput, profileName, profileDescription, currentUserId } from './index.js';
import { closeModal } from './modal.js';
import { createCard } from './card.js';
import { addNewCard, updateUserInfo, updateUserAvatar } from './api.js';

const profileImage = document.querySelector('.profile__image');

export function handleCardFormSubmit(evt) {
  evt.preventDefault();

  const newCardData = {
    name: newCardTitle.value,
    link: newCardImage.value,
  };

  addNewCard(newCardData)
    .then(cardData => {
      const card = createCard(cardData, currentUserId);
      placesList.prepend(card);
      closeModal(cardPopup);
    })
    .catch(err => {
      console.error('Ошибка при добавлении карточки:', err);
      alert('Не удалось добавить карточку');
    });
}


export function handleProfileFormSubmit(evt) {
    evt.preventDefault();

    const newName = profileNameInput.value;
    const newAbout = profileDescriptionInput.value;

    updateUserInfo({ name: newName, about: newAbout })
      .then((user) => {
        profileName.textContent = user.name;
        profileDescription.textContent = user.about;
        closeModal(profilePopup);
      })
      .catch(err => console.error('Ошибка при обновлении профиля:', err));
}


export function handleAvatarFormSubmit(evt) {
  evt.preventDefault();
  const form = evt.target;
  const avatarLink = form.avatar.value;

  updateUserAvatar(avatarLink)
    .then(user => {
      profileImage.style.backgroundImage = `url(${user.avatar})`;
      closeModal(document.querySelector('.popup_type_edit-avatar'));
    })
    .catch(err => {
      console.error('Ошибка при обновлении аватара:', err);
      alert('Не удалось обновить аватар. Убедитесь, что введена корректная ссылка.');
    });
}