console.log('test');
/* global google:ignore */
$(() => {

  const $map = $('#map');
  let map = null;

  let infowindow = null;

  if ($map.length) initMap();

  function initMap() {
  const latLng = { lat: 51.515113, lng: -0.072051 };
  map = new google.maps.Map($map.get(0), {
    zoom: 6,
    center: latLng,
    scrollwheel: false
    // Map styles are stored in another .js file - which is required above the app.js and is available inside this file
  });
}

  const $lat = $('input[name=lat]');
  const $lng = $('input[name=lng]');

  const $input = $('.autocomplete');
  const autocomplete = new google.maps.places.Autocomplete($input[0]);


  autocomplete.addListener('place_changed', () => {
    const place = autocomplete.getPlace(); //will get object in console log what we want is the geometry
    const location = place.geometry.location.toJSON();
    console.log(place.geometry.location.toJSON());
    // $lat.val(location.lat);
    // $lng.val(location.lng);

    const lat = location.lat;
    const lng = location.lng;
    console.log(lat, lng);
    $lat.val(lat);
    $lng.val(lng);
    console.log($lat.val(), $lng.val());





  });
  infowindow.open(map);

});
