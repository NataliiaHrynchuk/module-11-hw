import {fetchImages} from './fetchImages';
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";
import { Notify } from 'notiflix/build/notiflix-notify-aio';

let searchQuery = '';
let page = 1;
let gallery = new SimpleLightbox('.photo-card a', {
    close: true,
    closeText: '×',
    overlayOpasity: 0.8,
    fadeSpeed: 250,
    captionsData: 'alt',
});


const refs = {
    form: document.querySelector('#search-form'),
    // loadMoreBtn: document.querySelector('.load-more'),
    imageContainer: document.querySelector('.gallery'),
    // galleryItems: document.querySelectorAll('.gallery__item')
    scrollGuard: document.querySelector('.scroll-guard'),
    input: document.querySelector('input')
};
// refs.loadMoreBtn.classList.add("is-hidden");

const options = {
    rootMargin: "200px",
    threshold: 1.0,
}
const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            console.log('INTERSECTING!');
            fetchImages(searchQuery, page)
                .then((data) => {
                    // console.log(data.hits);
                    // console.log(`totalHits: ${data.totalHits}`);
                    const totalPages = data.totalHits / 40;  
        if( page > totalPages && totalPages !== 0) {
            Notify.warning("We're sorry, but you've reached the end of search results.")
        }
                    const { hits } = data;
                    hits.map(hit => {
                        const {
                            webformatURL,
                            largeImageURL,
                            tags,
                            likes,
                            views,
                            comments,
                            downloads
                        } = hit;
                        // console.log(`webformatURL: ${webformatURL}, largeImageURL: ${largeImageURL}, tags: ${tags}, likes: ${likes}, views: ${views}, comments: ${comments}, downloads: ${downloads}`);
                        console.log('this is fetch from observer');
                        refs.imageContainer.insertAdjacentHTML("beforeend", renderImagesList(webformatURL, largeImageURL, tags, likes, views, comments, downloads));
                        gallery.on('show.SimpleLightbox', function (e) {
                    e.preventDefault();
                    sourceAttr: 'href';
                });
                gallery.refresh();
                    });
                    page += 1;
                })
        }
    })    
    
}, options);


const renderImagesList = (webformatURL, largeImageURL, tags, likes, views, comments, downloads) => {
        return `<div class="photo-card">
    <a class="gallery__item" href="${largeImageURL}">
    <img class="gallery__image" src="${webformatURL}" alt="${tags}" loading="lazy" />
    </a>
    <div class="info">
      <p class="info-item">
        <b>Likes</b> ${likes}
      </p>
      <p class="info-item">
        <b>Views</b> ${views}
      </p>
      <p class="info-item">
        <b>Comments</b> ${comments}
      </p>
      <p class="info-item">
        <b>Downloads</b> ${downloads}
      </p>
    </div>
</div>`
    };


function onSearch(event) {
    event.preventDefault();
    refs.imageContainer.innerHTML = '';
    searchQuery = event.currentTarget.elements.searchQuery.value;
    console.log(searchQuery);
    fetchImages(searchQuery, page)    
        .then((data) => {
            // console.log(data.hits);
            if (data.totalHits > 0) {
                Notify.success(`Hooray! We found ${data.totalHits}images`);
            }
            
            // console.log(`totalHits: ${data.totalHits}`);
            const { hits } = data;
            // console.log(hits.length);
            if (data.totalHits === 0) {
                Notify.failure('Sorry, there are no images matching your search query. Please try again.');
                // console.log("Sorry, there are no images matching your search query. Please try again.");
            }
            // return hits;
       
            hits.map(hit => {
                const {
                    webformatURL,
                    largeImageURL,
                    tags,
                    likes,
                    views,
                    comments,
                    downloads
                } = hit;
                console.log('this is fetch from submit');
                // console.log(`webformatURL: ${webformatURL}, largeImageURL: ${largeImageURL}, tags: ${tags}, likes: ${likes}, views: ${views}, comments: ${comments}, downloads: ${downloads}`);
                refs.imageContainer.insertAdjacentHTML("beforeend", renderImagesList(webformatURL, largeImageURL, tags, likes, views, comments, downloads));
                const { height: cardHeight } = document
  .querySelector(".gallery")
  .firstElementChild.getBoundingClientRect();

window.scrollBy({
  top: cardHeight * 2,
  behavior: "smooth",
});
                gallery.on('show.SimpleLightbox', function (e) {
                    sourceAttr: 'href';
                });
                gallery.refresh();            
            })
            page +=1;
            observer.observe(refs.scrollGuard);
        });
        
        // refs.loadMoreBtn.classList.remove("is-hidden");
    } 


// function onLoadMore(event) {
//     event.preventDefault();
//     fetchImages(searchQuery, page)    
//     .then((data) => {
//         // console.log(data.hits);
//         // console.log(`totalHits: ${data.totalHits}`);
        
//         const {hits} = data;
//         hits.map(hit =>{
//             const {
//                 webformatURL,
//                 largeImageURL,
//                 tags, 
//                 likes,
//                 views, 
//                 comments,
//                 downloads
//             } = hit;
//         console.log(`webformatURL: ${webformatURL}, largeImageURL: ${largeImageURL}, tags: ${tags}, likes: ${likes}, views: ${views}, comments: ${comments}, downloads: ${downloads}`);
//     });
//         page +=1;

// })
// }

 function ofLoadMore() {
    page = 1;
    //  refs.loadMoreBtn.classList.add("is-hidden");
    entry.isIntersecting = false;
    console.log(searchQuery);
    refs.imageContainer.innerHTML = '';
 }
 
refs.imageContainer.innerHTML = '';
refs.form.addEventListener('submit', onSearch);
refs.input.addEventListener('input', ofLoadMore);
// refs.loadMoreBtn.addEventListener('click', onLoadMore);
