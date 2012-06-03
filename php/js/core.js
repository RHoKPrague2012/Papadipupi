var app = {
    DEFAULT_LAT: 49.837982,
    DEFAULT_LNG: 15.458887,
    DEFAULT_ZOOM: 8,
    
    LOCATED_ZOOM: 12,
    MAP_ID: 'map-canvas',
    
    MY_LOCATION_COLOR: 'FE7569',
    SEARCH_COLOR: '6bbd1b',
    
    FUSION_TABLE_ID: '1w7iYtCf_crnDQ3XnrihVHrAhUCObdLbx_VnDr5Q',
    FUSION_TABLE_SELECT: 'lat',
    FUSION_TABLE_ICON: 'stop',
    FUSION_TABLE_ICON_WARNING: 'pause',
    FUSION_TABLE_ICON_OK: 'go',
    FUSION_TABLE_ICON_NODATA: 'measle_grey',
    
    map: null,
    myLocation: null,
    
    init: function() {
        app.initMap();
        app.geolocation();
        app.showIcons();
        app.initSearch();
    },
    
    initMap: function() {
        var options = {
                center: new google.maps.LatLng(app.DEFAULT_LAT, app.DEFAULT_LNG),
                zoom: app.DEFAULT_ZOOM,
                mapTypeId: google.maps.MapTypeId.ROADMAP
            };
        
        app.map = new google.maps.Map(document.getElementById(app.MAP_ID), options);
    },
    
    geolocation: function() {
        // Try W3C Geolocation (Preferred)
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function(position) {
                app.myLocation = new google.maps.LatLng(
                        position.coords.latitude, 
                        position.coords.longitude
                    );
                
                app.map.setCenter(app.myLocation);
                app.map.setZoom(app.LOCATED_ZOOM);
                
                app.viewMyLocation();
                
            }, function() {
                app.handleNoGeolocation();
            });
        }
    },
    
    handleNoGeolocation: function () {
        alert('Geolocation service failed.');
    },
    
    viewMyLocation: function() {
        var marker = new google.maps.Marker({
            position: app.myLocation,
            map: app.map,
            icon: app.getIcon(app.MY_LOCATION_COLOR),
            shadow: app.getShadow(),
            title: 'I\'m here!'
        });
    },
    
    showIcons: function() {
        var layer = new google.maps.FusionTablesLayer({
            query: {
                select: app.FUSION_TABLE_SELECT,
                from: app.FUSION_TABLE_ID
            },
            styles: [{
                markerOptions: {
                    iconName: app.FUSION_TABLE_ICON
                }
            }]
        });
        
        layer.setMap(app.map);
    },
    
    initSearch: function() {
        var input = document.getElementById('search'),
            autocomplete = new google.maps.places.Autocomplete(input),
            marker = app.getMarker(app.SEARCH_COLOR);

        autocomplete.bindTo('bounds', app.map);
        
        google.maps.event.addListener(autocomplete, 'place_changed', function() {
            var place = autocomplete.getPlace();
            if (place.geometry.viewport) {
                app.map.fitBounds(place.geometry.viewport);
            } else {
                app.map.setCenter(place.geometry.location);
                app.map.setZoom(app.LOCATED_ZOOM);
            }

            marker.setPosition(place.geometry.location);
        });
    },
    
    getMarker: function(color) {
        return new google.maps.Marker({
                map: app.map,
                icon: app.getIcon(color),
                shadow: app.getShadow()
            });
    },
    
    getIcon: function(color) {
        return new google.maps.MarkerImage(
            "http://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=%E2%80%A2|" + color,
            new google.maps.Size(21, 34),
            new google.maps.Point(0,0),
            new google.maps.Point(10, 34)
        );
    },
    
    getShadow: function() {
        return new google.maps.MarkerImage(
            "http://chart.apis.google.com/chart?chst=d_map_pin_shadow",
            new google.maps.Size(40, 37),
            new google.maps.Point(0, 0),
            new google.maps.Point(12, 35)
        );
    }
};

app.init();