window.onload = function() {    
    // Parses the document body and    
    // inserts <img> tags in place of Unicode Emojis    
    twemoji.parse(document.body, 
            {folder: 'svg', ext: '.svg'} // This is to specify to Twemoji to use SVGs and not PNGs
    );

}