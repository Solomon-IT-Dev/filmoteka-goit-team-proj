// Обработчик события клика на кнопку скрола наверх страницы

const scrollUpwardBtn = document.querySelector('.btn__scroll');

window.addEventListener('scroll', pageScrollHandler);
scrollUpwardBtn.addEventListener('click', onBtnScrollUpwardClick);

// Обрабатывает событие скрола - показывает или скрывает кнопку возврата наверх
function pageScrollHandler() {
  const scrollParam = window.scrollY;
  const coords = document.documentElement.clientHeight;

  if (scrollParam > coords) {
    scrollUpwardBtn.classList.add('btn__scroll--show');
  }
  if (scrollParam < coords) {
    scrollUpwardBtn.classList.remove('btn__scroll--show');
  }
}

// Возвращает наверх страницы по клику на кнопку
function onBtnScrollUpwardClick() {
  if (window.scrollY > 0) {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}
