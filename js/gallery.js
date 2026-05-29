/* ============================================================
   ARTEMIS GALLERY — click-to-enlarge lightbox for return images
   ============================================================ */

(function () {
  'use strict';

  var modal = null;
  var modalImage = null;
  var modalCaption = null;
  var closeBtn = null;
  var prevBtn = null;
  var nextBtn = null;
  var backdrop = null;

  var items = [];
  var currentIndex = 0;
  var lastTrigger = null;

  function getCaption(img) {
    var figure = img.closest('figure');
    var caption = figure && figure.querySelector('figcaption');
    return caption ? caption.textContent.trim() : '';
  }

  function render(index) {
    var item = items[index];
    if (!item) return;

    currentIndex = index;
    modalImage.src = item.src;
    modalImage.alt = item.alt || '';
    modalCaption.textContent = item.caption;
  }

  function showImageAt(index) {
    var total = items.length;
    if (!total) return;

    var nextIndex = (index + total) % total;
    render(nextIndex);
  }

  function openModal(index, triggerEl) {
    if (!modal || !items.length) return;

    lastTrigger = triggerEl || null;
    showImageAt(index);

    document.body.style.overflow = 'hidden';
    modal.classList.add('is-open');
    closeBtn.focus();
  }

  function closeModal() {
    if (!modal) return;

    modal.classList.remove('is-open');
    document.body.style.overflow = '';

    if (lastTrigger) {
      lastTrigger.focus();
    }
    lastTrigger = null;
  }

  function setupItem(img, index) {
    img.classList.add('future__gallery-trigger');
    img.setAttribute('role', 'button');
    img.setAttribute('tabindex', '0');
    img.setAttribute('aria-label', 'Open image in gallery');

    img.addEventListener('click', function () {
      openModal(index, img);
    });

    img.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openModal(index, img);
      }
    });
  }

  function init() {
    modal = document.getElementById('gallery-modal');
    if (!modal) return;

    modalImage = modal.querySelector('.gallery-modal__image');
    modalCaption = modal.querySelector('.gallery-modal__caption');
    closeBtn = modal.querySelector('.gallery-modal__close');
    prevBtn = modal.querySelector('.gallery-modal__nav--prev');
    nextBtn = modal.querySelector('.gallery-modal__nav--next');
    backdrop = modal.querySelector('.gallery-modal__backdrop');

    var imageNodes = document.querySelectorAll('img[data-gallery="artemis-return"]');
    if (!imageNodes.length) return;

    items = Array.prototype.map.call(imageNodes, function (img) {
      return {
        src: img.getAttribute('src'),
        alt: img.getAttribute('alt'),
        caption: getCaption(img)
      };
    });

    Array.prototype.forEach.call(imageNodes, setupItem);

    closeBtn.addEventListener('click', closeModal);
    backdrop.addEventListener('click', closeModal);

    prevBtn.addEventListener('click', function () {
      showImageAt(currentIndex - 1);
    });

    nextBtn.addEventListener('click', function () {
      showImageAt(currentIndex + 1);
    });

    document.addEventListener('keydown', function (e) {
      if (!modal.classList.contains('is-open')) return;

      if (e.key === 'Escape') {
        closeModal();
      } else if (e.key === 'ArrowLeft') {
        showImageAt(currentIndex - 1);
      } else if (e.key === 'ArrowRight') {
        showImageAt(currentIndex + 1);
      }
    });
  }

  document.addEventListener('DOMContentLoaded', init);
}());
