var app = {
    DEFAULT_LAT: 49.837982,
    DEFAULT_LNG: 15.458887,
    DEFAULT_ZOOM: 8,
    LOCATED_ZOOM: 12,
    MAP_ID: 'map-canvas',
    
    map: null,
    myLocation: null,
    
    init: function() {
        var myOptions = {
            center: new google.maps.LatLng(app.DEFAULT_LAT, app.DEFAULT_LNG),
            zoom: app.DEFAULT_ZOOM,
            mapTypeId: google.maps.MapTypeId.ROADMAP
        };
        app.map = new google.maps.Map(document.getElementById(app.MAP_ID), myOptions);
        
        app.geolocation();
        app.showIcons();
    },
    
    geolocation: function() {
        // Try W3C Geolocation (Preferred)
        if (navigator.geolocation) {
            var browserSupportFlag = true;
            
            navigator.geolocation.getCurrentPosition(function(position) {
                app.myLocation = new google.maps.LatLng(
                        position.coords.latitude, 
                        position.coords.longitude
                    );
                
                app.map.setCenter(app.myLocation);
                app.map.setZoom(app.LOCATED_ZOOM);
                
                app.viewMyLocation();
                
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
    },
    
    viewMyLocation: function() {
        var marker = new google.maps.Marker({
            position: app.myLocation,
            map: app.map,
            title: 'I\'m here!'
        });
    },
    
    showIcons: function() {
        var layer = new google.maps.FusionTablesLayer({
            query: {
                select: 'lat',
                from: '1w7iYtCf_crnDQ3XnrihVHrAhUCObdLbx_VnDr5Q'
            }
        });
        
        layer.setMap(app.map);
    }
};

app.init();