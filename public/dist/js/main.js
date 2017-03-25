var tour;

(function ($) {
  $('a.page-scroll').bind('click', function (event) {
    var $anchor = $(this);
    $('html, body').stop().animate({
      scrollTop: ($($anchor.attr('href')).offset().top - 50)
    }, 1250);
    event.preventDefault();
  });

  $('body').scrollspy({
    target: '.navbar-fixed-top',
    offset: 51
  });

  $('.navbar-collapse ul li a').click(function () { 
    $('.navbar-toggle:visible').click();
  });

  $('#mainNav').affix({
    offset: {
      top: 100
    }
  });

  $(document).on('click', '.mega-dropdown', function (event) {
    event.stopPropagation();
  });

  $(document).on('click', '.widget > .panel-heading', function (event) {
    $('.btn-widget').trigger('click');
    event.preventDefault();
  });

  $(document).on('click', '.btn-group.btn-group-justified .btn', function (event) {
    $('#rating-btn').val($(this).text());
    $('.btn-group.btn-group-justified .btn').removeClass('active');
    $(this).toggleClass('active');
  });

  tour = new Tour({
    steps: [
      {
        element: '.navbar-custom',
        title: 'Здравствуйте',
        content: 'Добро пожаловать в виртуальный тур.'
      },
      {
        element: '.panel-heading',
        title: 'Это ссылка',
        content: 'Если нажать на эту ссылку - ничего не произойдет.'
      }
    ],
    backdrop: true,
    storage: false
  });

  tour.init();
  tour.start();

})(jQuery);

