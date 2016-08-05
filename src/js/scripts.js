$(document).ready(function() {

  // TESTING -------------------------------------------------------------------

  $('html').addClass('js');

  // INTERACTIONS --------------------------------------------------------------

  interactionsInit();

  function interactionsInit() {

    // 1. Navigation -----------------------------------------------------------

    var navButtonOpen   = $('.header__link--open'),
        navButtonClose  = $('.nav__btn--close'),
        navButtonClose2 = $('.nav__btn--close-2'),
        goTop           = $('.go--top'),
        touchDevice     = 'ontouchstart' in document.documentElement;

    // 1.1. Touch devices ------------------------------------------------------

    // navButtonOpen.on('touchstart', function (event) {
    //   event.preventDefault();
    //
    //   $('body').addClass('nav--open');
    //   return false;
    // });
    //
    // navButtonClose2.on('touchstart', function (event) {
    //   event.preventDefault();
    //
    //   $('body').removeClass('nav--open');
    //   return false;
    // });
    //
    // navButtonClose.on('touchstart', function (event) {
    //   event.preventDefault();
    //
    //   $('body').removeClass('nav--open');
    //   return false;
    // });

    // 1.2. Cursor devices -----------------------------------------------------

    navButtonOpen.click(function (event) {
      event.preventDefault();

      $('body').addClass('nav--open');
      return false;
    });

    navButtonClose.click(function (event) {
      event.preventDefault();

      $('body').removeClass('nav--open');
      return false;
    });

    // if (!touchDevice) {
    //   navButtonClose2.hide();
    // }

    navButtonClose2.click(function (event) {
      event.preventDefault();

      $('body').removeClass('nav--open');
      return false;
    });

    // 2. Go => Top ------------------------------------------------------------

    goTop.click(function (event) {
      event.preventDefault();

      $('html, body').animate({
        scrollTop: $("#header").offset().top
      }, 1000);

      return false;
    });

  };

  // ANIMATIONS ----------------------------------------------------------------

  $('body').addClass('fade--in');

  animationsInit();

  function animationsInit() {

    var header = $('.header'),
        intro  = $('.intro'),
        brand  = $('.intro__brand'),
        logo   = $('.intro__logo'),
        swiper = $('.swiper-container');

    if (header) {
      TweenLite.set(header, {opacity: 1});
    };

    if (intro) {
      // TweenLite.set(test, {opacity: 0});
      // TweenLite.from(intro, 4, {opacity: 0, delay: 0});
      TweenLite.set(intro, {opacity: 1});
      TweenLite.from(brand, 2, {opacity: 0, delay: 1});
      TweenLite.from(logo, 2, {opacity: 0, delay: 2});
      TweenLite.to(intro, 2, {opacity: 0, delay: 8});
      TweenLite.to(intro, 2, {display: 'none', delay: 8});

      // TweenLite.to(intro, 1, {y: '100%', delay: 4});
      // TweenLite.to(intro, 1, {y: '100%', delay: 4});
      // TweenLite.to(intro, 0, {display: 'none', delay: 4});
    };

    if (swiper) {
      TweenLite.set(swiper, {opacity: 1});
    };
  };

  // SWIPER --------------------------------------------------------------------

  setTimeout(swiperInit, 8000);

  function swiperInit() {

    var swiper = new Swiper('.swiper-container', {
      paginationClickable: true,
      pagination: '.swiper-pagination',
      nextButton: '.swiper-button-next',
      prevButton: '.swiper-button-prev',
      centeredSlides: true, // ?
      speed: 500,
      loop: true,
      spaceBetween: 0,
      effect: 'fade',
      autoplay: 5000
    });

  };

});

// $(window).load(function() {
//   //
// });
