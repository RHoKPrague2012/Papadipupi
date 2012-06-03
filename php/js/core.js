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
    FUSION_TABLE_ICON: 'placemark_square_highlight',
    
    AUTOCOMPLETE_MIN_LENGTH: 3,
    GEO_REGION: 'cs',
    
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
        var geocoder = new google.maps.Geocoder(),
            marker = app.getMarker(app.SEARCH_COLOR);
        
        $('#search').autocomplete({
            minLength: app.AUTOCOMPLETE_MIN_LENGTH,
            //This bit uses the geocoder to fetch address values
            source: function(request, response) {
                geocoder.geocode({
                    'address': request.term,
                    //'bounds': app.map.getBounds(),
                    'region': app.GEO_REGION
                }, function(results, status) {
                    response($.map(results, function(item) {
                        return {
                            label:  item.formatted_address,
                            value: item.formatted_address,
                            city: item.address_components[0].long_name,
                            latitude: item.geometry.location.lat(),
                            longitude: item.geometry.location.lng()
                        }
                    }));
                })
            },
            
            //This bit is executed upon selection of an address
            select: function(e, ui) {
                var location = new google.maps.LatLng(ui.item.latitude, ui.item.longitude);
                
                marker.setPosition(location);
                app.map.setCenter(location);
                app.map.setZoom(app.LOCATED_ZOOM);
            }
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