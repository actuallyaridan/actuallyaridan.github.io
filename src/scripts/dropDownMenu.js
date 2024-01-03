/* When the user clicks on the button, 
toggle between hiding and showing the dropdown content */
function toggleLangDrop() {
    document.getElementById("langDrop").classList.toggle("show");
  }
  
  // Close the dropdown menu if the user clicks outside of it
  window.onclick = function(event) {
    if (!event.target.matches('.dropButton')) {
      var dropdowns = document.getElementsByClassName("dropdownContent");
      var i;
      for (i = 0; i < dropdowns.length; i++) {
        var openDropdown = dropdowns[i];
        if (openDropdown.classList.contains('show')) {
          openDropdown.classList.remove('show');
        }
      }
    }
  }