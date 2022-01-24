// Темная тема для сайта


const darkThemeBtn = document.querySelector('.dark-theme-btn');

darkThemeBtn.addEventListener('click',OnThemeSwitch)

function OnThemeSwitch(event) {
   //if dark, switch to light. If light, switch to dark
   const THEME = localStorage.getItem("THEME");
   const isDarkTheme = (THEME === 'dark'); //check our current theme
   if (isDarkTheme) {
      localStorage.removeItem('THEME'); //If theme is dark, switch to default light - clean LocalStorage
      console.log("restoring default light theme");
   }
   else {
      localStorage.setItem('THEME', 'dark'); //If theme is light (isDarkTheme === false), set to dark
      console.log("setting dark theme");
   }

   SaveTheme(); //apply theme changes
}

function SaveTheme() {
   //this function does not change the theme. It applies it according to what is the current active theme (enable "dark classes" if current theme is dark, disable them if not).

   //call this function when we need to "enforce" theme - for example, if we re-render part of the page, possibly deleting classes, and want to make sure they are restored after render is complete

   const THEME = localStorage.getItem("THEME");
   const isDarkTheme = (THEME === 'dark'); //check our current theme

   const backgroundFooter = document.querySelector('footer')
   const darkFooterDate = document.querySelector('.footer_date')
   const darkFooterInfoAboutDev = document.querySelector('.footer_info-about-developed')
   const darkFooterInfoAboutUs = document.querySelector('.footer_info-about-us')
   const darkBtnScroll = document.querySelector('.btn__scroll')
   const darkModal = document.querySelector('.team__container')
   const darkMovieModal = document.querySelector('.modal__container')
   const darkModalBtn = document.querySelector('[data-team-close]')
   const darkMovieModalBtn = document.querySelector('[data-modal-close]')
   const darkTextImg = document.querySelectorAll('.films-list__title')
   const backgroundBody = document.querySelector('body')

   backgroundBody.classList.toggle('dark-body', isDarkTheme)
   backgroundFooter.classList.toggle('dark-footer', isDarkTheme)
   darkFooterDate.classList.toggle('inverse-text', isDarkTheme)
   darkFooterInfoAboutDev.classList.toggle('inverse-text', isDarkTheme)
   darkFooterInfoAboutUs.classList.toggle('inverse-text', isDarkTheme)
   darkThemeBtn.classList.toggle('dark-theme-btn-moon', isDarkTheme) 
   darkModalBtn.classList.toggle('dark-modal-bg', isDarkTheme)
   darkMovieModalBtn.classList.toggle('dark-modal-bg', isDarkTheme)
   darkModal.classList.toggle('dark-modal-bg', isDarkTheme)
   darkMovieModal.classList.toggle('dark-modal-bg', isDarkTheme)
   darkBtnScroll.classList.toggle('dark-btn-scroll', isDarkTheme) 
   for (const iterator of darkTextImg) {
     iterator.classList.toggle('inverse-text', isDarkTheme)
   }
}

// function DeleteTheme(){
//    const backgroundBody = document.querySelector('body')
//    if(!backgroundBody.classList.contains('dark-body')){
//       localStorage.removeItem('THEME')
//    }
// }

//darkThemeBtn.addEventListener('click',DeleteTheme)

exports.SaveTheme = SaveTheme






