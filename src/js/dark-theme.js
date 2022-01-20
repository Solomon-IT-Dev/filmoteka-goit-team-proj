// Темная тема для сайта

const darkThemeBtn = document.querySelector('.dark-theme-btn');

const backgroundBody = document.querySelector('body')
const backgroundFooter = document.querySelector('footer')

const darkFooterDate = document.querySelector('.footer_date')
const darkFooterInfoAboutDev = document.querySelector('.footer_info-about-developed')
const darkFooterInfoAboutUs = document.querySelector('.footer_info-about-us')

const darkTextImg = document.querySelector('.films-list__title')
const darkImgList = document.querySelector('.films-list__item')

const darkModal = document.querySelector('.modal')


console.log()


async function OnDarkTheme() {
   await backgroundBody.classList.toggle('dark-body')
   await backgroundFooter.classList.toggle('dark-footer')
   await darkFooterDate.classList.toggle('inverse-text')
   await darkFooterInfoAboutDev.classList.toggle('inverse-text')
   await darkFooterInfoAboutUs.classList.toggle('inverse-text')
   await darkTextImg.classList.toggle('inverse-text')
   await darkImgList.classList.toggle('dark-img')
   await darkModal.classList.toggle('dark-modal-bg')
   await darkThemeBtn.classList.toggle('dark-theme-btn-moon')
  
   
}

darkThemeBtn.addEventListener('click',OnDarkTheme)


