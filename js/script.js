import galleryItems from './gallery-items.js'; //импорт галереи

/* 
создаем ссылки на элементы
*/

const refs = {
  galleryContainer: document.querySelector('.js-gallery'), // родитель картинок в галерее
  modalWindow: document.querySelector('.js-lightbox'), // модалка
  modalButtonClose: document.querySelector(
    'button[data-action="close-lightbox"]',
  ), // кнопка закрытия в модалке
  modalOverlay: document.querySelector('.lightbox__overlay'), // фон оверлея модалки
  modalImage: document.querySelector('.lightbox__image'), // текущее изображение в модалке
};

// console.log(refs);

/* 
создаем и рендерим разметку по шаблону
*/

const galleryMarkup = createGalleryMarkup(galleryItems);
refs.galleryContainer.insertAdjacentHTML('beforeend', galleryMarkup);

function createGalleryMarkup(item) {
  return item
    .map(({ preview, original, description }) => {
      return `<li class="gallery__item">
      <a class="gallery__link" href="${original}">
        <img
          class="gallery__image"
          src="${preview}"
          data-source="${original}"
          alt="${description}"
        />
      </a>
    </li> \n`;
    })
    .join('');
}
// console.log(galleryMarkup);

/* 
реализовываем делегирование на галерее и открытие модального окна
*/

refs.galleryContainer.addEventListener('click', onGalleryImageClick); // вешаем слушателя на Ul галереи

function onGalleryImageClick(evt) {
  if (evt.target.nodeName !== 'IMG') {
    return;
  } // проверка клика именно по изображению

  evt.preventDefault(); // отменяем переход по ссылке

  refs.modalWindow.classList.add('is-open'); // Открытие модального окна по клику на элементе галереи.
  refs.modalImage.src = evt.target.dataset.source; // Подмена значения атрибута src элемента img.lightbox__image.
  refs.modalImage.alt = evt.target.alt;
}

/*
реализовываем закрытие модального окна по клику на кнопку
*/

refs.modalButtonClose.addEventListener('click', onCloseModal);

function onCloseModal() {
  refs.modalWindow.classList.remove('is-open');
  refs.modalImage.src = '';
  refs.modalImage.alt = '';
}
