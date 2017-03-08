'use strict';

console.log('test');
/* global google:ignore */
$(function () {

  var $map = $('#map');
  var $showMap = $('#showMap');
  var map = null;
  var diveData = $('#map').data('dives');

  var input = document.getElementById('location');
  var autocomplete = new google.maps.places.Autocomplete(input);

  var infowindow = null;

  if ($map.length) initMap();
  if ($map.length) getLocation();
  if ($showMap.length) showMap();

  function initMap() {
    var latLng = { lat: -7.4749566, lng: 128.646121 };
    map = new google.maps.Map($map.get(0), {
      zoom: 3,
      center: latLng,
      scrollwheel: false
      // Map styles are stored in another .js file - which is required above the app.js and is available inside this file
    });
    addMarker();
  }

  function showMap() {
    var lat = $showMap.data('lat');
    var lng = $showMap.data('lng');
    var latLng = { lat: lat, lng: lng };
    map = new google.maps.Map($showMap.get(0), {
      zoom: 14,
      center: latLng,
      scrollwheel: false
    });

    new google.maps.Marker({
      position: latLng,
      map: map
    });
  }

  function addMarker() {
    var _loop = function _loop(i) {
      var latitude = diveData[i].latitude;
      var longitude = diveData[i].longitude;
      console.log(latitude, longitude);

      var latLng = { lat: latitude, lng: longitude };
      var marker = new google.maps.Marker({
        position: latLng,
        map: map
      });
      marker.addListener('click', function () {
        markerClick(marker, diveData[i]);
      });
    };

    for (var i = 0; i < diveData.length; i++) {
      _loop(i);
    }
  }

  function markerClick(marker, diveData) {
    // If there is an open infowindow on the map, close it
    if (infowindow) infowindow.close();

    // Update the infowindow variable to be a new Google InfoWindow
    infowindow = new google.maps.InfoWindow({
      content: '\n    <div class="infowindow">\n    <a href="/dives/' + diveData._id + '">\n      <h3>Dive Shop: ' + diveData.diveShop + '</h3>\n      <h3>' + diveData.stars-- + '</h3>\n    </a>\n    <a href="/users/' + diveData.createdBy._id + '">\n      <small>Reviewed by:  ' + diveData.createdBy.username + '<small>\n    </a>\n    </div>\n    '
    });

    // Finally, open the new InfoWindow
    infowindow.open(map, marker);
  }

  ///////////////////////       geo location       ///////////////////////
  // function getLocation(){
  //   if (navigator.geolocation) {
  //     const infoWindow = new google.maps.InfoWindow();
  //     navigator.geolocation.getCurrentPosition(function(position) {
  //       var pos = {
  //         lat: position.coords.latitude,
  //         lng: position.coords.longitude
  //       };
  //       infoWindow.setPosition(pos);
  //       infoWindow.setContent('You are here!');
  //       infoWindow.open(map);
  //       map.setCenter(pos);
  //     }, function() {
  //       handleLocationError(true, infoWindow, map.getCenter());
  //     });
  //   } else {
  //      // Browser doesn't support Geolocation
  //     handleLocationError(false, infowindow, map.getCenter());
  //   }
  // }


  function handleLocationError(browserHasGeolocation, infoWindow, pos) {
    infoWindow.setPosition(pos);
    infoWindow.setContent(browserHasGeolocation ? 'Error: The Geolocation service failed.' : 'Error: Your browser doesn\'t support geolocation.');
  }

  function initialize() {
    var input = document.getElementById('diveShop');
    var autocomplete = new google.maps.places.Autocomplete(input);

    google.maps.event.addListener(autocomplete, 'place_changed', function () {
      var place = autocomplete.getPlace();
      console.log(place);
      var lat = place.geometry.location.lat();
      var lng = place.geometry.location.lng();
      $('input[name="latitude"]').val(lat);
      $('input[name="longitude"]').val(lng);
    });
  }

  // google.maps.event.addDomListener(window, 'load', initialize);

  initialize();

  // });

  // showMap();
});