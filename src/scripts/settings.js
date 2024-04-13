window.addEventListener('DOMContentLoaded', () => {
  const storedSetting = localStorage.getItem('showAnimations');
  if (storedSetting === 'false') {
    document.querySelectorAll('button, a, span, body, label, input, menu, div')
      .forEach(element => element.classList.add('noAnimation'));
  } else {
    document.querySelectorAll('button, a, span, body, label, input, menu, div')
      .forEach(element => element.classList.remove('noAnimation'));
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


/*Closes the alert message when the user taps the close button*/
function settingsAlert() {
  document.getElementById("failSave").classList.remove("result");
  document.getElementById("sucessfullSave").classList.remove("result");
};