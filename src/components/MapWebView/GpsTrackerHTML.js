export const GpsTrackerHTML = `
<!DOCTYPE html>
<html>
<head>
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
  <title>Leaflet GPS walking tracker</title>
  
  <!-- Leaflet CSS & JS -->
  <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
  <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>

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
    
    /* Locate Me FAB Styles */
    .locate-button {
      position: absolute;
      bottom: 24px;
      right: 12px;
      z-index: 1000;
      background: #ffffff;
      border: 1px solid #e5e7eb;
      width: 44px;
      height: 44px;
      border-radius: 22px;
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
    
    /* Current position marker pulse */
    .gps-marker-icon {
      background: #3b82f6;
      border: 2px solid #ffffff;
      border-radius: 50%;
      box-shadow: 0 0 0 6px rgba(59, 130, 246, 0.4);
    }

    .gps-marker-pulse {
      animation: pulse 1.5s infinite;
    }

    @keyframes pulse {
      0% {
        box-shadow: 0 0 0 0px rgba(59, 130, 246, 0.6);
      }
      70% {
        box-shadow: 0 0 0 10px rgba(59, 130, 246, 0.0);
      }
      100% {
        box-shadow: 0 0 0 0px rgba(59, 130, 246, 0.0);
      }
    }
  </style>
</head>
<body>
  <div id="map"></div>

  <!-- Locate Me FAB -->
  <button id="locate-btn" class="locate-button" title="Locate My Position">
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><circle cx="12" cy="12" r="3"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line></svg>
  </button>

  <script>
    // Setup Tile Layers
    var streetLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 20
    });

    var satelliteLayer = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
      maxZoom: 20
    });

    var labelsLayer = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}', {
      maxZoom: 20
    });

    // Composite Hybrid Satellite View
    var hybridGroup = L.layerGroup([satelliteLayer, labelsLayer]);

    // Default center in Tamil Nadu, India
    var defaultLat = 11.1271;
    var defaultLon = 78.6569;

    var map = L.map('map', {
      zoomControl: false,
      attributionControl: false
    }).setView([defaultLat, defaultLon], 15);

    // Default to hybrid satellite
    hybridGroup.addTo(map);

    // Layer control
    L.control.layers({
      "Satellite Map": hybridGroup,
      "Street Map": streetLayer
    }, null, {
      position: 'topright'
    }).addTo(map);

    L.control.zoom({
      position: 'topright'
    }).addTo(map);

    // Tracking state
    var isTracking = false;
    var isSimulation = false;
    var pathPoints = []; // Array of L.LatLng
    var pathPolyline = null;
    var pathPolygon = null;
    
    var currentMarker = null;
    var accuracyCircle = null;
    
    var watchId = null;
    var simInterval = null;
    var simStep = 0;
    var lastSimLat = null;
    var lastSimLon = null;

    // Custom pulse icon for GPS position
    var gpsIcon = L.divIcon({
      className: 'gps-marker-icon gps-marker-pulse',
      iconSize: [12, 12],
      iconAnchor: [6, 6]
    });

    // Simulation path offsets
    var simOffsets = [
      { dLat: 0.0000, dLon: 0.0000 },
      { dLat: 0.0004, dLon: 0.0001 },
      { dLat: 0.0008, dLon: 0.0000 },
      { dLat: 0.0011, dLon: -0.0002 },
      { dLat: 0.0012, dLon: -0.0006 },
      { dLat: 0.0010, dLon: -0.0010 },
      { dLat: 0.0006, dLon: -0.0012 },
      { dLat: 0.0002, dLon: -0.0010 },
      { dLat: -0.0001, dLon: -0.0006 },
      { dLat: -0.0002, dLon: -0.0002 },
      { dLat: 0.0000, dLon: 0.0000 } // close loop
    ];

    function sendToParent(data) {
      if (window.ReactNativeWebView && window.ReactNativeWebView.postMessage) {
        window.ReactNativeWebView.postMessage(JSON.stringify(data));
      } else {
        // Also post to window parent for iframe support in web mock
        window.parent.postMessage(JSON.stringify(data), "*");
      }
    }

    // Update GPS position display
    function updatePosition(lat, lon, accuracy, forceCenter) {
      var latlng = L.latLng(lat, lon);
      
      // Move marker
      if (!currentMarker) {
        currentMarker = L.marker(latlng, { icon: gpsIcon }).addTo(map);
      } else {
        currentMarker.setLatLng(latlng);
      }

      // Move accuracy circle
      if (!accuracyCircle) {
        accuracyCircle = L.circle(latlng, {
          color: '#3b82f6',
          fillColor: '#3b82f6',
          fillOpacity: 0.15,
          weight: 1,
          radius: accuracy
        }).addTo(map);
      } else {
        accuracyCircle.setLatLng(latlng);
        accuracyCircle.setRadius(accuracy);
      }

      if (forceCenter) {
        map.setView(latlng, 17);
      }

      // If active tracking is on, add point to path
      if (isTracking) {
        var addPoint = false;
        
        if (pathPoints.length === 0) {
          addPoint = true;
        } else {
          // Check distance from last point (avoid noise)
          var lastPoint = pathPoints[pathPoints.length - 1];
          var dist = lastPoint.distanceTo(latlng);
          
          // Only add point if moved more than 2 meters, or in simulation mode (where offsets are defined)
          if (dist > 2.0 || isSimulation) {
            addPoint = true;
          }
        }

        if (addPoint) {
          pathPoints.push(latlng);
          updatePathDrawing();
          calculateMetrics(accuracy);
        }
      }
    }

    // Redraw polyline/polygon path
    function updatePathDrawing() {
      if (pathPolyline) {
        map.removeLayer(pathPolyline);
        pathPolyline = null;
      }
      
      if (pathPolygon) {
        map.removeLayer(pathPolygon);
        pathPolygon = null;
      }

      if (pathPoints.length < 2) return;

      // Draw polyline
      pathPolyline = L.polyline(pathPoints, {
        color: '#ef4444',
        weight: 3.5,
        dashArray: '5, 5'
      }).addTo(map);

      // If we have >= 3 points, draw translucent polygon to show area
      if (pathPoints.length >= 3) {
        pathPolygon = L.polygon(pathPoints, {
          color: '#059669',
          fillColor: '#10b981',
          fillOpacity: 0.25,
          weight: 3
        }).addTo(map);
      }
    }

    // Calculate distance and area via Turf.js
    function calculateMetrics(accuracy) {
      if (pathPoints.length === 0) return;

      // Calculate path length
      var totalDistance = 0;
      for (var i = 1; i < pathPoints.length; i++) {
        totalDistance += pathPoints[i-1].distanceTo(pathPoints[i]);
      }
      totalDistance = Math.round(totalDistance);

      // Calculate Turf.js area
      var areaAcres = 0;
      if (pathPoints.length >= 3) {
        try {
          var coordinates = pathPoints.map(function(p) {
            return [p.lng, p.lat];
          });
          // Close the polygon loop for Turf.js
          coordinates.push([pathPoints[0].lng, pathPoints[0].lat]);
          
          var polygon = turf.polygon([coordinates]);
          var areaSqMeters = turf.area(polygon);
          
          // 1 sq meter = 0.000247105 acres
          areaAcres = parseFloat((areaSqMeters * 0.000247105).toFixed(2));
        } catch (err) {
          console.error("Area calculation error", err);
        }
      }

      sendToParent({
        type: 'update_metrics',
        distance: totalDistance,
        area: areaAcres,
        accuracy: Math.round(accuracy),
        pointsCount: pathPoints.length
      });
    }

    // Start native GPS geolocation watching
    function startGpsWatching() {
      if (watchId) return;

      if (!navigator.geolocation) {
        sendToParent({ type: 'gps_unsupported' });
        return;
      }

      watchId = navigator.geolocation.watchPosition(
        function(position) {
          var lat = position.coords.latitude;
          var lon = position.coords.longitude;
          var accuracy = position.coords.accuracy;
          
          // Initial position centering
          var forceCenter = !currentMarker;
          updatePosition(lat, lon, accuracy, forceCenter);
        },
        function(error) {
          console.warn("Geolocation watch error:", error);
          if (error.code === error.PERMISSION_DENIED) {
            sendToParent({ type: 'gps_permission_denied' });
          }
        },
        {
          enableHighAccuracy: true,
          timeout: 15000,
          maximumAge: 0
        }
      );
    }

    function stopGpsWatching() {
      if (watchId) {
        navigator.geolocation.clearWatch(watchId);
        watchId = null;
      }
    }

    // Simulation Walk Loop
    function startSimulation() {
      if (simInterval) return;

      isSimulation = true;
      
      // Determine starting coordinates
      var startLat = defaultLat;
      var startLon = defaultLon;
      
      if (currentMarker) {
        startLat = currentMarker.getLatLng().lat;
        startLon = currentMarker.getLatLng().lng;
      }

      lastSimLat = startLat;
      lastSimLon = startLon;
      
      // Reset simulation step
      simStep = 0;
      map.setView([startLat, startLon], 17);

      // Instantly place starting point
      updatePosition(startLat, startLon, 3.0, true);

      simInterval = setInterval(function() {
        if (!isTracking) return;

        if (simStep >= simOffsets.length) {
          // Simulation complete
          clearInterval(simInterval);
          simInterval = null;
          isTracking = false;
          
          sendToParent({ type: 'simulation_complete' });
          return;
        }

        var offset = simOffsets[simStep];
        var lat = startLat + offset.dLat;
        var lon = startLon + offset.dLon;
        
        lastSimLat = lat;
        lastSimLon = lon;

        updatePosition(lat, lon, 2.5, true);
        simStep++;
      }, 1500);
    }

    function stopSimulation() {
      if (simInterval) {
        clearInterval(simInterval);
        simInterval = null;
      }
      isSimulation = false;
    }

    // Locate Me FAB Click
    document.getElementById('locate-btn').addEventListener('click', function() {
      if (isSimulation && lastSimLat && lastSimLon) {
        map.setView([lastSimLat, lastSimLon], 17);
        return;
      }

      if (!navigator.geolocation) {
        alert('Geolocation is not supported by your browser/device.');
        return;
      }

      navigator.geolocation.getCurrentPosition(
        function(position) {
          var lat = position.coords.latitude;
          var lon = position.coords.longitude;
          var accuracy = position.coords.accuracy;
          updatePosition(lat, lon, accuracy, true);
        },
        function(err) {
          alert('Could not retrieve your location. Check location permissions.');
        },
        { enableHighAccuracy: true }
      );
    });

    // Handle messages from React Native/Web wrapper
    function handleMessage(event) {
      try {
        var data = event.data;
        if (typeof data === 'string') {
          try {
            data = JSON.parse(data);
          } catch(e) {
            return; // Ignore non-JSON
          }
        }
        
        if (!data || !data.type) return;

        switch (data.type) {
          case 'start_tracking':
            isTracking = true;
            if (data.simulate) {
              startSimulation();
            } else {
              stopSimulation();
              startGpsWatching();
            }
            break;
            
          case 'pause_tracking':
            isTracking = false;
            break;
            
          case 'reset_tracking':
            isTracking = false;
            stopSimulation();
            pathPoints = [];
            updatePathDrawing();
            
            // Re-center on current location
            if (currentMarker) {
              map.setView(currentMarker.getLatLng(), 17);
            }
            
            sendToParent({
              type: 'update_metrics',
              distance: 0,
              area: 0,
              accuracy: currentMarker ? 3 : 0,
              pointsCount: 0
            });
            break;
            
          case 'toggle_simulation':
            // Toggle demo simulation mode
            if (data.enabled) {
              // Switch to simulation
              stopGpsWatching();
              isSimulation = true;
              if (isTracking && !simInterval) {
                startSimulation();
              }
            } else {
              // Switch to real GPS
              stopSimulation();
              if (isTracking && !watchId) {
                startGpsWatching();
              }
            }
            break;
            
          case 'request_initial_location':
            // Try to acquire initial position to center map
            if (navigator.geolocation) {
              navigator.geolocation.getCurrentPosition(
                function(pos) {
                  updatePosition(pos.coords.latitude, pos.coords.longitude, pos.coords.accuracy, true);
                },
                function(err) {
                  // Fallback: search default or center on default
                },
                { enableHighAccuracy: false, timeout: 5000 }
              );
            }
            break;
        }
      } catch (err) {
        console.error("Error processing event message", err);
      }
    }

    window.addEventListener('message', handleMessage);
    document.addEventListener('message', handleMessage);

    // Initial setups
    setTimeout(function() {
      sendToParent({ type: 'ready' });
      // Request initial location centering
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          function(pos) {
            updatePosition(pos.coords.latitude, pos.coords.longitude, pos.coords.accuracy, true);
          },
          null,
          { timeout: 5000 }
        );
      }
    }, 500);

  </script>
</body>
</html>
`;
