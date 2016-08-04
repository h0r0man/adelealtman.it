$('html').addClass('js');

animateLogo();

function animateLogo() {
  var test = document.querySelector('.fade');
  if (test) {
    // TweenLite.set(test, {opacity: 0});
    TweenLite.from(test, 5, {opacity: 0, delay: 1});
  };
};
