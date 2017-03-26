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
    if (payload) {
      payload.forEach(message => {
        $('ul.messages').append(prepareChatItem('right', message));
      });
    }
  }

  function resetActiveQueryInStorage() {
    localStorage.removeItem(ACTIVECHAT);
    localStorage.removeItem(LASTQUERY);
  }

  function makeInquiry(query) {
    var promise = new Promise (function (resolve, reject) {
      app.post(`mutation{createInquiry(input:{data:{question:"${query}", bankId:1}}){inquiry{question,id,originalId}}}`, function (result) {
        resolve(result.data.createInquiry.inquiry);
      });
    });

    promise
      .then(function (response) {
        resetActiveQueryInStorage();
        injectNewResponsesIntoChat(['Your query has been taken. Our customer representative will get in touch with you']);
      });
  }

  function getFaqs(query) {
    const promise = new Promise (function (resolve, reject) {
        app.post('query{faqs{edges{node{id,originalId,question,answer}}}}', function (result) {
          resolve(result.data.faqs.edges);
        });
    });

    promise.then(function (result) {
      // console.log(result);
      const fs = FuzzySet();
      fs.add(query);
      // const faqs = Object.assign({}, result);
      let max = 0;
      let bestMatch = '';

      result.forEach(item => {
        const fsResult = fs.get(item.node.question);
        if (fsResult[0][0] > max) {
          max = fsResult[0][0];
          bestMatch = item.node.answer;
        }
      });
      injectNewResponsesIntoChat([bestMatch]);
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
      return makeInquiry(localStorage.getItem(LASTQUERY));
    }
    // const remoteMessages = ['We create accounts', 'We take card', 'I can help'];
    const remoteMessages = getFaqs(query);
    localStorage.setItem(ACTIVECHAT, true);
    localStorage.setItem(LASTQUERY, query);
    setTimeout(() => {
      const message = ['Not satisfied? Would you like make your request a new Inquiry? Send <strong>YES</strong> to confirm', '<strong>Send YES</strong>'];
      injectNewResponsesIntoChat(message);
    }, 6000);
    injectNewResponsesIntoChat(remoteMessages);
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
