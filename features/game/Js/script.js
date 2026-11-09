const prota = document.querySelector('.prota');

const jump = () => {
    prota.classList.add('jump');

    setTimeout(() => {
        prota.classList.remove('jump');
    }, 500);
}

document.addEventListener('keydown', jump);


