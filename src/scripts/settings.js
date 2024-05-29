function settingsAlert() {
    document.getElementById("failSave").classList.remove("result");
    document.getElementById("sucessfullSave").classList.remove("result");
}

const htmlEl = document.documentElement;
const currentTheme = localStorage.getItem('theme') || 'auto';

if (currentTheme) {
    htmlEl.dataset.theme = currentTheme;
    console.log("Applied current theme:", currentTheme);
}

const toggleTheme = (theme) => {
    console.log("Toggling theme to:", theme);
    htmlEl.dataset.theme = theme;
    localStorage.setItem('theme', theme);
};

document.addEventListener('DOMContentLoaded', () => {
    console.log("DOM fully loaded and parsed");

    const form = document.getElementById('settings');

    const setDarkerAccentColor = (color) => {
        const colors = {
            "151, 10, 10": "30, 0, 0",
            "10, 151, 33": "0, 30, 3",
            "10, 66, 151": "0, 10, 40",
            "151, 78, 10": "60, 18, 0"
        };
        const darkerColor = colors[color] || "18, 2, 24";
        document.documentElement.style.setProperty('--darker-accent-color', darkerColor);
        localStorage.setItem('darker-accent-color', darkerColor);

        console.log("Set darker accent color:", darkerColor);

        if (!colors[color]) {
            const defaultAccentColor = "113, 10, 151";
            document.documentElement.style.setProperty('--accent-color', defaultAccentColor);
            localStorage.setItem('accent-color', defaultAccentColor);

            console.log("Set default accent color:", defaultAccentColor);
        }
    };

    const toggleClass = (selector, className, condition) => {
        console.log(`Toggling class '${className}' on '${selector}' elements, condition: ${condition}`);
        document.querySelectorAll(selector).forEach(element => {
            element.classList.toggle(className, condition);
        });
    };

    const applySettings = () => {
        console.log("Applying settings...");
        const storedColor = localStorage.getItem('accent-color');
        if (storedColor) {
            document.documentElement.style.setProperty('--accent-color', storedColor);
            setDarkerAccentColor(storedColor);
        } else {
            setDarkerAccentColor(null);
        }

        const isUppercase = localStorage.getItem('uppercase') === 'true';
        toggleClass('p, a, h1, h2, h3, button, span, div, select, option', 'uppercaseText', isUppercase);

        const showAnimations = localStorage.getItem('showAnimations') !== 'false';
        toggleClass('*', 'noAnimation', !showAnimations);
    };

    const initializeForm = () => {
        console.log("Initializing form...");
        if (!form) {
            console.error("Form element not found");
            return;
        }

        form.addEventListener('submit', (event) => {
            event.preventDefault();
            console.log("Form submitted");

            try {
                settingsAlert();

                const theme = form.elements['theme-color'].value;
                console.log("Selected theme:", theme);
                toggleTheme(theme);  // Apply the new theme logic here

                const accentColor = form.elements['accent-color'].value;
                console.log("Selected accent color:", accentColor);
                localStorage.setItem('accent-color', accentColor);
                document.documentElement.style.setProperty('--accent-color', accentColor);

                const isUppercase = form.elements['uppercase'].checked;
                console.log("Uppercase setting:", isUppercase);
                localStorage.setItem('uppercase', isUppercase);
                toggleClass('p, a, h1, h2, h3, button, span, div, select, option', 'uppercaseText', isUppercase);

                const showAnimations = form.elements['animations'].checked;
                console.log("Show animations setting:", showAnimations);
                localStorage.setItem('showAnimations', showAnimations);
                toggleClass('*', 'noAnimation', !showAnimations);

                document.getElementById("sucessfullSave").classList.add("result");
            } catch (error) {
                document.getElementById("failSave").classList.add("result");
                console.error("Failed to save settings:", error);
            }
        });

        const storedTheme = localStorage.getItem('theme');
        if (storedTheme) form.elements['theme-color'].value = storedTheme;

        const storedAccentColor = localStorage.getItem('accent-color');
        if (storedAccentColor) form.elements['accent-color'].value = storedAccentColor;

        const isUppercase = localStorage.getItem('uppercase') === 'true';
        form.elements['uppercase'].checked = isUppercase;

        const showAnimations = localStorage.getItem('showAnimations') !== 'false';
        form.elements['animations'].checked = showAnimations;
    };

    const handleLanguageChange = () => {
        const languageSelect = document.getElementById('language-select');
        const currentUrl = window.location.href;

        if (!form || !languageSelect) return;

        form.addEventListener('submit', (event) => {
            event.preventDefault();
            const selectedLanguage = languageSelect.value;
            const redirectUrl = selectedLanguage === 'sv' && !currentUrl.includes('/sv/') ? 'sv/settings' :
                selectedLanguage === 'en' && currentUrl.includes('/sv/') ? '../settings' : '';

            if (redirectUrl) {
                console.log("Redirecting to:", redirectUrl);
                window.location.href = redirectUrl;
            }
        });
    };

    // Initial setup
    applySettings();
    initializeForm();
    handleLanguageChange();

    console.log("Setup complete");
});
