async function fetchArticles() {
    console.group('fetchArticles()');
    const loadingSpinner = document.getElementById('loading');
    const articlesContainer = document.querySelector('main.container');
    
    if (!articlesContainer) {
        console.error('Could not find container element with selector "main.container"');
        return;
    }
    
    try {
        // Show loading spinner before starting the fetch
        loadingSpinner.style.display = 'block';
        
        console.log('Fetching articles index...');
        const response = await fetch('/assets/content/articles/index.json');
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const articles = await response.json();
        console.log('Articles data:', articles);
        
        if (!Array.isArray(articles) || articles.length === 0) {
            throw new Error('No articles found in the index.');
        }

        // Loop through articles and insert each into the container
        articles.forEach(article => {
            // Ensure categories is always an array
            const categories = Array.isArray(article.categories) ? article.categories : [];
            
            console.log('Creating element for article:', article.title);
            const articleDiv = document.createElement('div');
            articleDiv.classList.add('section', 'articlePreview');

            articleDiv.innerHTML = `
                <div class="preview">
                    <span class="titleContainer">
                        <h3 class="section-title">${article.title || 'Untitled Article'}</h3>
                        <p class="date section-content">${article.date || 'Unknown date'}</p>
                    </span>
                    <p class="section-content previewContent">${article.preview || 'No preview available'}</p>
                </div>
                <div class="readMore">
                    <div class="categories">
                        ${categories.map(cat => `<span class="${cat.color}">${cat.name}</span>`).join('')}
                    </div>
                    <a href="${article.link || '#'}" title="Read more" class="button backButton">
                        <i class="fa-solid fa-arrow-right"></i>
                    </a>
                </div>
            `;

            articlesContainer.appendChild(articleDiv);
            console.log('Article added to DOM:', article.title);
        });
        
        console.log('All articles processed successfully');
    } catch (error) {
        console.error('Error in fetchArticles:', error);
        
        // Display error message in the container
        const errorMessage = document.createElement('div');
        errorMessage.textContent = `Failed to load articles: ${error.message}. Please try again later.`;
        errorMessage.style.color = 'red';
        errorMessage.classList.add('error-message');
        articlesContainer.appendChild(errorMessage);
    } finally {
        // Hide loading spinner after processing is complete
        loadingSpinner.style.display = 'none';
        console.groupEnd();
    }
}

// Initialize only on the articles listing page
document.addEventListener("DOMContentLoaded", () => {
    console.log('DOMContentLoaded event fired');
    const path = window.location.pathname;
    console.log('Current path:', path);
    
    if (path.endsWith('/articles/') || path.endsWith('/articles/index.html')) {
        console.log('Initializing article previews...');
        fetchArticles();
    } else {
        console.log('Not on articles listing page - skipping preview initialization');
    }
});
