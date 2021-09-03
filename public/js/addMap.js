window.addEventListener('load', () => {
  
    const bakeryId = document.getElementById('bakeryId').getAttribute('data-id');
    // console.log(bakeryId);
    function getRestaurant() {
      axios
        .get(`/panSonDeMorelos/api/${bakeryId}`)
        .then(response => {
          console.log(response.data.user);
          placeRestaurant(response.data.user);
        })
        .catch(error => {
          console.log(error);
        });
    } 
    
    function placeRestaurant(restaurant) {
        const center = {
          lat: restaurant.location.coordinates[0],
          lng: restaurant.location.coordinates[1]
        };
       
        const map = new google.maps.Map(document.getElementById('mymap'), {
          zoom: 12,
          center: center
        });
        addMarker(center, map, restaurant.username);

        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(function (position) {
            const user_location = {
              lat: position.coords.latitude,
              lng: position.coords.longitude
            };
       
            // Center map with user location
            map.setCenter(user_location);
       
            // Add a marker for your user location
            const ironhackBCNMarker = new google.maps.Marker({
              position: {
                lat: user_location.lat,
                lng: user_location.lng
              },
              map: map,
              label: "You are here."
            });
       
          }, function () {
            console.log('Error in the geolocation service.');
          });
        } else {
          console.log('Browser does not support geolocation.');
        }
    }
    
      function addMarker(location, map, labels) {
      // Add the marker at the clicked location, and add the next-available label
      // from the array of alphabetical characters.
      new google.maps.Marker({
        position: location,
        map: map,
        label: labels
      });
    }
     
    getRestaurant();
  });