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
    hasLiked: false,
    hasDisliked: false,
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