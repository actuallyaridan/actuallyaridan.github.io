window.addEventListener('DOMContentLoaded', () => {
  const storedColor = localStorage.getItem('accent-color');
  const formattedColor = `rgb(${storedColor})`;
  document.documentElement.style.setProperty('--accent-color', storedColor);
  document.querySelector("meta[name=theme-color]").content=formattedColor;
});


window.addEventListener('DOMContentLoaded', () => {  
    if(document.getElementById('settings')){
      const form = document.getElementById('settings');
      const radioButtons = form.elements['accent-color'];

    form.addEventListener('submit', (event) => {
      event.preventDefault(); // Prevent default form submission
      document.getElementById("sucessfullSave").classList.add("result");
      const chosenColor = Array.from(radioButtons).find(radio => radio.checked).value;
  
      // Save the chosen color to local storage
      localStorage.setItem('accent-color', chosenColor);
  
      // Update the page style based on the selected color (optional)
      document.documentElement.style.setProperty('--accent-color', chosenColor);
      const formattedColor = `rgb(${storedColor})`;
      document.querySelector("meta[name=theme-color]").content=formattedColor;
    });  
    // Check for existing color preference on page load
    const storedColor = localStorage.getItem('accent-color');
    if (storedColor) {
      const matchingRadio = Array.from(radioButtons).find(radio => radio.value === storedColor);
      if (matchingRadio) {
        matchingRadio.checked = true;
        document.documentElement.style.setProperty('--accent-color', storedColor);
        const formattedColor = `rgb(${storedColor})`;
        document.querySelector("meta[name=theme-color]").content=formattedColor;
      }
    }
  }});

  function settingsAlert() {
    document.getElementById("failSave").classList.remove("result");
    document.getElementById("sucessfullSave").classList.toggle("result");
}
