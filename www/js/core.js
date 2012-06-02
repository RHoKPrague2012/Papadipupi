var app = {
    map: null,
    DEFAULT_LAT: 49.837982,
    DEFAULT_LNG: 15.458887,
    MAP_ID: 'map-canvas',
    
    init: function() {
        var myOptions = {
            center: new google.maps.LatLng(app.DEFAULT_LAT, app.DEFAULT_LNG),
            zoom: 8,
            mapTypeId: google.maps.MapTypeId.ROADMAP
        };
        app.map = new google.maps.Map(document.getElementById(app.MAP_ID), myOptions);
        
        app.geolocation();
    },
    
    geolocation: function() {
        // Try W3C Geolocation (Preferred)
        if (navigator.geolocation) {
            var browserSupportFlag = true;
            
            navigator.geolocation.getCurrentPosition(function(position) {
                console.log(position);
                var initialLocation = new google.maps.LatLng(
                        position.coords.latitude, 
                        position.coords.longitude
                    );
                
                app.map.setCenter(initialLocation);
                
            }, function() {
                handleNoGeolocation(browserSupportFlag);
            });

        // Browser doesn't support Geolocation
        } else {
            browserSupportFlag = false;
            handleNoGeolocation(browserSupportFlag);
        }
    },
    
    handleNoGeolocation: function (errorFlag) {
        if (errorFlag == true) {
            alert('Geolocation service failed.');
        } else {
            alert('Your browser doesn\'t support geolocation.');
        }
        map.setCenter(new google.maps.LatLng(app.DEFAULT_LAT, app.DEFAULT_LNG));
    }
};

app.init();