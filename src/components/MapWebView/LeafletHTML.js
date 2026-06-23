export const LeafletHTML = `
<!DOCTYPE html>
<html>
<head>
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
  <title>Leaflet Geoman Map</title>
  
  <!-- Leaflet CSS & JS -->
  <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
  <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>

  <!-- Leaflet Geoman Drawing Tool CSS & JS -->
  <link rel="stylesheet" href="https://unpkg.com/@geoman-io/leaflet-geoman-free@2.14.0/dist/leaflet-geoman.css" />
  <script src="https://unpkg.com/@geoman-io/leaflet-geoman-free@2.14.0/dist/leaflet-geoman.min.js"></script>

  <!-- Turf.js for accurate Area Calculation -->
  <script src="https://cdn.jsdelivr.net/npm/@turf/turf@6/turf.min.js"></script>

  <style>
    html, body, #map {
      margin: 0;
      padding: 0;
      width: 100%;
      height: 100%;
      background-color: #f3f4f6;
    }
    
    /* Customize Geoman buttons to look modern and fit theme */
    .leaflet-pm-toolbar {
      box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1) !important;
      border-radius: 8px !important;
      border: none !important;
      overflow: hidden;
    }
    .leaflet-bar a {
      background-color: #ffffff !important;
      color: #111827 !important;
      border-bottom: 1px solid #f3f4f6 !important;
    }
    .leaflet-bar a:hover {
      background-color: #f9fafb !important;
      color: #059669 !important;
    }
    .leaflet-bar a.active {
      background-color: #059669 !important;
      color: #ffffff !important;
    }

    /* Premium Custom Layer Switcher Override */
    .leaflet-control-layers {
      border: none !important;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15) !important;
      border-radius: 12px !important;
    }
    .leaflet-control-layers-toggle {
      width: 44px !important;
      height: 44px !important;
      background-size: 20px 20px !important;
      border-radius: 12px !important;
    }

    /* Locate Me FAB Styles */
    .locate-button {
      position: absolute;
      bottom: 230px;
      right: 12px;
      z-index: 1000;
      background: #ffffff;
      border: 1px solid #e5e7eb;
      width: 46px;
      height: 46px;
      border-radius: 23px;
      box-shadow: 0 4px 10px rgba(0, 0, 0, 0.15);
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      color: #374151;
      transition: all 0.2s;
    }
    .locate-button:active {
      background-color: #f3f4f6;
      color: #059669;
      transform: scale(0.95);
    }
  </style>
</head>
<body>
  <div id="map"></div>

  <!-- Locate Me FAB -->
  <button id="locate-btn" class="locate-button" title="Locate My Position">
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><circle cx="12" cy="12" r="3"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line></svg>
  </button>

  <script>
    // Setup Tile Layers
    var streetLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19
    });

    var satelliteLayer = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
      maxZoom: 19
    });

    var labelsLayer = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}', {
      maxZoom: 19
    });

    // Composite Hybrid Satellite View
    var hybridGroup = L.layerGroup([satelliteLayer, labelsLayer]);

    // Initialize map centering on a default coordinate in Tamil Nadu, India (Agriculture zone)
    var map = L.map('map', {
      zoomControl: false,
      attributionControl: false
    }).setView([11.1271, 78.6569], 13);

    // Default to hybrid satellite group (highly request for locating farmlands)
    hybridGroup.addTo(map);

    // Add layer control
    L.control.layers({
      "Satellite Map": hybridGroup,
      "Street Map": streetLayer
    }, null, {
      position: 'topright'
    }).addTo(map);

    // Move Zoom controls to top-right
    L.control.zoom({
      position: 'topright'
    }).addTo(map);

    // Initialize Geoman drawing tools
    map.pm.addControls({
      position: 'topleft',
      drawMarker: false,
      drawCircleMarker: false,
      drawPolyline: false,
      drawRectangle: false,
      drawCircle: false,
      drawPolygon: true,
      editMode: true,
      dragMode: true,
      cutPolygon: false,
      removalMode: true
    });

    // Style drawn polygons
    map.pm.setPathOptions({
      color: '#059669',
      fillColor: '#10b981',
      fillOpacity: 0.25,
      weight: 3
    });

    // Helper to calculate area and notify React Native
    function updateFieldStats(layer) {
      var latlngs = layer.getLatLngs()[0];
      
      // Convert latlngs to GeoJSON format for Turf.js
      var coordinates = [];
      for (var i = 0; i < latlngs.length; i++) {
        coordinates.push([latlngs[i].lng, latlngs[i].lat]);
      }
      // Close the polygon loop for Turf.js
      coordinates.push([latlngs[0].lng, latlngs[0].lat]);

      try {
        var polygon = turf.polygon([coordinates]);
        var areaSqMeters = turf.area(polygon);
        
        // Convert sq meters to acres (1 sq meter = 0.000247105 acres)
        var areaAcres = (areaSqMeters * 0.000247105).toFixed(2);
        
        // Send statistics to React Native
        var data = {
          type: 'polygon_complete',
          acres: areaAcres,
          perimeter: 'Calculated',
          coordinates: coordinates
        };
        
        window.ReactNativeWebView.postMessage(JSON.stringify(data));
      } catch (err) {
        console.error("Area computation failed", err);
      }
    }

    // Listen for polygon creation completion
    map.on('pm:create', function(e) {
      var layer = e.layer;
      
      // Limit to one polygon at a time. If new is drawn, delete old.
      map.eachLayer(function(l) {
        if (l instanceof L.Polygon && l !== layer) {
          map.removeLayer(l);
        }
      });

      updateFieldStats(layer);

      // Listen for updates on the layer after editing or dragging
      layer.on('pm:edit', function() {
        updateFieldStats(layer);
      });
      
      layer.on('pm:dragend', function() {
        updateFieldStats(layer);
      });
    });

    // Listen for polygon removal
    map.on('pm:remove', function(e) {
      var data = {
        type: 'polygon_removed'
      };
      window.ReactNativeWebView.postMessage(JSON.stringify(data));
    });

    // Locate Me GPS tracking
    var locateBtn = document.getElementById('locate-btn');
    var locationCircle = null;
    var currentMarker = null;

    locateBtn.addEventListener('click', function() {
      locateBtn.style.color = '#059669';
      
      if (!navigator.geolocation) {
        alert('Geolocation is not supported by your browser/device.');
        locateBtn.style.color = '#374151';
        return;
      }

      navigator.geolocation.getCurrentPosition(
        function(position) {
          var lat = position.coords.latitude;
          var lon = position.coords.longitude;
          var accuracy = position.coords.accuracy;

          map.setView([lat, lon], 17);

          if (locationCircle) {
            map.removeLayer(locationCircle);
          }

          locationCircle = L.circle([lat, lon], {
            color: '#3b82f6',
            fillColor: '#60a5fa',
            fillOpacity: 0.4,
            radius: accuracy
          }).addTo(map);

          locateBtn.style.color = '#374151';
        },
        function(error) {
          console.warn("Geolocation error: ", error);
          alert('Could not retrieve your location. Please ensure location services are enabled.');
          locateBtn.style.color = '#374151';
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0
        }
      );
    });

    // Attempt to center map on current device location / search results if requested
    function handleNativeMessage(event) {
      try {
        var messageData = event.data;
        // If data is a string, try to parse it as JSON
        if (typeof messageData === 'string') {
          try {
            messageData = JSON.parse(messageData);
          } catch(e) {
            // Ignore non-JSON strings (like hot reload signals)
            return;
          }
        }
        
        if (messageData && messageData.type === 'set_center' && messageData.latitude && messageData.longitude) {
          var lat = parseFloat(messageData.latitude);
          var lon = parseFloat(messageData.longitude);
          
          if (!isNaN(lat) && !isNaN(lon)) {
            map.setView([lat, lon], 16);
            
            if (currentMarker) {
              map.removeLayer(currentMarker);
            }
            
            currentMarker = L.marker([lat, lon]).addTo(map);
            if (messageData.name) {
              currentMarker.bindPopup("<b>" + messageData.name + "</b>").openPopup();
            }
          }
        }
      } catch (e) {
        console.error("Failed to parse parent message", e);
      }
    }

    // Listen to messages from React Native. We bind to both window and document 
    // to cover various Android and iOS WebView versions/configurations.
    window.addEventListener('message', handleNativeMessage);
    document.addEventListener('message', handleNativeMessage);

    // Send a message indicating Leaflet is fully loaded
    setTimeout(function() {
      window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'ready' }));
    }, 500);

  </script>
</body>
</html>
`;
