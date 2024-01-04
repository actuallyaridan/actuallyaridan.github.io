/* When the user clicks on the button, 
toggle between hiding and showing the dropdown content */
function toggleLangDrop() {
    document.getElementById("dropButtonID").classList.toggle("dropButtonPressed");
    document.getElementById("langDrop").classList.toggle("show");
  }
  
  // Close the dropdown menu if the user clicks outside of it
  window.onclick = function(event) {
    if (!event.target.matches('.dropButton')) {
      var dropdowns = document.getElementsByClassName("dropdownContent");
      var i;
      var buttons = document.getElementById("dropButtonID");
      for (i = 0; i < dropdowns.length; i++) {
        var openDropdown = dropdowns[i];
        if (openDropdown.classList.contains('show')) {
          openDropdown.classList.remove('show');
          buttons.classList.remove('dropButtonPressed');
        }
      }
    }
  }