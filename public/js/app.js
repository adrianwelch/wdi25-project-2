'use strict';

console.log('test');
/* global google:ignore */
$(function () {

  var $map = $('#map');
  var map = null;

  var infowindow = null;

  if ($map.length) initMap();

  function initMap() {
    var latLng = { lat: 51.515113, lng: -0.072051 };
    map = new google.maps.Map($map.get(0), {
      zoom: 6,
      center: latLng,
      scrollwheel: false
      // Map styles are stored in another .js file - which is required above the app.js and is available inside this file
    });
  }

  var $lat = $('input[name=lat]');
  var $lng = $('input[name=lng]');

  var $input = $('.autocomplete');
  var autocomplete = new google.maps.places.Autocomplete($input[0]);

  autocomplete.addListener('place_changed', function () {
    var place = autocomplete.getPlace(); //will get object in console log what we want is the geometry
    var location = place.geometry.location.toJSON();
    console.log(place.geometry.location.toJSON());
    // $lat.val(location.lat);
    // $lng.val(location.lng);

    var lat = location.lat;
    var lng = location.lng;
    console.log(lat, lng);
    $lat.val(lat);
    $lng.val(lng);
    console.log($lat.val(), $lng.val());
  });
  infowindow.open(map);
});