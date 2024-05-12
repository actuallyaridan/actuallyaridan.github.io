/*Applies all settings to all pages from local storage, if they exist*/
window.addEventListener('DOMContentLoaded', () => {
  const storedColor = localStorage.getItem('accent-color');
  document.documentElement.style.setProperty('--accent-color', storedColor);
  const storedSettingText = localStorage.getItem('uppercase');
  const elements = document.querySelectorAll('p, a, h1, h2, h3, button, span, div, select, option');
  if (storedSettingText === 'true') {
    elements.forEach(element => element.classList.add('uppercaseText'));
  } else {
    elements.forEach(element => element.classList.remove('uppercaseText'));
  }

  const storedSetting = localStorage.getItem('showAnimations');
  if (storedSetting === 'false') {
    document.querySelectorAll('button, a, span, body, label, input, menu, div')
      .forEach(element => element.classList.add('noAnimation'));
  } else {
    document.querySelectorAll('button, a, span, body, label, input, menu, div')
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
    } else {
      const darkerAccentColor = "18, 2, 24";
      const defaultAccentColor = "113, 10, 151";
      localStorage.setItem('darker-accent-color', darkerAccentColor);
      localStorage.setItem('accent-color', defaultAccentColor);
      document.documentElement.style.setProperty('--darker-accent-color', darkerAccentColor);
      document.documentElement.style.setProperty('--accent-color', defaultAccentColor);
    }
  }
  else {
    const darkerAccentColor = "18, 2, 24";
    const defaultAccentColor = "113, 10, 151";
    localStorage.setItem('darker-accent-color', darkerAccentColor);
    localStorage.setItem('accent-color', defaultAccentColor);
    document.documentElement.style.setProperty('--darker-accent-color', darkerAccentColor);
    document.documentElement.style.setProperty('--accent-color', defaultAccentColor);
}
});

/*Manages the theme toggle*/
window.addEventListener('DOMContentLoaded', () => {
  if (document.getElementById('settings')) {
    const form = document.getElementById('settings');
    const radioButtons = form.elements['theme-color'];

    form.addEventListener('submit', (event) => {
      event.preventDefault(); // Prevent default form submission
      document.getElementById("sucessfullSave").classList.add("result");
      const chosenTheme = Array.from(radioButtons).find(radio => radio.checked).id;

      // Save the chosen theme to local storage
      localStorage.setItem('theme-color', chosenTheme);

      // Apply the chosen theme
      applyTheme(chosenTheme);
    });
    // Check for existing theme preference on page load
    const storedTheme = localStorage.getItem('theme-color');
    if (storedTheme) {
      const matchingRadio = Array.from(radioButtons).find(radio => radio.id === storedTheme);
      if (matchingRadio) {
        matchingRadio.checked = true;
        applyTheme(storedTheme);
      }
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
    });
    // Check for existing color preference on page load
    const storedColor = localStorage.getItem('accent-color');
    if (storedColor) {
      const matchingRadio = Array.from(radioButtons).find(radio => radio.value === storedColor);
      if (matchingRadio) {
        matchingRadio.checked = true;
        document.documentElement.style.setProperty('--accent-color', storedColor);
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
        document.querySelectorAll('button, a, span, body, label, input, menu, div')
          .forEach(element => element.classList.remove('noAnimation'));
      } else {
        document.querySelectorAll('button, a, span, body, label, input, menu, div')
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
      animationsCheckbox.checked = true;
    }

    // Apply initial animation state based on localStorage
    toggleNoAnimationsClass();
  }
});

/*Manages the update toggle*/
window.addEventListener('DOMContentLoaded', () => {
  if (document.getElementById('settings')) {
    const updateCheckbox = document.getElementById('update-every-sec');
    const form = document.getElementById('settings');

    const doUpdatesEverySecSetter = () => {
      localStorage.setItem('doUpdateSec', updateCheckbox.checked);
    };

    // Attach the animation toggle to the submit button click
    form.addEventListener('submit', () => {
      doUpdatesEverySecSetter();

      // Save the setting to localStorage for persistence
      localStorage.setItem('doUpdateSec', updateCheckbox.checked);
    });

    // Load setting from localStorage on page load (initial state)
    const storedSettingUpdate = localStorage.getItem('doUpdateSec');
    if (storedSettingUpdate === 'false') {
      updateCheckbox.checked = false;
    } else {
      updateCheckbox.checked = true;
    }

    // Apply initial animation state based on localStorage
    doUpdatesEverySecSetter();
  }
});

