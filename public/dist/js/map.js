function initialize(branches) {
    var map = new google.maps.Map(document.getElementById('map'), {
      zoom: 10,
      center: new google.maps.LatLng(branches[0].node.latitude, branches[0].node.longitude),
      mapTypeId: google.maps.MapTypeId.ROADMAP
    });
    var infowindow = new google.maps.InfoWindow();
    var marker;
    for (var i = 0; i < branches.length; i++) {
      marker = new google.maps.Marker({
        position: new google.maps.LatLng(branches[i].node.latitude, branches[i].node.longitude),
        map: map
      });

      google.maps.event.addListener(marker, 'click', (function(marker, i) {
        return function() {
          var content = `
            <div class="siteNotice">
                <h1 class="firstHeading">${branches[i].node.name}</h1>
                <div class="bodyContent">
                    <table class="table table-striped table-responsive">
                        <tr>
                        <th>Phone</th>
                        <td>${branches[i].node.phone}</td>
                        </tr>
                        <tr>
                        <th>Email</th>
                        <td>${branches[i].node.email}</td>
                        </tr>
                        <tr>
                        <th>Address</th>
                        <td>${branches[i].node.address} ${branches[i].node.city} ${branches[i].node.state} ${branches[i].node.country}</td>
                        </tr>
                    </table>
                </div>
            </div>
          `;
          infowindow.setContent(content);
          infowindow.open(map, marker);
        }
      })(marker, i));
    }
}

function loadBranches(){
  var promise = new Promise(function(resolve, reject) {
      app.post("query{branches{edges{node{name,address,city,state,country,phone,email,latitude,longitude}}}}", function (result) {
        resolve(result.data.branches.edges)
      });
  });

  promise.then(function (branches) {
    initialize(branches);
  });

}