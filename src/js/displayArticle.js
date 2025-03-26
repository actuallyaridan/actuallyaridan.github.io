async function fetchFullArticle() {
    const loadingSpinner = document.getElementById('loading');
    const articleContainer = document.querySelector('main.container');
    
    try {
        // Show loading spinner before starting the fetch
        loadingSpinner.style.display = 'block';

        // Get article name from URL
        const urlParams = new URLSearchParams(window.location.search);
        const articleName = urlParams.get('article');
        console.log('Loading article:', articleName);
        
        if (!articleName) {
            throw new Error('No article provided. Please specify an article name in the URL query string.');
        }

        // Fetch the markdown file
        const response = await fetch(`/assets/content/articles/${articleName}.md`);
        if (!response.ok) {
            throw new Error('No article with that name was found. Check the URL and try again.');
        }
        const markdown = await response.text();
        console.log('Raw markdown:', markdown);

        // Parse the markdown
        const { metadata, content } = parseMarkdown(markdown);
        console.log('Parsed metadata:', metadata);
        console.log('Parsed content:', content);

        // Generate article HTML content
        const articleHTML = `
            <article class="full-article">
                <div id="info">
                    <p class="icon"><i class="fa-solid fa-newspaper icon-background"></i></p>
                    <div>
                        <h1 class="name">${metadata.title}</h1>
                        <p class="description titleColor">${metadata.date}</p>
                                            <a href="/articles/" title="Back to articles" class="button backButton">
                        <i class="fa-solid fa-arrow-left"></i>
                    </a>
                    </div>
                </div>
                <hr>
                <div>
                    <h1 class="article-title"></h1>
                    <p></p>
                    <div class="article-meta">
                        <div class="categories">
                            ${Array.isArray(metadata.categories) ? 
                                metadata.categories.map(cat => 
                                    `<span class="${cat.color}">${cat.name}</span>`
                                ).join('') : ''}
                        </div>
                    </div>
                </div>
                <div class="article-content">
                    ${marked.parse(content)}
                </div>
            </article>
        `;
        
        articleContainer.innerHTML = articleHTML;
        
    } catch (error) {
        console.error('Error loading article:', error);
        articleContainer.innerHTML = `
        <div id="info">
            <p class="icon"><i class="fa-solid fa-xmark icon-background"></i></p>
            <div>
                <h1 class="name">Can't display article</h1>
                <p class="description titleColor">${error.message}</p>
                <a href="/articles/" class="button">Back to Articles</a>
            </div>
        </div>
        `;
    } finally {
        // Hide loading spinner after processing is complete
        loadingSpinner.style.display = 'none';
    }
}

// Updated markdown parser that's more flexible
function parseMarkdown(markdown) {
    // Normalize line endings and trim
    markdown = markdown.replace(/\r\n/g, '\n').trim();
    
    // Check for front matter (between --- or --- lines)
    const frontMatterRegex = /^---\n([\s\S]+?)\n---\n([\s\S]*)$/;
    const match = markdown.match(frontMatterRegex);
    
    if (!match) {
        // If no front matter, treat entire document as content
        return {
            metadata: {
                title: 'Untitled Article',
                date: new Date().toLocaleDateString(),
                categories: []  // Ensure categories is an empty array by default
            },
            content: markdown
        };
    }
    
    const frontMatter = match[1];
    const content = match[2].trim();
    
    // Parse YAML front matter
    const metadata = parseFrontMatter(frontMatter);
    
    return { metadata, content };
}

// Helper function to parse front matter
function parseFrontMatter(frontMatter) {
    const metadata = { categories: [] };  // Ensure categories is initialized as an array
    const lines = frontMatter.split('\n');
    
    let currentKey = null;
    let currentValue = [];
    
    for (const line of lines) {
        if (line.includes(':')) {
            // If we were building a multi-line value, save it first
            if (currentKey && currentValue.length > 0) {
                metadata[currentKey] = currentValue.join('\n').trim();
                currentValue = [];
            }
            
            // Start new key-value pair
            const [key, ...valueParts] = line.split(':');
            currentKey = key.trim();
            const value = valueParts.join(':').trim();
            
            // Remove surrounding quotes if present
            metadata[currentKey] = value.replace(/^['"](.*)['"]$/, '$1');
        } else if (currentKey && line.trim().startsWith('-')) {
            // Handle array items (like categories)
            if (!metadata[currentKey]) metadata[currentKey] = [];
            metadata[currentKey].push(line.trim().substring(1).trim());
        } else if (currentKey) {
            // Continuation of multi-line value
            currentValue.push(line);
        }
    }
    
    // Ensure categories is always an array
    if (metadata.categories && !Array.isArray(metadata.categories)) {
        metadata.categories = [];
    }

    // Process categories into objects if they are strings
    if (metadata.categories && Array.isArray(metadata.categories)) {
        metadata.categories = metadata.categories.map(cat => {
            const catMatch = cat.match(/name: "(.*?)"\s+color: "(.*?)"/);
            return catMatch ? {
                name: catMatch[1],
                color: catMatch[2]
            } : { name: cat, color: 'default' };
        });
    }
    
    return metadata;
}

document.addEventListener("DOMContentLoaded", fetchFullArticle);
