/*Applies all settings to all pages from local storage, if they exist*/
window.addEventListener('DOMContentLoaded', () => {
  const storedColor = localStorage.getItem('accent-color');
  const formattedColor = `rgb(${storedColor})`;
  document.documentElement.style.setProperty('--accent-color', storedColor);
  document.querySelector("meta[name=theme-color]").content = formattedColor;

  const storedGradientsEnabled = localStorage.getItem('showGradients');
  if (storedGradientsEnabled) {
    const body = document.body;
    const isGradientsEnabled = storedGradientsEnabled === 'true';

    if (isGradientsEnabled) {
      body.classList.add('gradientBackgroundAnimation');
    } else {
      body.classList.remove('gradientBackgroundAnimation');
    }
  }

  const storedSetting = localStorage.getItem('showAnimations');
  if (storedSetting === 'false') {
    document.querySelectorAll('button, a, span, body, label, input')
      .forEach(element => element.classList.add('noAnimation'));
  } else {
    document.querySelectorAll('button, a, span, body, label, input')
      .forEach(element => element.classList.remove('noAnimation'));
  }

  if (storedColor) {
    if (storedColor == "151, 10, 10") {
      const darkerAccentColor = "30, 0, 0";
      localStorage.setItem('darker-accent-color', darkerAccentColor);
      document.documentElement.style.setProperty('--darker-accent-color', darkerAccentColor);
    } else if (storedColor == "10, 151, 33") {
      const darkerAccentColor = "0, 30, 3";
      localStorage.setItem('darker-accent-color', darkerAccentColor);
      document.documentElement.style.setProperty('--darker-accent-color', darkerAccentColor);
    } else if (storedColor == "10, 66, 151") {
      const darkerAccentColor = "0, 10, 40";
      localStorage.setItem('darker-accent-color', darkerAccentColor);
      document.documentElement.style.setProperty('--darker-accent-color', darkerAccentColor);
    } else if (storedColor == "151, 78, 10") {
      const darkerAccentColor = "60, 18, 0";
      localStorage.setItem('darker-accent-color', darkerAccentColor);
      document.documentElement.style.setProperty('--darker-accent-color', darkerAccentColor);
    } else{
      const darkerAccentColor = "18, 2, 24";
      localStorage.setItem('darker-accent-color', darkerAccentColor);
      document.documentElement.style.setProperty('--darker-accent-color', darkerAccentColor);
    }
  }
});


/*Manages the accent color toggle*/
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
  if (document.getElementById('settings')) {
    const form = document.getElementById('settings');

    form.addEventListener('submit', (event) => {
      event.preventDefault(); // Prevent default form submission
      document.getElementById("sucessfullSave").classList.add("result");
      const storedColor = localStorage.getItem('accent-color');
      if (storedColor == "113, 10, 151") {
        const darkerAccentColor = "18, 2, 24";
        localStorage.setItem('darker-accent-color', darkerAccentColor);
        document.documentElement.style.setProperty('--darker-accent-color', darkerAccentColor);
      } else if (storedColor == "151, 10, 10") {
        const darkerAccentColor = "30, 0, 0";
        localStorage.setItem('darker-accent-color', darkerAccentColor);
        document.documentElement.style.setProperty('--darker-accent-color', darkerAccentColor);
      } else if (storedColor == "10, 151, 33") {
        const darkerAccentColor = "0, 30, 3";
        localStorage.setItem('darker-accent-color', darkerAccentColor);
        document.documentElement.style.setProperty('--darker-accent-color', darkerAccentColor);
      } else if (storedColor == "10, 66, 151") {
        const darkerAccentColor = "0, 10, 40";
        localStorage.setItem('darker-accent-color', darkerAccentColor);
        document.documentElement.style.setProperty('--darker-accent-color', darkerAccentColor);
      } else if (storedColor == "151, 78, 10") {
        const darkerAccentColor = "60, 18, 0";
        localStorage.setItem('darker-accent-color', darkerAccentColor);
        document.documentElement.style.setProperty('--darker-accent-color', darkerAccentColor);
      }
    });
  }
});


/*Manages the animations toggle*/
window.addEventListener('DOMContentLoaded', () => {
  if (document.getElementById('settings')) {
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
    if (storedSetting === 'false') {
      animationsCheckbox.checked = false;
    } else {
      animationsCheckbox.checked = ture;
    }

    // Apply initial animation state based on localStorage
    toggleNoAnimationsClass();
  }
});

/*Manages the gradients toggle*/
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
  }
});


/*Closes the alert message when the user taps the close button*/
function settingsAlert() {
  document.getElementById("failSave").classList.remove("result");
  document.getElementById("sucessfullSave").classList.remove("result");
};


/*Changes the language*/
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