import refs from './refs';
import { SaveThemeModal } from './dark-theme'

refs.backdropTeam.addEventListener('click', onTeamBackdropClick);
refs.openModalTeamBtn.addEventListener('click', openModalTeam);
refs.closeModalTeamBtn.addEventListener('click', closeModalTeam);

function onTeamEscKeyPress(event) {
    if (event.code === 'Escape') {
      closeModalTeam();
    }
  }
function onTeamBackdropClick(event) {
    if (event.target === event.currentTarget) {
        closeModalTeam();
    }
}
function openModalTeam() {
    refs.scrollUpwardBtn.classList.remove('btn__scroll--show');
    document.body.classList.toggle('modal-open');
    refs.modalTeam.classList.toggle('backdrop--is-hidden');
    window.addEventListener('keydown', onTeamEscKeyPress);
  }
  
function closeModalTeam() {
        document.body.classList.toggle('modal-open');
        refs.modalTeam.classList.toggle('backdrop--is-hidden');

        const scrollParam = window.scrollY;
        const coords = document.documentElement.clientHeight;

        if (scrollParam > coords) {
            refs.scrollUpwardBtn.classList.add('btn__scroll--show');
        }

        window.removeEventListener('keydown', onTeamEscKeyPress);
    
}
