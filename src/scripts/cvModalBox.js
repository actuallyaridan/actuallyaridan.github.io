window.addEventListener('keydown', function (event) {
  if (event.key === 'Escape') {
    document.getElementById("cvModal").classList.remove('showEmail')
  }
}
)

function cvModalToggle() {
    document.getElementById("cvModal").classList.toggle("showEmail");
}