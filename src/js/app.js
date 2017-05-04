/* global google:ignore */
$(() => {

  const $map = $('#map');
  const $showMap = $('#showMap');
  let map = null;
  const diveData = $('#map').data('dives');
  // const autocomplete = new google.maps.places.Autocomplete(input);

  let infowindow = null;

  if ($map.length) initMap();
  if ($map.length) getLocation();
  if ($showMap.length) showMap();

  function initMap() {
    const latLng = { lat: -7.4749566, lng: 128.646121 };
    map = new google.maps.Map($map.get(0), {
      zoom: 3,
      center: latLng,
      scrollwheel: false
      // Map styles are stored in another .js file - which is required above the app.js and is available inside this file
    });
    addMarker();
  }

  function showMap() {
    const lat = $showMap.data('lat');
    const lng = $showMap.data('lng');
    const latLng = { lat: lat, lng: lng };
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
    for (let i = 0; i < diveData.length; i++) {
      const latitude = diveData[i].latitude;
      const longitude = diveData[i].longitude;
      console.log(latitude, longitude);

      const latLng = { lat: latitude, lng: longitude };
      const marker = new google.maps.Marker({
        position: latLng,
        map
      });
      marker.addListener('click', () => {
        markerClick(marker, diveData[i]);
      });
    }
  }

  function markerClick(marker, diveData) {
    // If there is an open infowindow on the map, close it
    if(infowindow) infowindow.close();

    // Update the infowindow variable to be a new Google InfoWindow
    infowindow = new google.maps.InfoWindow({
      content: `
        <div class="infowindow">
        <a href="/dives/${diveData._id}">
          <h3 class="diveShopInfo">Dive Shop: ${diveData.diveShop}</h3>
          <h3 class="diveShopInfo">${'&star;'.repeat(diveData.stars)}</h3>
        </a>
        <a href="/users/${diveData.createdBy._id}">
          <small>Reviewed by:  ${diveData.createdBy.username}<small>
        </a>
        </div>
      `
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
    infoWindow.setContent(browserHasGeolocation ?
       'Error: The Geolocation service failed.' :
       'Error: Your browser doesn\'t support geolocation.');
  }

  function initialize() {
    const input = document.getElementById('location');
    const autocomplete = new google.maps.places.Autocomplete(input);

    google.maps.event.addListener(autocomplete, 'place_changed', () => {
      const place = autocomplete.getPlace();
      console.log(place);
      const lat = place.geometry.location.lat();
      const lng = place.geometry.location.lng();
      $('input[name="latitude"]').val(lat);
      $('input[name="longitude"]').val(lng);
    });
  }

    // google.maps.event.addDomListener(window, 'load', initialize);

  initialize();

  // });

  // showMap();
//   const $weather = $('#weather');
//   const place = autocomplete.getPlace();
//   const lat = place.geometry.location.lat();
//   const lng = place.geometry.location.lng();
//   console.log(lat, lng);
//   $.get('http://api.wunderground.com/api/10f9a177231a4651833122453170903/tide/q/CA/San_Francisco.json')
//   .done((data => {
//     console.log(data);
//   })
// );

});
