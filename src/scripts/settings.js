window.addEventListener('DOMContentLoaded', () => {
  const storedColor = localStorage.getItem('accent-color');
  const formattedColor = `rgb(${storedColor})`;
  document.documentElement.style.setProperty('--accent-color', storedColor);
  document.querySelector("meta[name=theme-color]").content = formattedColor;
  // Check for existing color preference on page load
  const storedGradientsEnabled = localStorage.getItem('showGradients');


  if (storedGradientsEnabled) {
    const body = document.body;
    const gradientsCheckbox = document.getElementById('gradients');
    const isGradientsEnabled = storedGradientsEnabled === 'true';

    if (isGradientsEnabled) {
      body.classList.add('gradientBackgroundAnimation');
      gradientsCheckbox.checked = true;
    } else {
      body.classList.remove('gradientBackgroundAnimation');
      gradientsCheckbox.checked = false;

    }
    gradientsCheckbox.checked = isGradientsEnabled;
  }
});


window.addEventListener('DOMContentLoaded', () => {
  if (document.getElementById('settings')) {
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
      document.querySelector("meta[name=theme-color]").content = formattedColor;
    });
    // Check for existing color preference on page load
    const storedColor = localStorage.getItem('accent-color');
    if (storedColor) {
      const matchingRadio = Array.from(radioButtons).find(radio => radio.value === storedColor);
      if (matchingRadio) {
        matchingRadio.checked = true;
        document.documentElement.style.setProperty('--accent-color', storedColor);
        const formattedColor = `rgb(${storedColor})`;
        document.querySelector("meta[name=theme-color]").content = formattedColor;
      }
    }
  }
});

window.addEventListener('DOMContentLoaded', () => {
  const animationsCheckbox = document.getElementById('animations');
  const form = document.getElementById('settings');

  // Function to apply/remove the noAnimations class based on checkbox state
  const toggleNoAnimationsClass = () => {
    if (animationsCheckbox.checked) {
      document.querySelectorAll('button, a, span, body, label, input')
        .forEach(element => element.classList.remove('noAnimation'));
    } else {
      document.querySelectorAll('button, a, span, body, label, input')
        .forEach(element => element.classList.add('noAnimation'));
    }
  };

  // Attach the animation toggle to the submit button click
  form.addEventListener('submit', () => {
    toggleNoAnimationsClass();

    // Save the setting to localStorage for persistence
    localStorage.setItem('showAnimations', animationsCheckbox.checked);
  });

  // Load setting from localStorage on page load (initial state)
  const storedSetting = localStorage.getItem('showAnimations');
  if (storedSetting === 'true') {
    animationsCheckbox.checked = true;
  } else {
    animationsCheckbox.checked = false;
  }

  // Apply initial animation state based on localStorage
  toggleNoAnimationsClass();
});


window.addEventListener('DOMContentLoaded', () => {
  if (document.getElementById('settings')) {
    const gradientsCheckbox = document.getElementById('gradients');
    const form = document.getElementById('settings');

    form.addEventListener('submit', (event) => {
      event.preventDefault();
      const isGradientsEnabled = gradientsCheckbox.checked;
      const body = document.body;

      if (isGradientsEnabled) {
        body.classList.add('gradientBackgroundAnimation');
        gradientsCheckbox.checked = true;
      } else {
        body.classList.remove('gradientBackgroundAnimation');
        gradientsCheckbox.checked = false;
      }

      // Update localStorage with the current checkbox state
      localStorage.setItem('showGradients', isGradientsEnabled);
    });
  }
});

function settingsAlert() {
  document.getElementById("failSave").classList.remove("result");
  document.getElementById("sucessfullSave").classList.remove("result");
}




window.addEventListener('DOMContentLoaded', () => {
  if (document.getElementById('settings')) {
    const form = document.getElementById('settings');
    const languageSelect = document.getElementById('language-select');
    const currentUrl = window.location.href; // Get current URL

    form.addEventListener('submit', (event) => {
      event.preventDefault(); // Prevent default form submission

      const selectedLanguage = languageSelect.value;
      const redirectUrl = selectedLanguage === 'sv' && !currentUrl.includes('/sv/') ? 'sv/settings' :
        selectedLanguage === 'en' && currentUrl.includes('/sv/') ? '../settings' : ''; // Redirect only if not already on "aridan.net/settings"

      if (redirectUrl) { // Only redirect if there's a valid URL
        window.location.href = redirectUrl;
      }
    });
  }
});