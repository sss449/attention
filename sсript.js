// ========== МАССИВ И ПЕРЕМЕННЫЕ ==========
let posts = [];
let currentUser = "Руслан";

// ========== ФУНКЦИЯ ОТРИСОВКИ ЛЕНТЫ ==========
function renderFeed() {
  const feedContainer = document.getElementById('feed');
  const templateContainer = document.getElementById('form');
  
  if (!feedContainer) {
    console.error('Нет контейнера #feed');
    return;
  }
  
  feedContainer.innerHTML = '';
  
  posts.forEach((post, index) => {
    const templateCard = templateContainer.querySelector('.post-card');
    if (!templateCard) return;
    
    const postCard = templateCard.cloneNode(true);
    
    // Заполняем данными
    const nik = postCard.querySelector('.nik');
    if (nik) nik.textContent = post.author;
    
    const timeElem = postCard.querySelector('.time');
    if (timeElem) {
      timeElem.innerHTML = `
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="10" />
          <polyline points="12 6 12 12 16 14" />
        </svg>
        ${post.lifeTime || 24}ч
      `;
    }
    
    const likeCount = postCard.querySelector('.like-count');
    if (likeCount) likeCount.textContent = post.likes || 0;
    
    const dizCount = postCard.querySelector('.diz-count');
    if (dizCount) dizCount.textContent = post.dislikes || 0;
    
    const viewsElem = postCard.querySelector('.views');
    if (viewsElem) {
      viewsElem.innerHTML = `
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
          <circle cx="12" cy="12" r="3" />
        </svg>
        ${post.views || 0}
      `;
    }
    
    const description = postCard.querySelector('.post-description');
    if (description) description.textContent = post.text;
    
    // Картинка
    const postImageDiv = postCard.querySelector('.post-image');
    if (post.image && postImageDiv) {
      postImageDiv.innerHTML = `<img src="${post.image}" alt="">`;
    } else if (postImageDiv) {
      postImageDiv.innerHTML = '';
    }
    
    // ===== ЛАЙК С ЗАПРЕТОМ ПОВТОРНОГО НАЖАТИЯ =====
    const likeBtn = postCard.querySelector('.like');
    if (likeBtn) {
      const newLikeBtn = likeBtn.cloneNode(true);
      likeBtn.parentNode.replaceChild(newLikeBtn, likeBtn);
      
      newLikeBtn.addEventListener('click', () => {
        if (post.hasLiked) return; // Уже лайкал - выход
        
        post.hasLiked = true;
        post.likes = (post.likes || 0) + 1;
        
        // Если был дизлайк - убираем его
        if (post.hasDisliked) {
          post.hasDisliked = false;
          post.dislikes = (post.dislikes || 0) - 1;
        }
        
        renderFeed();
      });
    }
    
    // ===== ДИЗЛАЙК С ЗАПРЕТОМ ПОВТОРНОГО НАЖАТИЯ =====
    const dizBtn = postCard.querySelector('.diz');
    if (dizBtn) {
      const newDizBtn = dizBtn.cloneNode(true);
      dizBtn.parentNode.replaceChild(newDizBtn, dizBtn);
      
      newDizBtn.addEventListener('click', () => {
        if (post.hasDisliked) return; // Уже дизлайкал - выход
        
        post.hasDisliked = true;
        post.dislikes = (post.dislikes || 0) + 1;
        
        // Если был лайк - убираем его
        if (post.hasLiked) {
          post.hasLiked = false;
          post.likes = (post.likes || 0) - 1;
        }
        
        renderFeed();
      });
    }
    
    feedContainer.appendChild(postCard);
    
    // Просмотры (один раз)
    if (!post.viewCounted) {
      post.viewCounted = true;
      post.views = (post.views || 0) + 1;
    }
  });
}

// ========== СОЗДАНИЕ НОВОГО ПОСТА ==========
function createPost() {
  const descInput = document.querySelector('.des');
  const text = descInput ? descInput.value : '';
  
  let lifeTime = 24;
  const selectedTime = document.querySelector('input[name="post-time"]:checked');
  if (selectedTime) lifeTime = parseInt(selectedTime.value);
  
  let boost = 0;
  const selectedBoost = document.querySelector('input[name="boost-plan"]:checked');
  if (selectedBoost) boost = parseInt(selectedBoost.value);
  
  if (!text.trim()) {
    alert('Напиши описание');
    return;
  }
  
  const newPost = {
    id: Date.now(),
    author: currentUser,
    text: text,
    likes: 0,
    dislikes: 0,
    hasLiked: false,      // ← запрет повторного лайка
    hasDisliked: false,   // ← запрет повторного дизлайка
    views: 0,
    viewCounted: false,
    lifeTime: lifeTime,
    boost: boost,
    image: null,
    createdAt: Date.now()
  };
  
  const fileInput = document.getElementById('file-upload');
  if (fileInput && fileInput.files.length > 0) {
    const reader = new FileReader();
    reader.onload = function(e) {
      newPost.image = e.target.result;
      posts.unshift(newPost);
      renderFeed();
    };
    reader.readAsDataURL(fileInput.files[0]);
  } else {
    posts.unshift(newPost);
    renderFeed();
  }
  
  // Очищаем поля
  if (descInput) descInput.value = '';
  if (fileInput) fileInput.value = '';
  
  const previewLabel = document.getElementById('preview-label');
  if (previewLabel) {
    previewLabel.style.backgroundImage = '';
    const uploadText = document.getElementById('upload-text');
    if (uploadText) uploadText.textContent = '+';
  }
  
  const overlay = document.querySelector('.overlay');
  if (overlay) overlay.classList.remove('active');
}

// ========== ВСЕ СОБЫТИЯ ==========
document.addEventListener('DOMContentLoaded', function() {
  // Превью картинки
  const fileInput = document.getElementById('file-upload');
  const previewLabel = document.getElementById('preview-label');
  const uploadText = document.getElementById('upload-text');

  if (fileInput) {
    fileInput.addEventListener('change', function() {
      if (this.files && this.files[0]) {
        const reader = new FileReader();
        reader.onload = function(e) {
          previewLabel.style.backgroundImage = `url('${e.target.result}')`;
          previewLabel.style.backgroundSize = 'cover';
          previewLabel.style.backgroundPosition = 'center';
          if (uploadText) uploadText.style.display = 'none';
        };
        reader.readAsDataURL(this.files[0]);
      }
    });
  }
  
  // Модалка
  const addBtn = document.getElementById('addPostBtn');
  const modal = document.querySelector('.overlay');

  if (addBtn && modal) {
    addBtn.onclick = function() {
      modal.classList.add('active');
    };

    modal.onclick = function(event) {
      if (event.target === modal) {
        modal.classList.remove('active');
      }
    };
  }
  
  // Кнопка публикации
  const publishBtn = document.querySelector('.go');
  if (publishBtn) {
    publishBtn.addEventListener('click', createPost);
  }
  
  // Демо-пост (можно убрать)
  posts = [];
  renderFeed();
});

