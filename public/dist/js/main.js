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

  $(document).on('click', '.btn-group.btn-group-justified .btn', function () {
    $('#rating-btn').val($(this).text());
    $('.btn-group.btn-group-justified .btn').removeClass('active');
    $(this).addClass('active');
  });

  $('.sidebar .list-group-item').each(function () {
    var path = window.location.pathname;
    if ($(this).attr('href') === path) {
      $(this).addClass('active');
    }
  });

  $(document).ready(function () {
    $('[data-toggle="tooltip"]').tooltip();
    $('.modal.modal-fullscreen .modal-body a').hover(function () {
      $(this).stop().animate({ opacity: 1 }, 200);
    },
    function () {
      $(this).stop().animate({ opacity: 0.5 }, 200);
    });
  });
    
})(jQuery);

