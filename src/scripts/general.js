window.onload = function () {
    twemoji.parse(document.body, {
        folder: 'svg', ext: '.svg'
    });
}

function toggleMenu() {
    document.getElementById("mobileMenuID").classList.toggle("showMenu");
}

function emailToggle() {
    document.getElementById("emailModal").classList.toggle("showEmail");
}

window.addEventListener('keydown', function (event) {
    if (event.key === 'Escape') {
        document.getElementById("emailModal").classList.remove('showEmail')
    }
})