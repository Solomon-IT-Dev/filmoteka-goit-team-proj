// Темная тема для сайта


const darkThemeBtn = document.querySelector('.dark-theme-btn');

darkThemeBtn.addEventListener('click',OnThemeSwitch)

function OnThemeSwitch(event) {
   //if dark, switch to light. If light, switch to dark
   const THEME = localStorage.getItem("THEME");
   const isDarkTheme = (THEME === 'dark'); //check our current theme
   if (isDarkTheme) {
      localStorage.removeItem('THEME'); //If theme is dark, switch to default light - clean LocalStorage
   }
   else {
      localStorage.setItem('THEME', 'dark'); //If theme is light (isDarkTheme === false), set to dark
   }

   SaveTheme(); //apply theme changes
   SaveThemeModal()
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
   const darkTextImg = document.querySelectorAll('.films-list__title')
   const backgroundBody = document.querySelector('body')
   const darkModalTeamHeader = document.querySelector('[data-dark-modal-header]')
   const darkModalTeamMemberName = document.querySelectorAll('[data-dark-modal-member-name]')
   const darkModalTeamMemberInfo = document.querySelectorAll('[data-dark-modal-member-ifo]')
   const darkModal = document.querySelectorAll('[data-modal-dark]')
   const darkModalBtn = document.querySelector('[data-team-close]')

   backgroundBody.classList.toggle('dark-body', isDarkTheme)
   backgroundFooter.classList.toggle('dark-footer', isDarkTheme)
   darkFooterDate.classList.toggle('inverse-text', isDarkTheme)
   darkFooterInfoAboutDev.classList.toggle('inverse-text', isDarkTheme)
   darkFooterInfoAboutUs.classList.toggle('inverse-text', isDarkTheme)
   darkThemeBtn.classList.toggle('dark-theme-btn-moon', isDarkTheme) 
   darkBtnScroll.classList.toggle('dark-btn-scroll', isDarkTheme) 
   darkModalBtn.classList.toggle('dark-modal-bg', isDarkTheme)
   darkModalTeamHeader.classList.toggle('inverse-text', isDarkTheme)

   for(const iterator of darkModalTeamMemberName){
      iterator.classList.toggle('inverse-text',isDarkTheme)
   }
   for(const iterator of darkModalTeamMemberInfo){
      iterator.classList.toggle('inverse-text',isDarkTheme)
   }
   for (const iterator of darkModal){
      iterator.classList.toggle('dark-modal-bg', isDarkTheme)
   }
   
   for (const iterator of darkTextImg) {
     iterator.classList.toggle('inverse-text', isDarkTheme)
   }
}

function SaveThemeModal(){
   const THEME = localStorage.getItem("THEME");
   const isDarkTheme = (THEME === 'dark');

   const darkModalMovieHeader = document.querySelector('.modal-movies__primary-header')
   const darkModalMovieSecondaryHeader = document.querySelector('.modal-movies__secondary-header')
   const darkModalMovieText = document.querySelector('.modal-movies__text-content')
   const darkModalMovieInfo = document.querySelectorAll('.modal-movies__cell-value')
   const darkModalMovieBgInfo = document.querySelector('.modal-movies__cell-value-colored-lighten')
   const darkModalMoviesBtnBorder = document.querySelectorAll('.modal-movies__button')
   const darkMovieModalBtn = document.querySelector('[data-modal-close]')
   
   darkMovieModalBtn.classList.toggle('dark-modal-bg', isDarkTheme)
   darkModalMovieHeader.classList.toggle('inverse-text',isDarkTheme)
   darkModalMovieSecondaryHeader.classList.toggle('inverse-text',isDarkTheme)
   darkModalMovieText.classList.toggle('inverse-text',isDarkTheme)
   darkModalMovieBgInfo.classList.toggle('dark-footer',isDarkTheme)

   for(const iterator of darkModalMovieInfo){
      iterator.classList.toggle('inverse-text',isDarkTheme)
   }
   for(const iterator of darkModalMoviesBtnBorder){
      iterator.classList.toggle('dark-modal-movie-btn',isDarkTheme)
   }

}



exports.SaveTheme = SaveTheme

exports.SaveThemeModal = SaveThemeModal