/*Closes the alert message when the user taps the close button*/
function settingsAlert() {
  document.getElementById("failSave").classList.remove("result");
  document.getElementById("sucessfullSave").classList.remove("result");
};

/*Handles theme*/
document.addEventListener('DOMContentLoaded', function () {
  // Function to apply theme based on stored preference
  const applyTheme = () => {
    const selectedTheme = localStorage.getItem('theme-color');
    if (selectedTheme === 'auto') {
      document.documentElement.style.setProperty('--background-color', 'var(--background)');
      document.documentElement.style.setProperty('--text-color', 'var(--text)');
      document.documentElement.style.setProperty('--subtitle-color', 'var(--subtitle)');
      document.documentElement.style.setProperty('--project-color', 'var(--project)');
      document.documentElement.style.setProperty('--mcBackground', 'var(--bgMc)');
      const backgroundColor = getComputedStyle(document.documentElement).getPropertyValue('--background');
      if(backgroundColor === '#121212'){
        document.querySelector('meta[name="theme-color"]').setAttribute('content', '#121212');
      }
      else{
        document.querySelector('meta[name="theme-color"]').setAttribute('content', '#f1f1f1');
      }
    } else if (selectedTheme === 'light') {
      document.documentElement.style.setProperty('--background-color', 'var(--bg-light)');
      document.documentElement.style.setProperty('--text-color', 'var(--text-light)');
      document.documentElement.style.setProperty('--subtitle-color', 'var(--subtitle-light)');
      document.documentElement.style.setProperty('--project-color', 'var(--project-light)');
      document.documentElement.style.setProperty('--mcBackground', 'var(--bgMc-light)');
      document.querySelector('meta[name="theme-color"]').setAttribute('content',  '#f1f1f1');

    } else if (selectedTheme === 'dark') {
      document.documentElement.style.setProperty('--background-color', 'var(--bg-dark)');
      document.documentElement.style.setProperty('--text-color', 'var(--text-dark)');
      document.documentElement.style.setProperty('--subtitle-color', 'var(--subtitle-dark)');
      document.documentElement.style.setProperty('--project-color', 'var(--project-dark)');
      document.documentElement.style.setProperty('--mcBackground', 'var(--bgMc-dark)');
      document.querySelector('meta[name="theme-color"]').setAttribute('content',  '#121212');
    }
  };

  // Apply theme on page load
  applyTheme();

  // Event listener for theme selection change
  document.querySelector('.saveButton').addEventListener('click', function () {
    var selectedTheme = document.querySelector('input[name="theme-color"]:checked').id;
    localStorage.setItem('theme-color', selectedTheme);
    applyTheme(); // Apply the selected theme immediately
  });
});

window.addEventListener('DOMContentLoaded', () => {
  if (document.getElementById('settings')) {
    const uppercaseCheckbox = document.getElementById('uppercase');
    const form = document.getElementById('settings');

    // Function to toggle the uppercaseText class based on checkbox state
    const toggleUppercaseClass = () => {
      const elements = document.querySelectorAll('p, a, h1, h2, h3, button, span, div, select, option');
      if (uppercaseCheckbox.checked) {
        elements.forEach(element => element.classList.add('uppercaseText'));
      } else {
        elements.forEach(element => element.classList.remove('uppercaseText'));
      }
    };

    // Attach the uppercase toggle to the submit button click
    form.addEventListener('submit', () => {
      toggleUppercaseClass();

      // Save the setting to localStorage for persistence
      localStorage.setItem('uppercase', uppercaseCheckbox.checked);
    });

    // Load setting from localStorage on page load (initial state)
    const storedSetting = localStorage.getItem('uppercase');
    if (storedSetting === 'true') {
      uppercaseCheckbox.checked = true;
    } else {
      uppercaseCheckbox.checked = false;
    }

    // Apply initial uppercase state based on localStorage
    toggleUppercaseClass();
  }
});

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


