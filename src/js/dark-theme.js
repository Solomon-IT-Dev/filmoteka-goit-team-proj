// Темная тема для сайта


const darkThemeBtn = document.querySelector('.dark-theme-btn');

darkThemeBtn.addEventListener('click',OnDarkTheme)

function OnDarkTheme() {
   const backgroundFooter = document.querySelector('footer')
   const darkFooterDate = document.querySelector('.footer_date')
   const darkFooterInfoAboutDev = document.querySelector('.footer_info-about-developed')
   const darkFooterInfoAboutUs = document.querySelector('.footer_info-about-us')
   const darkBtnScroll = document.querySelector('.btn__scroll')
   const darkModal = document.querySelector('.team__container')
   const darkModalBtn = document.querySelector('[data-team-close]')
   const darkTextImg = document.querySelectorAll('.films-list__title')
   const backgroundBody = document.querySelector('body')

   backgroundBody.classList.toggle('dark-body')
   backgroundFooter.classList.toggle('dark-footer')
   darkFooterDate.classList.toggle('inverse-text')
   darkFooterInfoAboutDev.classList.toggle('inverse-text')
   darkFooterInfoAboutUs.classList.toggle('inverse-text')
   darkThemeBtn.classList.toggle('dark-theme-btn-moon') 
   darkModalBtn.classList.toggle('dark-modal-bg')
   darkModal.classList.toggle('dark-modal-bg')
   darkBtnScroll.classList.toggle('dark-btn-scroll') 
   for (const iterator of darkTextImg) {
     iterator.classList.toggle('inverse-text')
   }

   localStorage.setItem('THEME', 'dark');
}

function SaveTheme(){
   const THEME = localStorage.getItem("THEME");
   if(THEME === 'dark'){
      OnDarkTheme()
      
   }
   
}

function DeleteTheme(){
   const backgroundBody = document.querySelector('body')
   if(!backgroundBody.classList.contains('dark-body')){
      localStorage.removeItem('THEME')
   }
}

darkThemeBtn.addEventListener('click',DeleteTheme)





exports.SaveTheme = SaveTheme






