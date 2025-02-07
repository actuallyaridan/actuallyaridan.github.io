window.onload = function () {
    // Parse all emojis on the page
    twemoji.parse(document.body, {
        folder: 'svg',
        ext: '.svg',
    });
}

function toggleMenu() {
    document.getElementById("mobileMenuID").classList.toggle("showMenu");
}
