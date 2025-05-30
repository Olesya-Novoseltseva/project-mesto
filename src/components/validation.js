function showInputError(formElement, inputElement, errorMessage, settings) {
  const errorElement = formElement.querySelector(`#${inputElement.name}-error`);
  inputElement.classList.add(settings.inputErrorClass);
  errorElement.textContent = errorMessage;
  errorElement.classList.add(settings.errorClass);
}

export function hideInputError(formElement, inputElement, settings) {
  const errorElement = formElement.querySelector(`#${inputElement.name}-error`);
  inputElement.classList.remove(settings.inputErrorClass);
  errorElement.textContent = '';
  errorElement.classList.remove(settings.errorClass);
}

function isValid(formElement, inputElement, settings) {
  const value = inputElement.value.trim();
  let isValid = true;

  if (inputElement.name === 'link' || inputElement.name === 'avatar') {
    isValid = validateURL(value);
    if (!isValid) {
      showInputError(formElement, inputElement, 'Введите корректную ссылку.', settings);
    }
  } 
  else if (inputElement.name === 'name') {
    isValid = value.length >= 2 && value.length <= 40;
    if (!isValid) {
      showInputError(formElement, inputElement, 'Имя должно быть от 2 до 40 символов.', settings);
    }
  }
  else if (inputElement.name === 'description') {
    isValid = value.length >= 2 && value.length <= 200;
    if (!isValid) {
      showInputError(formElement, inputElement, 'Описание должно быть от 2 до 200 символов.', settings);
    }
  }
  else if (inputElement.name === 'title') {
    isValid = value.length >= 2 && value.length <= 30;
    if (!isValid) {
      showInputError(formElement, inputElement, 'Название должно быть от 2 до 30 символов.', settings);
    }
  }

  // Убираем установку customValidity для полей профиля
  if (inputElement.name !== 'name' && inputElement.name !== 'description') {
    inputElement.setCustomValidity(isValid ? '' : 'Invalid field');
  }

  if (isValid) {
    hideInputError(formElement, inputElement, settings);
  }

  return isValid;
}

function hasInvalidInput(inputList) {
  return inputList.some(inputElement => {
    // Для полей профиля проверяем только минимальную длину
    if (inputElement.name === 'name') {
      return inputElement.value.trim().length < 2;
    }
    if (inputElement.name === 'description') {
      return inputElement.value.trim().length < 2;
    }
    return !inputElement.validity.valid;
  });
}


function toggleButtonState(inputList, buttonElement, settings) {
  if (hasInvalidInput(inputList)) {
    buttonElement.disabled = true;
    buttonElement.classList.add(settings.inactiveButtonClass);
  } else {
    buttonElement.disabled = false;
    buttonElement.classList.remove(settings.inactiveButtonClass);
  }
}

function setEventListeners(formElement, settings) {
  const inputList = Array.from(formElement.querySelectorAll(settings.inputSelector));
  const buttonElement = formElement.querySelector(settings.submitButtonSelector);

  // Сохраняем начальные значения полей
  inputList.forEach(inputElement => {
    inputElement.defaultValue = inputElement.value;
  });

  // Изначальная проверка
  inputList.forEach(inputElement => {
    isValid(formElement, inputElement, settings);
  });
  toggleButtonState(inputList, buttonElement, settings);

  // Обработчик ввода
  inputList.forEach((inputElement) => {
    inputElement.addEventListener('input', () => {
      isValid(formElement, inputElement, settings);
      toggleButtonState(inputList, buttonElement, settings);
    });
  });
}

function enableValidation(settings) {
  const formList = Array.from(document.querySelectorAll(settings.formSelector));
  formList.forEach((formElement) => {
    setEventListeners(formElement, settings);
  });
}

// Вспомогательная функция валидации URL
function validateURL(url) {
  try {
    const parsedUrl = new URL(url);
    return ['http:', 'https:'].includes(parsedUrl.protocol) && 
           parsedUrl.hostname !== '' &&
           parsedUrl.hostname.includes('.');
  } catch (e) {
    return false;
  }
}



export { enableValidation };
