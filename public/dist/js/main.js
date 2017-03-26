
const ACTIVECHAT = 'activeChat';
const LASTQUERY = 'lastQuery';
const CHAT_API_ERROR_MESSAGE = 'Something went wrong, Please try again!';
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

  $(document).on('click', '.widget > .panel-heading', function (event) {
    $('.btn-widget').trigger('click');
    event.preventDefault();
  });

  $(document).on('click', '.btn-group.btn-group-rating .btn', function () {
    $('#rating-btn').val($(this).text());
    $('.btn-group.btn-group-rating .btn').removeClass('active');
    $(this).addClass('active');
  });

  $(document).on('click', '.btn-group.btn-group-gender .btn', function () {
    $('#gender-btn').val($(this).text());
    $('.btn-group.btn-group-gender .btn').removeClass('active');
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
  });

  $('.panel-body').bind('DOMSubtreeModified', function() {
    const s = $('.messages li').last()[0];
    s.scrollIntoView();
  });

  $('#btn-input').on('keyup', function (e) {
    if (e.keyCode === 13) {
      handleChatSubmit();
    }
  });

  $('#btn-chat').on('click', function (e) {
    handleChatSubmit();
  });

  function injectNewResponsesIntoChat(payload) {
    payload.forEach(message => {
      $('ul.messages').append(prepareChatItem('right', message));
    });
  }

  function resetActiveQueryInStorage() {
    localStorage.removeItem(ACTIVECHAT);
    localStorage.removeItem(LASTQUERY);
  }

  function postQueryToApi(query) {
    $.post('https://speedbank.herokuapp.com/',
      {
        name: 'Donald Duck',
        city: 'Duckburg'
      },
      (data, status) => {
        if (status === 200) {
          injectNewResponsesIntoChat(data);
        } else {
          injectNewResponsesIntoChat([CHAT_API_ERROR_MESSAGE]);
        }
      }
    );
    resetActiveQueryInStorage();
  }

  function getQueryToApi(query) {
    $.get('https://speedbank.herokuapp.com/', function (result, status) {
      if (status === 200) {
        injectNewResponsesIntoChat(result);
      } else {
        injectNewResponsesIntoChat([CHAT_API_ERROR_MESSAGE]);
      }
    });
  }

  function injectUsersChat(query) {
    const localMessage = prepareChatItem('left', query);
    $('ul.messages').append(localMessage);
    $('#btn-input').val('');
  }

  function handleChatSubmit() {
    const query = document.getElementById('btn-input').value;
    injectUsersChat(query);
    if (query.toLowerCase() === 'yes' && localStorage.getItem(ACTIVECHAT)) {
      return;
      // return postQueryToApi(localStorage.getItem(LASTQUERY));
    }
    const remoteMessages = ['We create accounts', 'We take card', 'I can help'];
    injectNewResponsesIntoChat(remoteMessages);

    // save query to localStorage
    localStorage.setItem(ACTIVECHAT, true);
    localStorage.setItem(LASTQUERY, query);
    setTimeout(() => {
      const message = ['Not satisfied? Send <strong>YES</strong> for more information', '<strong>Send YES</strong>'];
      injectNewResponsesIntoChat(message);
    }, 6000);
  }
})(jQuery);

function prepareChatItem(position, message) {
  const url = {
    left: '/dist/img/avatar3.png',
    right: '',
  };
  const imgSrc = `<img src="${url[position]}">`;
  const imgTag = url[position] ? imgSrc : '';
  const element = `
    <li class="message ${position} appeared">
      <div class="avatar">${imgTag}</div>
      <div class="text_wrapper">
        <div class="text">${message}</div>
      </div>
    </li>
  `;
  return element;
}

function convertCookieToObject(str) {
  str = str.split(', ');
  const result = {};
  for (let i = 0; i < str.length; i += 1) {
    const cur = str[i].split('=');
    result[cur[0]] = cur[1];
  }
  return result;
}
