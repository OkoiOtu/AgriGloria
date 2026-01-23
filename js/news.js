// ======= NEWS ARTICLE PAGE JAVASCRIPT =======
document.addEventListener('DOMContentLoaded', () => {
  // Get article ID from URL
  const urlParams = new URLSearchParams(window.location.search);
  const articleId = parseInt(urlParams.get('id')) || 1;
    
  // Shared news data (same as index.html)
  const newsData = [
    {
      id: 1,
      title: "New High-Yield Layer Chickens Arrived",
      excerpt: "500 new high-yield layer chickens from our trusted breeding partner.",
      content: `<p>We're excited to announce the arrival of 500 new high-yield layer chickens from our trusted breeding partner. These birds are specially bred for optimal egg production and adaptability to our Cross River climate.</p>
      
      <h3>Key Features:</h3>
      <p>These new layer chickens feature:</p>
      <ul>
          <li>High egg production rate (up to 300 eggs per year)</li>
          <li>Excellent disease resistance</li>
          <li>Adaptability to local climate conditions</li>
          <li>Superior feed conversion ratio</li>
      </ul>
      
      <h3>Health & Care:</h3>
      <p>All chickens have been quarantined and are receiving the best care from our veterinary team. They have completed their vaccination schedule and are ready for productive farming.</p>
      
      <h3>Availability:</h3>
      <p>The chickens will be available for purchase starting next week. Early booking is recommended as we expect high demand from both commercial and small-scale farmers.</p>
      
      <p>Contact our sales team to reserve your birds or schedule a farm visit to see them firsthand.</p>`,
      category: "Farm News",
      date: "2024-03-15",
      author: "Okoi Otu",
      views: 1245,
      likes: 42,
      comments: 18,
      featured: true,
      image: "https://images.unsplash.com/photo-1576810623527-b5d5567545ea?w=870&h=580&fit=crop&crop=center"
    },
    // ... rest of your news data from index.js
  ];
  
  // Comments data (empty by default - fill from backend or index.js if available)
  const commentsData = [];
  
  // Load article data
  function loadArticle() {
    const article = newsData.find(n => n.id === articleId) || newsData[0];
    
    // Update breadcrumb
    const bc = document.getElementById('articleBreadcrumb');
    if (bc) bc.textContent = article.title;
    
    // Render article
    renderArticle(article);
    
    // Load related articles
    loadRelatedArticles(article);
    
    // Load comments
    loadComments(article.id);
  }
    
  // Render article
  function renderArticle(article) {
    const articleContent = document.getElementById('articleContent');
    if (!articleContent) return;
    const likedStorage = JSON.parse(localStorage.getItem('agrigloria_likes') || '[]');
    const isLiked = Array.isArray(likedStorage) && likedStorage.includes(article.id);
    
    // Format date
    const date = new Date(article.date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    
    // Get category icon
    function getCategoryIcon(category) {
      const icons = {
        'Farm News': 'fas fa-tractor',
        'Farming Tips': 'fas fa-lightbulb',
        'Success Stories': 'fas fa-trophy',
        'Industry News': 'fas fa-chart-line'
      };
      return icons[category] || 'fas fa-newspaper';
    }
      
    articleContent.innerHTML = `
      <div class="article-main">
        <div class="article-hero-image">
          <img src="${article.image}" alt="${article.title}">
          <div class="article-category-badge">
            <i class="${getCategoryIcon(article.category)}"></i>
            ${article.category}
          </div>
        </div>
          
        <div class="article-content-wrapper">
          <div class="article-header">
            <h1 class="article-title">${article.title}</h1>
            <div class="article-meta">
              <span><i class="fas fa-user"></i> ${article.author}</span>
              <span><i class="far fa-calendar"></i> ${date}</span>
              <span><i class="far fa-clock"></i> 5 min read</span>
            </div>
          </div>
            
          <div class="article-body">
            ${article.content}
          </div>
            
          <div class="article-stats-bar">
            <div class="article-stats">
                <span><i class="far fa-eye"></i> ${article.views.toLocaleString()} views</span>
                <span><i class="far fa-comments"></i> ${article.comments} comments</span>
                <span><i class="far fa-heart"></i> ${article.likes} likes</span>
            </div>
              
            <div class="article-actions">
              <button class="article-action-btn ${isLiked ? 'liked' : ''}" id="likeArticleBtn">
                <i class="${isLiked ? 'fas' : 'far'} fa-heart"></i>
                ${isLiked ? 'Liked' : 'Like'}
              </button>
              <button class="article-action-btn" id="shareArticleBtn">
                <i class="fas fa-share-alt"></i> Share
              </button>
              <button class="article-action-btn" id="printArticleBtn">
                <i class="fas fa-print"></i> Print
              </button>
            </div>
          </div>
        </div>
      </div>
    `;
      
      // Show comments section
      const commentsSection = document.getElementById('commentsSection');
      if (commentsSection) commentsSection.style.display = 'block';
      
      // Add event listeners
      setupArticleActions(article);
  }
    
    // Load related articles
    function loadRelatedArticles(currentArticle) {
        const related = newsData
            .filter(n => n.id !== currentArticle.id && n.category === currentArticle.category)
            .slice(0, 3);
        
        const relatedGrid = document.getElementById('relatedGrid');
        if (!relatedGrid) return;
        
        if (related.length > 0) {
            relatedGrid.innerHTML = related.map(article => {
                const shortDate = new Date(article.date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
                return `
                <div class="related-article">
                    <div class="related-image">
                        <img src="${article.image}" alt="${article.title}">
                    </div>
                    <div class="related-content">
                        <h3 class="related-title">
                            <a href="news.html?id=${article.id}">${article.title}</a>
                        </h3>
                        <p>${article.excerpt}</p>
                        <div class="related-meta">
                            <span><i class="far fa-calendar"></i> ${shortDate}</span>
                            <span><i class="far fa-eye"></i> ${article.views}</span>
                        </div>
                    </div>
                </div>
            `;
            }).join('');
            
            const relatedSection = document.getElementById('relatedArticles');
            if (relatedSection) relatedSection.style.display = 'block';
        } else {
            relatedGrid.innerHTML = '';
            const relatedSection = document.getElementById('relatedArticles');
            if (relatedSection) relatedSection.style.display = 'none';
        }
    }
    
    // Load comments
    function loadComments(postId) {
        const postComments = commentsData.filter(comment => comment.postId === postId);
        const commentsList = document.getElementById('commentsList');
        if (!commentsList) return;
        
        if (postComments.length > 0) {
            commentsList.innerHTML = postComments.map(comment => `
                <div class="comment-item">
                    <div class="comment-header">
                        <span class="comment-author">${comment.author}</span>
                        <span class="comment-date">${new Date(comment.date).toLocaleDateString()}</span>
                    </div>
                    <div class="comment-text">${comment.text}</div>
                </div>
            `).join('');
        } else {
            // show default "no comments" placeholder
            commentsList.innerHTML = `
              <div class="no-comments">
                  <i class="far fa-comment-dots"></i>
                  <p>No comments yet. Be the first to comment!</p>
              </div>
            `;
        }
    }
    
    // Setup article actions
    function setupArticleActions(article) {
        // Like button
        const likeBtn = document.getElementById('likeArticleBtn');
        if (likeBtn) {
            likeBtn.addEventListener('click', function() {
                const isLiked = this.classList.contains('liked');
                const likesSpan = document.querySelector('.article-stats span:nth-child(3)');
                
                if (isLiked) {
                    // Unlike
                    article.likes = Math.max(0, article.likes - 1);
                    this.classList.remove('liked');
                    this.innerHTML = '<i class="far fa-heart"></i> Like';
                    
                    // Remove from localStorage
                    let likedArticles = JSON.parse(localStorage.getItem('agrigloria_likes') || '[]');
                    likedArticles = likedArticles.filter(id => id !== article.id);
                    localStorage.setItem('agrigloria_likes', JSON.stringify(likedArticles));
                } else {
                    // Like
                    article.likes++;
                    this.classList.add('liked');
                    this.innerHTML = '<i class="fas fa-heart"></i> Liked';
                    
                    // Add to localStorage (avoid duplicates)
                    let likedArticles = JSON.parse(localStorage.getItem('agrigloria_likes') || '[]');
                    if (!Array.isArray(likedArticles)) likedArticles = [];
                    if (!likedArticles.includes(article.id)) likedArticles.push(article.id);
                    localStorage.setItem('agrigloria_likes', JSON.stringify(likedArticles));
                }
                
                // Update likes display
                if (likesSpan) {
                    likesSpan.innerHTML = `<i class="far fa-heart"></i> ${article.likes} likes`;
                }
            });
        }
        
        // Share button
        const shareBtn = document.getElementById('shareArticleBtn');
        if (shareBtn) {
            shareBtn.addEventListener('click', async function() {
                if (navigator.share) {
                    try {
                        await navigator.share({
                            title: article.title,
                            text: article.excerpt,
                            url: window.location.href
                        });
                    } catch (err) {
                        // user cancelled or error - ignore
                    }
                } else if (navigator.clipboard && navigator.clipboard.writeText) {
                    try {
                        await navigator.clipboard.writeText(window.location.href);
                        showNotification('Link copied to clipboard!');
                    } catch (err) {
                        // fallback
                        showNotification('Unable to copy link automatically. Please copy manually.');
                    }
                } else {
                    // last resort - select and prompt
                    showNotification('Copy this URL: ' + window.location.href);
                }
            });
        }
        
        // Print button
        const printBtn = document.getElementById('printArticleBtn');
        if (printBtn) {
            printBtn.addEventListener('click', function() {
                window.print();
            });
        }
        
        // Comment form
        const commentForm = document.getElementById('commentForm');
        if (commentForm) {
            commentForm.addEventListener('submit', function(e) {
                e.preventDefault();
                
                const nameEl = document.getElementById('commenterName');
                const textEl = document.getElementById('commentText');
                const name = nameEl ? nameEl.value.trim() : '';
                const text = textEl ? textEl.value.trim() : '';
                
                if (name && text) {
                    // In real app, send to backend
                    const newComment = {
                        id: commentsData.length + 1,
                        postId: article.id,
                        author: name,
                        date: new Date().toISOString().split('T')[0],
                        text: text
                    };
                    
                    // Add to comments list (DOM)
                    const commentsList = document.getElementById('commentsList');
                    if (commentsList) {
                        const commentItem = document.createElement('div');
                        commentItem.className = 'comment-item';
                        commentItem.innerHTML = `
                            <div class="comment-header">
                                <span class="comment-author">${newComment.author}</span>
                                <span class="comment-date">${new Date(newComment.date).toLocaleDateString()}</span>
                            </div>
                            <div class="comment-text">${newComment.text}</div>
                        `;
                        
                        // Remove "no comments" message if exists
                        const noComments = commentsList.querySelector('.no-comments');
                        if (noComments) noComments.remove();
                        
                        commentsList.insertBefore(commentItem, commentsList.firstChild);
                    }
                    
                    // Update comment count
                    article.comments++;
                    const commentsSpan = document.querySelector('.article-stats span:nth-child(2)');
                    if (commentsSpan) {
                        commentsSpan.innerHTML = `<i class="far fa-comments"></i> ${article.comments} comments`;
                    }
                    
                    // Optionally keep commentsData in-memory
                    commentsData.push(newComment);
                    
                    // Reset form
                    this.reset();
                    
                    // Show success message
                    showNotification('Comment posted successfully!');
                }
            });
        }
    }
    
    // Show notification
    function showNotification(message) {
        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.innerHTML = `
            <i class="fas fa-check-circle"></i>
            <span>${message}</span>
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.remove();
        }, 3000);
    }
    
    // Initialize
    loadArticle();
    
    // Add notification styles
    const style = document.createElement('style');
    style.textContent = `
        .notification {
            position: fixed;
            top: 20px;
            right: 20px;
            background: var(--dark-green-color);
            color: white;
            padding: 15px 20px;
            border-radius: 10px;
            display: flex;
            align-items: center;
            gap: 10px;
            box-shadow: 0 5px 20px rgba(0, 0, 0, 0.2);
            z-index: 1000;
            animation: slideIn 0.3s ease;
        }
        
        @keyframes slideIn {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
    `;
    document.head.appendChild(style);
});