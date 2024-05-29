window.addEventListener('DOMContentLoaded', function () {
    const emojis = [
        "🤨", "🤔", "😐", "😥", "😔", "😓", "😕", "🫤", "😟",
        "🤦‍♂️", "😭", "🙃", "🥴", "🧐", "🫨", "😞", "😢", "🫥",
        "😨", "😩", "😫", "😖", "😣", "😰", "🤯", "😳", "🙂‍↔️",
        "😇", "🤪", "😴", "😿", "📭", "❓", "⁉️", "💀", "😾",
        "⚠️", "❌", "😵", "😶‍🌫️", "😶", "🥶"
    ];
    const text = [
        "Houston, we have a problem...", 
        "Luckily you didn't break the internet this time!", 
        "This is fine... <br>[dog_with_fire.jpeg]", 
        "Yeah, we're not really sure what you meant with that URL either...", 
        "It seems like this page might have been abducted by aliens! <br>Quick, go back home before they see you!!!",
        "It seems like this page is a ghost... <br>You know who to call!",
        "Life is like a broken link. You never know what you're gonna get. Except for a 404. <br><br>Quote edited from Forrest Gump",
        "I know I said I wasn't gonna teach you anything, Five Percent, but, um, here's a lesson: <br>This page doesn't exist.<br><br>Quote edited from The Rookie",
        "People are good when it’s easy. When push comes to shove, everyone gets a 404. <br><br>Quote edited from The Rookie",
        "WHERE'S THE LAMB SAUCE?!<br><br>Quote from Hell's Kitchen",
        "GET OUT! <br>What? <br>Get out and fix the URL!<br><br>Quote edited from The Rookie",
        "You have bad news and think a 404 will save you? <br><br>Quote edited from The Rookie",
        "Sir did you just get a 404? <br>No, I just gave a server a link that doesn't exist. <br><br>Quote edited from The Rookie",
        "You're a lying liar who... lies! There's no page here! <br><br>Quote edited from The Rookie"
    ];
    document.getElementById('emojiNotFound').textContent = emojis[Math.floor(Math.random() * emojis.length)];
    document.getElementById('textNotFound').innerHTML = text[Math.floor(Math.random() * text.length)];
});