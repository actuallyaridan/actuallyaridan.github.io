// Immediately set theme based on localStorage before page renders
(function() {
    const savedTheme = localStorage.getItem('theme');
    const savedColor = localStorage.getItem('accentColor') || 'blue'; // Get saved color or default
    const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme === 'dark' || (!savedTheme && systemDark)) {
        document.documentElement.classList.add('theme-dark', `color-${savedColor}`);
    } else {
        document.documentElement.classList.add('theme-light', `color-${savedColor}`);
    }
})();


document.addEventListener('DOMContentLoaded', function() {
    const settingsDialog = document.getElementById('settingsDialog');
    const themeOptions = document.querySelectorAll('input[name="theme-color"]');
    const colorOptions = document.querySelectorAll('input[name="accent-color"]');
    const resetButton = document.querySelector('.dangerZone');
    
    initializeSettings();
    
    themeOptions.forEach(option => {
        option.addEventListener('change', function() {
            handleThemeChange(this.value);
        });
    });
    
    colorOptions.forEach(option => {
        option.addEventListener('change', function() {
            handleColorChange(this.value);
        });
    });
    
    resetButton.addEventListener('click', resetSettings);
    
    function initializeSettings() {
        // Theme initialization
        const savedTheme = localStorage.getItem('theme') || 'auto';
        document.querySelector(`input[name="theme-color"][value="${savedTheme}"]`).checked = true;
        applyTheme(savedTheme);
        
        // Color initialization
        const savedColor = localStorage.getItem('accentColor') || 'blue';
        document.querySelector(`input[name="accent-color"][value="${savedColor}"]`).checked = true;
        // Don't need to apply color here as it's already set in the IIFE
    }
    
    function handleThemeChange(themeValue) {
        localStorage.setItem('theme', themeValue);
        applyTheme(themeValue);
    }
    
    function applyTheme(themeValue) {
        const currentColor = localStorage.getItem('accentColor') || 'blue';
        document.documentElement.className = ''; // Clear all classes
        
        if (themeValue === 'auto') {
            const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            document.documentElement.classList.add(systemDark ? 'theme-dark' : 'theme-light', `color-${currentColor}`);
        } else {
            document.documentElement.classList.add(`theme-${themeValue}`, `color-${currentColor}`);
        }
    }
    
    function handleColorChange(colorValue) {
        localStorage.setItem('accentColor', colorValue);
        applyAccentColor(colorValue);
    }
    
    function applyAccentColor(colorValue) {
        // Replace any existing color class with the new one
        document.documentElement.className = document.documentElement.className
            .replace(/\bcolor-\w+/g, '') + ` color-${colorValue}`;
    }
    
    function resetSettings() {
        if (confirm('Are you sure you want to reset all settings to default?')) {
            localStorage.removeItem('theme');
            localStorage.removeItem('accentColor');
            
            document.querySelector('input[name="theme-color"][value="auto"]').checked = true;
            document.querySelector('input[name="accent-color"][value="blue"]').checked = true;
            
            applyTheme('auto');
            applyAccentColor('blue');
        }
    }
});

function toggleSettings() {
    const dialog = document.getElementById('settingsDialog');
    dialog.open ? dialog.close() : dialog.showModal();
}