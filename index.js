var request = require('request');
var express = require('express');
var app = express();


app.get('/directions/:profile/:waypoints.:img', function (req, res) {

    var profile = req.params.profile
    var waypoints = req.params.waypoints;
    var img = req.params.img;
    var token = req.query.access_token;

    console.log(profile, waypoints, img, token)

    var waypointsArray = waypoints.split(';');
    var start = waypointsArray[0];
    var end = waypointsArray[waypointsArray.length -1];

    var overlays = [];
    overlays.push('pin-m-star+090('+start+')');
    overlays.push('pin-m-star+900('+end+')');

    console.log(start,end)

    request({
        url:'http://api.tiles.mapbox.com/v4/directions/'+profile+'/'+waypoints+'.json',
        qs: {access_token: token },
        json:true
    }, function(err, resp, body) {
        if(err) return res.send(err);

        overlays.push('geojson('+encodeURIComponent(JSON.stringify({type: 'Feature', properties: {'stroke-width': 5, stroke: '93d1f8'},  geometry:body.routes[0].geometry}))+')');

        request({
            url:'https://api.tiles.mapbox.com/v4/mapbox.streets/'+overlays.join(',')+'/auto/500x500.png',
            qs: {
                access_token: token
            }
        }).pipe(res);
    });
});

var server = app.listen(process.env.PORT || 3000, function () {

  var host = server.address().address;
  var port = server.address().port;

  console.log('listening at http://%s:%s', host, port);

});
