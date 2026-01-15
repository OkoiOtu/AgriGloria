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
  
  // Comments data
  const commentsData = [
    // ... your comments data from index.js
  ];
  
  // Load article data
  function loadArticle() {
    const article = newsData.find(n => n.id === articleId) || newsData[0];
    
    // Update breadcrumb
    document.getElementById('articleBreadcrumb').textContent = article.title;
    
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
    const isLiked = JSON.parse(localStorage.getItem('agrigloria_likes') || '[]').includes(article.id);
    
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
      document.getElementById('commentsSection').style.display = 'block';
      
      // Add event listeners
      setupArticleActions(article);
  }
    
    // Load related articles
    function loadRelatedArticles(currentArticle) {
        const related = newsData
            .filter(n => n.id !== currentArticle.id && n.category === currentArticle.category)
            .slice(0, 3);
        
        if (related.length > 0) {
            const relatedGrid = document.getElementById('relatedGrid');
            relatedGrid.innerHTML = related.map(article => `
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
                            <span><i class="far fa-calendar"></i> ${new Date(article.date).toLocaleDateString('short')}</span>
                            <span><i class="far fa-eye"></i> ${article.views}</span>
                        </div>
                    </div>
                </div>
            `).join('');
            
            document.getElementById('relatedArticles').style.display = 'block';
        }
    }
    
    // Load comments
    function loadComments(postId) {
        const postComments = commentsData.filter(comment => comment.postId === postId);
        const commentsList = document.getElementById('commentsList');
        
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
        }
    }
    
    // Setup article actions
    function setupArticleActions(article) {
        // Like button
        document.getElementById('likeArticleBtn').addEventListener('click', function() {
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
                
                // Add to localStorage
                let likedArticles = JSON.parse(localStorage.getItem('agrigloria_likes') || '[]');
                likedArticles.push(article.id);
                localStorage.setItem('agrigloria_likes', JSON.stringify(likedArticles));
            }
            
            // Update likes display
            if (likesSpan) {
                likesSpan.innerHTML = `<i class="far fa-heart"></i> ${article.likes} likes`;
            }
        });
        
        // Share button
        document.getElementById('shareArticleBtn').addEventListener('click', function() {
            if (navigator.share) {
                navigator.share({
                    title: article.title,
                    text: article.excerpt,
                    url: window.location.href
                });
            } else {
                // Fallback: Copy to clipboard
                navigator.clipboard.writeText(window.location.href);
                alert('Link copied to clipboard!');
            }
        });
        
        // Print button
        document.getElementById('printArticleBtn').addEventListener('click', function() {
            window.print();
        });
        
        // Comment form
        document.getElementById('commentForm').addEventListener('submit', function(e) {
            e.preventDefault();
            
            const name = document.getElementById('commenterName').value;
            const text = document.getElementById('commentText').value;
            
            if (name && text) {
                // In real app, send to backend
                const newComment = {
                    id: commentsData.length + 1,
                    postId: article.id,
                    author: name,
                    date: new Date().toISOString().split('T')[0],
                    text: text
                };
                
                // Add to comments list
                const commentsList = document.getElementById('commentsList');
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
                if (noComments) {
                    noComments.remove();
                }
                
                commentsList.insertBefore(commentItem, commentsList.firstChild);
                
                // Update comment count
                article.comments++;
                const commentsSpan = document.querySelector('.article-stats span:nth-child(2)');
                if (commentsSpan) {
                    commentsSpan.innerHTML = `<i class="far fa-comments"></i> ${article.comments} comments`;
                }
                
                // Reset form
                this.reset();
                
                // Show success message
                showNotification('Comment posted successfully!');
            }
        });
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