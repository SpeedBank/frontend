var app = {
    apiUrl: 'https://speedbank.herokuapp.com/api?query=',
    post: function post(query, success){
      $.ajax({
         url: app.apiUrl + query,
         type: "POST",
         beforeSend: function(xhr){ xhr.setRequestHeader('TOKEN', app.getToken())},
         success: success
      });
    },
    convertCookieToObject: function (str) {
      str = str.split(', ');
      const result = {};
      for (let i = 0; i < str.length; i += 1) {
        const cur = str[i].split('=');
        result[cur[0]] = cur[1];
      }
      return result;
    },
    getToken: function () {
        return app.getCookieObj('userInfo').token;
    },
    getCookie: function getCookie(cname) {
        var name = cname + "=";
        var decodedCookie = decodeURIComponent(document.cookie);
        var ca = decodedCookie.split(';');
        for(var i = 0; i <ca.length; i++) {
            var c = ca[i];
            while (c.charAt(0) == ' ') {
                c = c.substring(1);
            }
            if (c.indexOf(name) == 0) {
                return c.substring(name.length, c.length);
            }
        }
        return "";
    },
    getCookieObj: function (key) {
      return JSON.parse(app.getCookie(key));
    },
    getBanks:function () {
        return new Promise(function(resolve, reject) {
              app.post("query{banks{edges{node{id,originalId,name,address,city,state,country,latitude,longitude,logo,banner}}}}", function (result) {
                resolve(result.data.banks.edges);
              });
          });
    },
    getBankAccounts:function () {
        return new Promise(function(resolve, reject) {
              app.post("query{bankAccounts{edges{node{id,originalId,name,number,phone,email,verified}}}}", function (result) {
                resolve(result.data.bankAccounts.edges);
              });
          });
    },
    getBranches:function () {
        return new Promise(function(resolve, reject) {
              app.post("query{branches{edges{node{id,originalId,name,,address,city,state,country,latitude,longitude,bank{name}}}}}", function (result) {
                resolve(result.data.branches.edges);
              });
          });
    },
    getOrderTypes:function () {
        return new Promise(function(resolve, reject) {
              app.post("query{orderTypes{edges{node{id,originalId,title,price,requirements}}}}", function (result) {
                resolve(result.data.orderTypes.edges);
              });
          });
    }
};
