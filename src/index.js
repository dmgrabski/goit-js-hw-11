import axios from 'axios';
import Notiflix from 'notiflix';

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
  try {
    const response = await axios.get(`https://pixabay.com/api/?key=${apiKey}&q=${encodeURIComponent(searchQuery)}&image_type=photo&orientation=horizontal&safesearch=true&page=${currentPage}&per_page=40`);
    const images = response.data;

    if (images.hits.length === 0) {
      Notiflix.Report.failure('Oops!', 'Sorry, there are no images matching your search query. Please try again.', 'OK');
      loadMoreBtn.style.display = 'none';
      return;
    }

    currentPage += 1;
    renderGallery(images.hits);
    loadMoreBtn.style.display = 'block';

    if (currentPage > Math.ceil(images.totalHits / 40)) {
      loadMoreBtn.style.display = 'none';
      Notiflix.Report.info('End of Results', "We're sorry, but you've reached the end of search results.", 'OK');
    }
  } catch (error) {
    Notiflix.Report.failure('Oops!', 'There was an error fetching images. Please try again later.', 'OK');
    console.error(error);
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