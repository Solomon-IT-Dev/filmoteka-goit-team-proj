import * as basicLightbox from 'basiclightbox';

// ! Тестовый код для проверки роботы basicLightbox

const modalOpener = document.querySelector('.modal-opener');

modalOpener.addEventListener('click', onOpenerClick);

function onOpenerClick(e) {
  e.preventDefault();
  modalInteraction();
}

function modalInteraction() {
  const instance = basicLightbox.create('');
  instance.show();

  // Добавляет закрытие модального окна по нажатия клавиши 'Esc'
  window.addEventListener('keydown', e => {
    if (e.code === 'Escape') {
      instance.close();
    }
  });
}
