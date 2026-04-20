document.addEventListener('DOMContentLoaded', function() {

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
});


