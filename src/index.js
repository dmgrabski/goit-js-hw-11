const searchForm = document.getElementById('search-form');
const gallery = document.querySelector('.gallery');
const loadMoreBtn = document.querySelector('.load-more');
let currentPage = 1;
let searchQuery = '';

const apiKey = '40965996-859f4faa7c889b6c9b25dbc7d';

searchForm.addEventListener('submit', event => {
  event.preventDefault();
  gallery.innerHTML = '';
  searchQuery = event.currentTarget.elements.searchQuery.value;
  currentPage = 1;
  fetchImages();
});

loadMoreBtn.addEventListener('click', () => {
  fetchImages();
});

async function fetchImages() {
  const response = await fetch(`https://pixabay.com/api/?key=${apiKey}&q=${encodeURIComponent(searchQuery)}&image_type=photo&orientation=horizontal&safesearch=true&page=${currentPage}&per_page=40`);
  const images = await response.json();

  if (images.hits.length === 0) {
    alert("Sorry, there are no images matching your search query. Please try again.");
    loadMoreBtn.style.display = 'none';
    return;
  }

  currentPage += 1;
  renderGallery(images.hits);
  loadMoreBtn.style.display = 'block';

  if (currentPage > Math.ceil(images.totalHits / 40)) {
    loadMoreBtn.style.display = 'none';
    alert("We're sorry, but you've reached the end of search results.");
  }
}

function renderGallery(images) {
  const markup = images.map(image => {
    return `
      <div class="photo-card">
        <img src="${image.webformatURL}" alt="${image.tags}" loading="lazy" />
        <div class="info">
          <p class="info-item">
            <b>Likes: ${image.likes}</b>
          </p>
          <p class="info-item">
            <b>Views: ${image.views}</b>
          </p>
          <p class="info-item">
            <b>Comments: ${image.comments}</b>
          </p>
          <p class="info-item">
            <b>Downloads: ${image.downloads}</b>
          </p>
        </div>
      </div>
    `;
  }).join('');
  gallery.insertAdjacentHTML('beforeend', markup);
}