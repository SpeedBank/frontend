var app = {
    apiUrl: 'https://speedbank.herokuapp.com/api?query=',
    post: function post(query, success){
      $.ajax({
         url: app.apiUrl + query,
         type: "POST",
         beforeSend: function(xhr){xhr.setRequestHeader('TOKEN', '98a3d9367eab8423ea7938bd85425462');},
         success: success
      });
    }
};
