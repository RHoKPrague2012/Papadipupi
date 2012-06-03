var app = {
    DEFAULT_LAT: 49.837982,
    DEFAULT_LNG: 15.458887,
    DEFAULT_ZOOM: 8,
    
    LOCATED_ZOOM: 12,
    MAP_ID: 'map-canvas',
    
    MY_LOCATION_COLOR: 'FE7569',
    SEARCH_COLOR: '6bbd1b',
    
    FUSION_TABLE_ID: '1Rgw4IrY4Zq2J4y2DGCJBLyzq6WoYzpYW0115sgU',
    FUSION_TABLE_SELECT: 'lat',
    FUSION_TABLE_ICON: 'stop',
    FUSION_TABLE_ICON_WARNING: 'pause',
    FUSION_TABLE_ICON_OK: 'go',
    FUSION_TABLE_ICON_NODATA: 'measle_grey',
    
    INFO: {
        NODATA: {
            IMG: 'http://papa-dipupi.rhcloud.com/images/nodata.png',
            TEXT: 'Omlouváme se, v současnosti nejsou k dispozici data pro danou oblast'
        },
        OK: {
            IMG: 'http://papa-dipupi.rhcloud.com/images/ok.png',
            TEXT: 'Voda v této oblasti je nezávadná'
        },
        WARNING: {
            IMG: 'http://papa-dipupi.rhcloud.com/images/orange.png',
            TEXT: 'Zvýšený výskyt potenciálně škodlivých látek'
        },
        BAD: {
            IMG: 'http://papa-dipupi.rhcloud.com/images/red.png',
            TEXT: 'Kontaminace dosahuje kritických hodnot!'
        }
    },
    
    map: null,
    myLocation: null,
    
    init: function() {
        app.initMap();
        app.geolocation();
        app.showIcons();
        app.initSearch();
        //app.showRivers();
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
        var infoWindow = new google.maps.InfoWindow();
        
        var layer = new google.maps.FusionTablesLayer({
            query: {
                select: app.FUSION_TABLE_SELECT,
                from: app.FUSION_TABLE_ID
            },
            styles: [{
                where: 'severity = 0',
                markerOptions: {
                    iconName: app.FUSION_TABLE_ICON_NODATA
                }
            },
            {
                where: 'severity = 1',
                markerOptions: {
                    iconName: app.FUSION_TABLE_ICON_OK
                }
            },
            {
                where: 'severity = 2',
                markerOptions: {
                    iconName: app.FUSION_TABLE_ICON_WARNING
                }
            },
            {
                where: 'severity = 3',
                markerOptions: {
                    iconName: app.FUSION_TABLE_ICON
                }
            }],
            suppressInfoWindows: true
        });
        
        layer.setMap(app.map);
        
        google.maps.event.addListener(layer, 'click', function(e) {
            var html = '<div class="googft-info-window">'+
                            '<img src="{sev_icon}">'+
                            '<p><strong>{description}</strong></p>'+
                            '{over}'+
                        '</div>';
            
            if (e.row.severity.value === '0') {
                infoWindow.setContent(
                    html
                        .replace('{sev_icon}', app.INFO.NODATA.IMG)
                        .replace('{description}', app.INFO.NODATA.TEXT)
                        .replace('{over}', '')
                );
            }
            if (e.row.severity.value === '1') {
                infoWindow.setContent(
                    html
                        .replace('{sev_icon}', app.INFO.OK.IMG)
                        .replace('{description}', app.INFO.OK.TEXT)
                        .replace('{over}', '')
                );
            }
            if (e.row.severity.value === '2') {
                infoWindow.setContent(
                    html
                        .replace('{sev_icon}', app.INFO.WARNING.IMG)
                        .replace('{description}', app.INFO.WARNING.TEXT)
                        .replace('{over}', '<p class="over"><strong>Škodlivé látky: </strong>' + e.row.over.value + '</p>')
                );
            }
            if (e.row.severity.value === '3') {
                infoWindow.setContent(
                    html
                        .replace('{sev_icon}', app.INFO.WARNING.IMG)
                        .replace('{description}', app.INFO.WARNING.TEXT)
                        .replace('{over}', '<p class="over"><strong>Škodlivé látky: </strong>' + e.row.over.value + '</p>')
                );
            }
            
            infoWindow.setPosition(e.latLng);
            infoWindow.open(app.map);
        });
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
    
    showRivers: function() {
        $.get('/data/rivers.json', function(data) {
            $.each(data, function(i, river) {
                if (i === 0 || i === 1) {
                    var riverPath = [];

                    $.each(river.coords, function(i, coords) {
                        riverPath.push(
                            new google.maps.LatLng(coords.lng, coords.lat)
                        );
                    });

                    new google.maps.Polyline({
                        path: riverPath,
                        map: app.map,
                        strokeColor: "#FF0000",
                        strokeOpacity: 1.0,
                        strokeWeight: 2
                    });
                }
            });
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