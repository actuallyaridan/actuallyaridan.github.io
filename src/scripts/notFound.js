window.addEventListener('DOMContentLoaded', function() {
    var emojis = [
        "🤨",
        "🤔",
        "😐",
        "😥",
        "😔",
        "😓",
        "😕",
        "🫤",
        "😟",
        "🤦‍♂️",
        "😭",
        "🙃",
        "🥴",
        "🧐",
        "🫨",
        "😞"
    ];
    document.getElementById('emojiNotFound').textContent = emojis[Math.floor(Math.random()*emojis.length)];
  });