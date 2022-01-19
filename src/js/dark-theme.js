// Темная тема для сайта

const darkThemeBtn = document.querySelector('.dark-theme-btn');
const backgroundBody = document.querySelector('body')
const backgroundFooter = document.querySelector('footer')
const darkFooterDate = document.querySelector('.footer_date')
const darkFooterInfoAboutDev = document.querySelector('.footer_info-about-developed')
const darkFooterInfoAboutUs = document.querySelector('.footer_info-about-us')
const darkImgContainer = document.querySelector('.films-list__img')

console.log(darkImgContainer)

 function OnDarkTheme() {
    backgroundBody.classList.toggle('dark-body')
    backgroundFooter.classList.toggle('dark-footer')
    darkFooterDate.classList.toggle('dark-footer-text')
    darkFooterInfoAboutDev.classList.toggle('dark-footer-text')
    darkFooterInfoAboutUs.classList.toggle('dark-footer-text')
    darkImgContainer.classList.toggle('dark-body')
}

darkThemeBtn.addEventListener('click',OnDarkTheme)
