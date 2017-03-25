(function($) {
    $('a.page-scroll').bind('click', function(event) {
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

    $('.navbar-collapse ul li a').click(function(){ 
      $('.navbar-toggle:visible').click();
    });

    $('#mainNav').affix({
      offset: {
        top: 100
      }
    });

    $(document).on('click', '.mega-dropdown', function(e) {
      e.stopPropagation()
    })

})(jQuery);
