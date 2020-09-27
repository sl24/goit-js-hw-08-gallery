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
    </li> \n \n`;
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

  window.addEventListener('keydown', onEscapePress); // вешаем слушателя для отлова нажатия ктопнки Esc
  window.addEventListener('keydown', onImageScroll);
}

/*
реализовываем закрытие модального окна по клику на кнопку
*/

refs.modalButtonClose.addEventListener('click', onCloseModal);

function onCloseModal() {
  refs.modalWindow.classList.remove('is-open');
  refs.modalImage.src = '';
  refs.modalImage.alt = '';

  window.removeEventListener('keydown', onEscapePress); // удаляем слушателя кнопки Esc
  window.removeEventListener('keydown', onImageScroll);
}

/*
реализовываем закрытие модального окна по клику на оверлей
*/

refs.modalOverlay.addEventListener('click', onOverlayClick);

function onOverlayClick(evt) {
  if (evt.currentTarget === evt.target) {
    onCloseModal();
  }
}

/*
реализовываем закрытие модального окна по нажатию клавиши Escape
*/

function onEscapePress(evt) {
  if (evt.code === 'Escape') {
    onCloseModal();
  }
}

/*
листаем галерею влево-вправо
*/

function onImageScroll(evt) {
  const LEFT_KEY_CODE = 'ArrowLeft';
  const RIGHT_KEY_CODE = 'ArrowRight';

  let getImageIndex = galleryItems.findIndex(
    element => element.original === refs.modalImage.src,
  );

  if (evt.code === LEFT_KEY_CODE) {
    if (getImageIndex === 0) {
      onCloseModal(); // закрытие модального окна при нажатии влево при открытом ПЕРВОМ изображении
      getImageIndex += 1; // чтобы не было ошибки в консолип при обращении к несуществующему индексу. Ничего лучше не придумал!!!
      // return; // либо просто эта строка без закрытия модалки
    }
    getImageIndex -= 1;
    // console.log(getImageIndex);
  }

  if (evt.code === RIGHT_KEY_CODE) {
    if (getImageIndex === galleryItems.length - 1) {
      onCloseModal(); // закрытие модального окна при нажатии вправо при открытом ПОСЛЕДНЕМ изображении
      getImageIndex -= 1; // чтобы не было ошибки в консолип при обращении к несуществующему индексу. Ничего лучше не придумал!!!
      // return; // либо просто эта строка без закрытия модалки
    }
    getImageIndex += 1;
    // console.log(getImageIndex);
  }

  refs.modalImage.src = galleryItems[getImageIndex].original;
  refs.modalImage.alt = galleryItems[getImageIndex].description;
}

// попробовал написать код закрытия модалки когда пробуешь пролистать крайние элементы
// (например, листать влево, когда открыто первое изображение),
// а листать уже нечего. не уверен правильное ли решение, но оно работает
