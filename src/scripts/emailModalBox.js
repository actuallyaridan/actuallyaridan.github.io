window.addEventListener('keydown', function (event) {
  if (event.key === 'Escape') {
    document.getElementById("emailModal").classList.remove('showEmail')
  }
}
)

function emailToggle() {
    document.getElementById("emailModal").classList.toggle("showEmail");
}