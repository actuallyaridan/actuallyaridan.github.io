function emailToggle() {
    document.getElementById("emailModal").classList.toggle("showEmail");
}

function toggleMenu() {
    document.getElementById("mobileMenuID").classList.toggle("showMenu");
}

window.onload = function () {
    // Parses the document body and    
    // inserts <img> tags in place of Unicode Emojis    
    twemoji.parse(document.body,
        { folder: 'svg', ext: '.svg' } // This is to specify to Twemoji to use SVGs and not PNGs
    );

}

window.addEventListener('keydown', function (event) {
    if (event.key === 'Escape') {
        document.getElementById("emailModal").classList.remove('showEmail')
    }
}
)