   google.maps.visualRefresh = true;

		    var map;
		    var infoWindow = new google.maps.InfoWindow();
		    var DEFAULT_ICON_URL = 'http://g.etfv.co/http://www.google.com';
		    var latitudeColumn = 'LATITUDE';
		    var longitudeColumn = 'LONGITUDE';
		    var iconUrlColumn = 'ICON';
		    var nationColumn = 'NATION';
		    var nameColumn = 'NAME';
		    var clubColumn = 'CLUB';
		    var selectedNation;
		    var tableID = '1FE9Nx-lm6-670f_aOkv-h9MyGATmeRI8pWKG_rM';
		   	var apiKey = 'AIzaSyDMfbcJAH81sfrsOLV6zykZcvFSUjG3X4E';

		   	var playerMarkers = [];

		   	// Sets the map on all markers in the array.
			function setAllMap(map) {
			  for (var i = 0; i < playerMarkers.length; i++) {
			    playerMarkers[i].setMap(map);
			  }
			}

			// Removes the overlays from the map, but keeps them in the array.
			function clearOverlays() {
			  setAllMap(null);
			}

			// Shows any overlays currently in the array.
			function showOverlays() {
			  setAllMap(map);
			}

			function resetHtml() {

	    		$("#player-name").text('');
			    $("#club").text('');
			    $("#country").text('');

			}

			// Deletes all markers in the array by removing references to them.
			function resetMap() {
				resetHtml();
			  clearOverlays();
			  playerMarkers = [];
			}

		    function createMarker (coordinate, url, name, country, club) {
	        	var marker = new google.maps.Marker({
	        		map: map,
		            position: coordinate,
		            icon: new google.maps.MarkerImage(url)
		        });
	          	google.maps.event.addListener(marker, 'click', function(event) {

			        $("#player-name").text(name);
			        $("#club").text('Club: ' + club);
			        $("#country").text('Country: ' + country);

	          	});
	          	playerMarkers.push(marker);
	        };

	        function fetchData() {

		        // Construct a query to get data from the Fusion Table
		        // EDIT this list to include the variables for columns named above
		        var query = 'SELECT '
		                    + latitudeColumn + ','
		                    + longitudeColumn + ','
		                    + iconUrlColumn + ','
		                    + nationColumn + ','
		                    + nameColumn + ','
		                    + clubColumn + ' FROM '
		                    + tableID;
		        var encodedQuery = encodeURIComponent(query);

		        // Construct the URL
		        var url = ['https://www.googleapis.com/fusiontables/v1/query'];
		            url.push('?sql=' + encodedQuery);
		            url.push('&key=' + apiKey);
		            url.push('&callback=?');

		        // Send the JSONP request using jQuery
		          $.ajax({
		            url: url.join(''),
		            dataType: 'jsonp',
		            success: onDataFetched
		          });
		      }

		      function onDataFetched(data) {
			        var rows = data['rows'];
			        var iconUrl;
			        var coordinate;

			        // Copy each row of data from the response into variables.
			        // Each column is present in the order listed in the query.
			        // Starting from 0.
			        // EDIT this if you've changed the columns, above.
			        for (var i in rows) {
			        	if (rows[i][3] == selectedNation){
			        		coordinate = new google.maps.LatLng(rows[i][0],rows[i][1]);
			        		iconUrl = rows[i][2];
			        		name = rows[i][4];
			        		country = rows[i][3];
			        		club = rows[i][5];

			        		if (iconUrl) {   // ensure not empty
			            		createMarker(coordinate, iconUrl, name, country, club);
			          		} else {
			            		createMarker(coordinate, DEFAULT_ICON_URL, name, country, club);
			          		}

			          	}
			        }
			      }


		    function initialize() {


		    	// These are the styles for the map.
		    	var styles = [{
						"featureType": "water",
						"stylers": [{ "visibility": "simplified" }]
					},{
						"featureType": "transit",
						"stylers": [{ "visibility": "off" }]
						},{
							"featureType": "administrative",
							"elementType": "geometry.fill",
							"stylers": [{ "visibility": "off" }]
						},{
						"featureType": "road",
						"stylers": [{ "visibility": "off" }]
					},{
						"featureType": "poi",
						"stylers": [{ "visibility": "off" }]
					},{
						"featureType": "administrative.province",
						"stylers": [{ "visibility": "off" }]
					},{
						"featureType": "administrative.neighborhood",
						"stylers": [{ "visibility": "off" }]
					},{
						"featureType": "administrative.land_parcel",
						"stylers": [{ "visibility": "off" }]
					}];

				//Create the StyledMapType object from 'styles'
				var styledMap = new google.maps.StyledMapType(styles, {name: "World Cup Map"});

				//Set the map options
		  		var mapOptions = {
		    		zoom: 2,
		    		center: new google.maps.LatLng(20,5),
		    		maxZoom: 5,
		    		minZoom: 2,
		    		mapTypeControl: false,
  					scaleControl: false,
  					streetViewControl: false,
  					overviewMapControl: false,
  					zoomControlOptions: {
  						style: google.maps.ZoomControlStyle.SMALL
  					},
		    		mapTypeControlOptions: {
      					mapTypeIds: [google.maps.MapTypeId.ROADMAP, 'map_style']
    				}
				};

				

				//Create the map
				map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);

				//Add polygon variables

				var australia = [
					new google.maps.LatLng(-28.150109, 153.505954),
					new google.maps.LatLng(-28.862155, 153.606),
					new google.maps.LatLng(-29.328336, 153.337618),
					new google.maps.LatLng(-31.656664, 152.848845),
					new google.maps.LatLng(-32.131046, 152.511854),
					new google.maps.LatLng(-32.403609, 152.529691),
					new google.maps.LatLng(-33.316809, 151.454563),
					new google.maps.LatLng(-33.969446, 151.272763),
					new google.maps.LatLng(-34.013782, 151.099718),
					new google.maps.LatLng(-34.056818, 151.195263),
					new google.maps.LatLng(-34.558336, 150.840518),
					new google.maps.LatLng(-35.0884, 150.836763),
					new google.maps.LatLng(-35.042182, 150.685182),
					new google.maps.LatLng(-35.940555, 150.162472),
					new google.maps.LatLng(-36.923336, 149.902463),
					new google.maps.LatLng(-37.512673, 149.977754),
					new google.maps.LatLng(-37.696391, 149.672818),
					new google.maps.LatLng(-37.9825, 147.759154),
					new google.maps.LatLng(-38.651664, 146.873563),
					new google.maps.LatLng(-38.715973, 146.219272),
					new google.maps.LatLng(-38.916564, 146.296491),
					new google.maps.LatLng(-38.805627, 146.469272),
					new google.maps.LatLng(-39.147227, 146.394136),
					new google.maps.LatLng(-38.845973, 146.142345),
					new google.maps.LatLng(-38.856946, 145.904418),
					new google.maps.LatLng(-38.652282, 145.816145),
					new google.maps.LatLng(-38.545836, 145.416072),
					new google.maps.LatLng(-38.374309, 145.555254),
					new google.maps.LatLng(-38.226936, 145.444272),
					new google.maps.LatLng(-38.505836, 144.901363),
					new google.maps.LatLng(-38.377782, 144.761109),
					new google.maps.LatLng(-38.137009, 145.131272),
					new google.maps.LatLng(-37.868546, 144.917682),
					new google.maps.LatLng(-38.126527, 144.368563),
					new google.maps.LatLng(-38.149164, 144.706345),
					new google.maps.LatLng(-38.285, 144.658872),
					new google.maps.LatLng(-38.324446, 144.363282),
					new google.maps.LatLng(-38.859236, 143.542954),
					new google.maps.LatLng(-38.363891, 142.379336),
					new google.maps.LatLng(-38.267082, 141.750945),
					new google.maps.LatLng(-38.417218, 141.571345),
					new google.maps.LatLng(-37.861664, 140.355927),
					new google.maps.LatLng(-37.199718, 139.751372),
					new google.maps.LatLng(-36.660827, 139.860791),
					new google.maps.LatLng(-36.209727, 139.648036),
					new google.maps.LatLng(-35.679764, 139.0826),
					new google.maps.LatLng(-36.216246, 139.6604),
					new google.maps.LatLng(-35.612509, 139.099563),
					new google.maps.LatLng(-35.503891, 139.1597),
					new google.maps.LatLng(-35.691391, 139.335827),
					new google.maps.LatLng(-35.374446, 139.356609),
					new google.maps.LatLng(-35.653055, 138.137482),
					new google.maps.LatLng(-35.025, 138.514163),
					new google.maps.LatLng(-34.728882, 138.496063),
					new google.maps.LatLng(-34.134927, 138.092254),
					new google.maps.LatLng(-35.132782, 137.748172),
					new google.maps.LatLng(-35.2518, 136.8315),
					new google.maps.LatLng(-34.902009, 137.024082),
					new google.maps.LatLng(-34.938891, 137.434145),
					new google.maps.LatLng(-34.160418, 137.451709),
					new google.maps.LatLng(-33.5593, 137.948582),
					new google.maps.LatLng(-33.278055, 137.814345),
					new google.maps.LatLng(-33.078055, 138.039427),
					new google.maps.LatLng(-32.5325, 137.762972),
					new google.maps.LatLng(-32.992773, 137.774845),
					new google.maps.LatLng(-33.127782, 137.488282),
					new google.maps.LatLng(-33.666109, 137.209963),
					new google.maps.LatLng(-34.040982, 136.413454),
					new google.maps.LatLng(-34.536873, 135.936909),
					new google.maps.LatLng(-34.815209, 135.803791),
					new google.maps.LatLng(-34.7426, 136.006663),
					new google.maps.LatLng(-35.008236, 135.956409),
					new google.maps.LatLng(-34.594755, 135.112318),
					new google.maps.LatLng(-34.435827, 135.208509),
					new google.maps.LatLng(-34.617082, 135.495863),
					new google.maps.LatLng(-34.006527, 135.261082),
					new google.maps.LatLng(-33.637782, 134.840663),
					new google.maps.LatLng(-33.177227, 134.707472),
					new google.maps.LatLng(-33.145555, 134.268718),
					new google.maps.LatLng(-32.720864, 134.074509),
					new google.maps.LatLng(-32.728746, 134.276518),
					new google.maps.LatLng(-32.486664, 134.184145),
					new google.maps.LatLng(-32.541809, 133.852872),
					new google.maps.LatLng(-32.398264, 133.950791),
					new google.maps.LatLng(-32.098055, 133.605863),
					new google.maps.LatLng(-32.213336, 133.417209),
					new google.maps.LatLng(-31.950836, 132.764436),
					new google.maps.LatLng(-32.026946, 132.195936),
					new google.maps.LatLng(-31.474027, 131.148591),
					new google.maps.LatLng(-31.696109, 128.978709),
					new google.maps.LatLng(-32.278336, 127.267763),
					new google.maps.LatLng(-32.266736, 125.972272),
					new google.maps.LatLng(-32.897782, 124.746645),
					new google.maps.LatLng(-32.985555, 124.281936),
					new google.maps.LatLng(-33.779727, 123.734991),
					new google.maps.LatLng(-34.018609, 123.168054),
					new google.maps.LatLng(-33.857573, 123.017827),
					new google.maps.LatLng(-34.028609, 122.118318),
					new google.maps.LatLng(-33.824727, 121.993863),
					new google.maps.LatLng(-33.928882, 120.004991),
					new google.maps.LatLng(-34.446946, 119.325545),
					new google.maps.LatLng(-34.453055, 118.911654),
					new google.maps.LatLng(-34.905555, 118.281663),
					new google.maps.LatLng(-35.030136, 117.837972),
					new google.maps.LatLng(-35.096909, 117.995882),
					new google.maps.LatLng(-35.138336, 117.609709),
					new google.maps.LatLng(-34.999591, 116.460536),
					new google.maps.LatLng(-34.819455, 115.9736),
					new google.maps.LatLng(-34.383609, 115.495672),
					new google.maps.LatLng(-34.362782, 115.122209),
					new google.maps.LatLng(-33.524109, 114.9971),
					new google.maps.LatLng(-33.633055, 115.3636),
					new google.maps.LatLng(-33.264027, 115.712627),
					new google.maps.LatLng(-32.670691, 115.594363),
					new google.maps.LatLng(-32.522218, 115.6945),
					new google.maps.LatLng(-32.781109, 115.700254),
					new google.maps.LatLng(-32.5725, 115.761936),
					new google.maps.LatLng(-31.716391, 115.705818),
					new google.maps.LatLng(-30.504718, 115.047272),
					new google.maps.LatLng(-29.205836, 114.887345),
					new google.maps.LatLng(-28.090973, 114.154291),
					new google.maps.LatLng(-27.198891, 113.936918),
					new google.maps.LatLng(-26.239164, 113.224427),
					new google.maps.LatLng(-26.027773, 113.287654),
					new google.maps.LatLng(-26.654309, 113.643454),
					new google.maps.LatLng(-26.484718, 113.863872),
					new google.maps.LatLng(-25.710418, 113.391109),
					new google.maps.LatLng(-25.540836, 113.469436),
					new google.maps.LatLng(-25.889027, 113.734082),
					new google.maps.LatLng(-26.196946, 113.714009),
					new google.maps.LatLng(-26.028891, 113.878863),
					new google.maps.LatLng(-26.461664, 114.069291),
					new google.maps.LatLng(-26.2925, 114.221445),
					new google.maps.LatLng(-25.847846, 114.258109),
					new google.maps.LatLng(-24.429446, 113.389709),
					new google.maps.LatLng(-23.757227, 113.532209),
					new google.maps.LatLng(-23.472773, 113.763045),
					new google.maps.LatLng(-22.933327, 113.807482),
					new google.maps.LatLng(-22.604718, 113.656372),
					new google.maps.LatLng(-21.976109, 113.933318),
					new google.maps.LatLng(-21.822782, 114.175954),
					new google.maps.LatLng(-22.527782, 114.153872),
					new google.maps.LatLng(-22.4425, 114.372482),
					new google.maps.LatLng(-21.84, 114.651091),
					new google.maps.LatLng(-21.517782, 115.451927),
					new google.maps.LatLng(-20.649164, 116.707491),
					new google.maps.LatLng(-20.676391, 117.685391),
					new google.maps.LatLng(-20.348682, 118.178518),
					new google.maps.LatLng(-20.285836, 118.801091),
					new google.maps.LatLng(-19.968746, 119.080272),
					new google.maps.LatLng(-20.070836, 119.581791),
					new google.maps.LatLng(-19.592227, 121.027482),
					new google.maps.LatLng(-19.123055, 121.488591),
					new google.maps.LatLng(-18.480282, 121.800536),
					new google.maps.LatLng(-18.131391, 122.337491),
					new google.maps.LatLng(-17.243336, 122.174991),
					new google.maps.LatLng(-16.762218, 122.752209),
					new google.maps.LatLng(-16.414582, 122.920254),
					new google.maps.LatLng(-16.455555, 123.060245),
					new google.maps.LatLng(-16.586809, 122.956227),
					new google.maps.LatLng(-17.5975, 123.575272),
					new google.maps.LatLng(-16.996664, 123.592618),
					new google.maps.LatLng(-17.208264, 123.916027),
					new google.maps.LatLng(-16.997982, 123.796372),
					new google.maps.LatLng(-16.893336, 123.891663),
					new google.maps.LatLng(-16.499509, 123.425182),
					new google.maps.LatLng(-16.430282, 123.708882),
					new google.maps.LatLng(-16.171664, 123.5709),
					new google.maps.LatLng(-16.138609, 123.726236),
					new google.maps.LatLng(-16.378891, 123.891372),
					new google.maps.LatLng(-16.245555, 123.964427),
					new google.maps.LatLng(-16.404236, 124.229845),
					new google.maps.LatLng(-16.4067, 124.893045),
					new google.maps.LatLng(-16.329446, 124.400545),
					new google.maps.LatLng(-15.808955, 124.726718),
					new google.maps.LatLng(-15.8643, 124.4002),
					new google.maps.LatLng(-15.478264, 124.457263),
					new google.maps.LatLng(-15.479718, 124.656372),
					new google.maps.LatLng(-15.253336, 124.705272),
					new google.maps.LatLng(-15.520682, 125.181809),
					new google.maps.LatLng(-15.301809, 125.097345),
					new google.maps.LatLng(-15.336009, 124.9121),
					new google.maps.LatLng(-15.161564, 125.044254),
					new google.maps.LatLng(-15.160282, 124.824854),
					new google.maps.LatLng(-14.999718, 125.078327),
					new google.maps.LatLng(-15.162364, 125.164709),
					new google.maps.LatLng(-15.033891, 125.161654),
					new google.maps.LatLng(-15.133127, 125.434772),
					new google.maps.LatLng(-14.747427, 125.136027),
					new google.maps.LatLng(-14.523055, 125.336109),
					new google.maps.LatLng(-14.549446, 125.588882),
					new google.maps.LatLng(-14.222427, 125.618318),
					new google.maps.LatLng(-14.273191, 125.728672),
					new google.maps.LatLng(-14.6301, 125.642245),
					new google.maps.LatLng(-14.404309, 125.722791),
					new google.maps.LatLng(-14.643609, 125.902772),
					new google.maps.LatLng(-14.515209, 126.037618),
					new google.maps.LatLng(-14.13, 126.146654),
					new google.maps.LatLng(-13.926527, 126.017591),
					new google.maps.LatLng(-13.961946, 126.217482),
					new google.maps.LatLng(-14.233055, 126.287772),
					new google.maps.LatLng(-13.964718, 126.502491),
					new google.maps.LatLng(-14.229718, 126.600536),
					new google.maps.LatLng(-13.750973, 126.8579),
					new google.maps.LatLng(-13.971491, 127.128418),
					new google.maps.LatLng(-13.954027, 127.425254),
					new google.maps.LatLng(-14.702782, 128.169436),
					new google.maps.LatLng(-15.498227, 128.020845),
					new google.maps.LatLng(-15.214055, 128.132136),
					new google.maps.LatLng(-15.400691, 128.287182),
					new google.maps.LatLng(-15.065209, 128.192109),
					new google.maps.LatLng(-14.912773, 128.306291),
					new google.maps.LatLng(-15.047082, 128.448291),
					new google.maps.LatLng(-14.8, 128.387682),
					new google.maps.LatLng(-14.758473, 128.535963),
					new google.maps.LatLng(-14.899446, 129.089418),
					new google.maps.LatLng(-15.1825, 129.191072),
					new google.maps.LatLng(-14.839236, 129.229618),
					new google.maps.LatLng(-15.182191, 129.731963),
					new google.maps.LatLng(-14.837773, 129.647336),
					new google.maps.LatLng(-14.767782, 129.944427),
					new google.maps.LatLng(-14.766046, 129.675382),
					new google.maps.LatLng(-14.628055, 129.586563),
					new google.maps.LatLng(-14.535591, 129.772754),
					new google.maps.LatLng(-14.550282, 129.540118),
					new google.maps.LatLng(-14.333336, 129.370236),
					new google.maps.LatLng(-13.994718, 129.732727),
					new google.maps.LatLng(-13.516946, 129.828854),
					new google.maps.LatLng(-13.325273, 130.264436),
					new google.maps.LatLng(-12.925927, 130.1407),
					new google.maps.LatLng(-12.604446, 130.509),
					new google.maps.LatLng(-12.701073, 130.688827),
					new google.maps.LatLng(-12.404655, 130.579272),
					new google.maps.LatLng(-12.640282, 130.896363),
					new google.maps.LatLng(-12.444727, 130.8158),
					new google.maps.LatLng(-12.358336, 131.026918),
					new google.maps.LatLng(-12.149582, 131.024318),
					new google.maps.LatLng(-12.297218, 131.4926),
					new google.maps.LatLng(-12.202364, 132.360927),
					new google.maps.LatLng(-12.38, 132.383609),
					new google.maps.LatLng(-12.150273, 132.444354),
					new google.maps.LatLng(-12.135418, 132.748991),
					new google.maps.LatLng(-12.032782, 132.627591),
					new google.maps.LatLng(-11.658191, 132.6915),
					new google.maps.LatLng(-11.476946, 132.489963),
					new google.maps.LatLng(-11.524727, 132.086772),
					new google.maps.LatLng(-11.306691, 131.764263),
					new google.maps.LatLng(-11.127427, 131.984327),
					new google.maps.LatLng(-11.409727, 132.204954),
					new google.maps.LatLng(-11.14, 132.146682),
					new google.maps.LatLng(-11.130136, 132.340518),
					new google.maps.LatLng(-11.508127, 132.671982),
					new google.maps.LatLng(-11.336946, 132.918027),
					new google.maps.LatLng(-11.716664, 133.183045),
					new google.maps.LatLng(-11.832773, 133.548854),
					new google.maps.LatLng(-11.736109, 133.908327),
					new google.maps.LatLng(-11.854164, 133.8394),
					new google.maps.LatLng(-11.844446, 134.0504),
					new google.maps.LatLng(-12.061664, 134.206636),
					new google.maps.LatLng(-11.995836, 134.771382),
					new google.maps.LatLng(-12.294446, 135.231354),
					new google.maps.LatLng(-11.765555, 135.912754),
					new google.maps.LatLng(-12.190836, 135.669145),
					new google.maps.LatLng(-12.280836, 135.735509),
					new google.maps.LatLng(-12.111946, 136.023036),
					new google.maps.LatLng(-12.471664, 136.0397),
					new google.maps.LatLng(-12.414309, 136.293727),
					new google.maps.LatLng(-12.239718, 136.363918),
					new google.maps.LatLng(-12.166946, 136.177745),
					new google.maps.LatLng(-11.934446, 136.562191),
					new google.maps.LatLng(-12.284518, 136.673236),
					new google.maps.LatLng(-12.171736, 136.775409),
					new google.maps.LatLng(-12.358164, 136.978363),
					new google.maps.LatLng(-12.825273, 136.620791),
					new google.maps.LatLng(-12.779164, 136.494418),
					new google.maps.LatLng(-13.2525, 136.458009),
					new google.maps.LatLng(-13.053755, 136.356627),
					new google.maps.LatLng(-13.277846, 135.927263),
					new google.maps.LatLng(-13.603891, 135.845791),
					new google.maps.LatLng(-13.7625, 136.020263),
					new google.maps.LatLng(-14.194582, 135.869127),
					new google.maps.LatLng(-14.728891, 135.372745),
					new google.maps.LatLng(-14.932773, 135.451354),
					new google.maps.LatLng(-15.904446, 136.765809),
					new google.maps.LatLng(-16.251736, 137.737672),
					new google.maps.LatLng(-16.707364, 138.194827),
					new google.maps.LatLng(-16.899164, 139.010545),
					new google.maps.LatLng(-17.3425, 139.260527),
					new google.maps.LatLng(-17.718473, 140.058582),
					new google.maps.LatLng(-17.451946, 140.8333),
					new google.maps.LatLng(-16.074373, 141.426572),
					new google.maps.LatLng(-15.026527, 141.665527),
					new google.maps.LatLng(-13.897082, 141.465791),
					new google.maps.LatLng(-13.254027, 141.688718),
					new google.maps.LatLng(-12.986391, 141.585663),
					new google.maps.LatLng(-12.691255, 141.796918),
					new google.maps.LatLng(-12.865, 141.940309),
					new google.maps.LatLng(-12.469718, 141.747609),
					new google.maps.LatLng(-12.554518, 141.592391),
					new google.maps.LatLng(-12.381946, 141.668854),
					new google.maps.LatLng(-11.988473, 141.849118),
					new google.maps.LatLng(-12.067773, 142.023663),
					new google.maps.LatLng(-10.949164, 142.147691),
					new google.maps.LatLng(-10.709718, 142.444427),
					new google.maps.LatLng(-10.750764, 142.613145),
					new google.maps.LatLng(-10.950273, 142.509291),
					new google.maps.LatLng(-10.8725, 142.608982),
					new google.maps.LatLng(-11.080555, 142.7883),
					new google.maps.LatLng(-11.833191, 142.859818),
					new google.maps.LatLng(-11.9875, 143.199127),
					new google.maps.LatLng(-12.334309, 143.077472),
					new google.maps.LatLng(-12.413055, 143.275818),
					new google.maps.LatLng(-12.616809, 143.429982),
					new google.maps.LatLng(-12.848891, 143.362318),
					new google.maps.LatLng(-12.879164, 143.514163),
					new google.maps.LatLng(-13.756391, 143.530809),
					new google.maps.LatLng(-14.413336, 143.7822),
					new google.maps.LatLng(-14.487709, 144.011854),
					new google.maps.LatLng(-14.171664, 144.515945),
					new google.maps.LatLng(-14.557364, 144.676772),
					new google.maps.LatLng(-14.945555, 145.3158),
					new google.maps.LatLng(-16.440973, 145.402054),
					new google.maps.LatLng(-16.913055, 145.806091),
					new google.maps.LatLng(-16.899091, 145.955445),
					new google.maps.LatLng(-17.071736, 145.882809),
					new google.maps.LatLng(-17.691664, 146.104263),
					new google.maps.LatLng(-18.238055, 146.009427),
					new google.maps.LatLng(-18.535627, 146.333572),
					new google.maps.LatLng(-18.887018, 146.277618),
					new google.maps.LatLng(-19.402782, 147.139436),
					new google.maps.LatLng(-19.412364, 147.431918),
					new google.maps.LatLng(-19.307955, 147.401491),
					new google.maps.LatLng(-19.824718, 147.669554),
					new google.maps.LatLng(-19.710691, 147.821836),
					new google.maps.LatLng(-20.206391, 148.413454),
					new google.maps.LatLng(-20.063609, 148.452991),
					new google.maps.LatLng(-20.232464, 148.768891),
					new google.maps.LatLng(-20.534727, 148.934418),
					new google.maps.LatLng(-20.456946, 148.790254),
					new google.maps.LatLng(-20.624446, 148.691654),
					new google.maps.LatLng(-21.08, 149.214691),
					new google.maps.LatLng(-22.495173, 149.669482),
					new google.maps.LatLng(-22.383918, 149.814654),
					new google.maps.LatLng(-22.641009, 150.0383),
					new google.maps.LatLng(-22.350555, 149.920809),
					new google.maps.LatLng(-22.149027, 150.043727),
					new google.maps.LatLng(-22.576946, 150.557736),
					new google.maps.LatLng(-22.343055, 150.634554),
					new google.maps.LatLng(-22.731946, 150.819118),
					new google.maps.LatLng(-23.505, 150.867191),
					new google.maps.LatLng(-24.086318, 151.537963),
					new google.maps.LatLng(-23.988891, 151.683872),
					new google.maps.LatLng(-24.608191, 152.131772),
					new google.maps.LatLng(-24.812218, 152.468018),
					new google.maps.LatLng(-25.245136, 152.671491),
					new google.maps.LatLng(-25.288891, 152.907818),
					new google.maps.LatLng(-25.735418, 152.920536),
					new google.maps.LatLng(-25.973327, 153.185518),
					new google.maps.LatLng(-26.308473, 153.072054),
					new google.maps.LatLng(-27.082782, 153.1572),
					new google.maps.LatLng(-27.176664, 153.034563),
					new google.maps.LatLng(-28.150109, 153.505954),
					new google.maps.LatLng(-41.186664, 146.586091),
					new google.maps.LatLng(-40.744791, 147.971836),
					new google.maps.LatLng(-40.901109, 148.273318),
					new google.maps.LatLng(-42.222427, 148.363845),
					new google.maps.LatLng(-41.945455, 148.195263),
					new google.maps.LatLng(-42.117218, 148.079118),
					new google.maps.LatLng(-42.872918, 147.842882),
					new google.maps.LatLng(-42.907082, 147.999691),
					new google.maps.LatLng(-43.227591, 147.995527),
					new google.maps.LatLng(-43.246945, 147.7897),
					new google.maps.LatLng(-43.065555, 147.631618),
					new google.maps.LatLng(-42.938327, 147.7065),
					new google.maps.LatLng(-43.026873, 147.899418),
					new google.maps.LatLng(-42.931945, 147.825809),
					new google.maps.LatLng(-42.830555, 147.557463),
					new google.maps.LatLng(-43.041736, 147.427127),
					new google.maps.LatLng(-42.846664, 147.317472),
					new google.maps.LatLng(-43.269173, 147.247454),
					new google.maps.LatLng(-43.112427, 146.991291),
					new google.maps.LatLng(-43.288718, 147.095336),
					new google.maps.LatLng(-43.648055, 146.833591),
					new google.maps.LatLng(-43.498055, 146.0383),
					new google.maps.LatLng(-43.376318, 145.932682),
					new google.maps.LatLng(-43.325145, 146.234545),
					new google.maps.LatLng(-43.297227, 145.836909),
					new google.maps.LatLng(-42.904445, 145.459691),
					new google.maps.LatLng(-42.256955, 145.205227),
					new google.maps.LatLng(-42.523055, 145.469418),
					new google.maps.LatLng(-42.351109, 145.552045),
					new google.maps.LatLng(-41.544445, 144.858582),
					new google.maps.LatLng(-41.031946, 144.637209),
					new google.maps.LatLng(-40.759173, 144.701354),
					new google.maps.LatLng(-41.186664, 146.586091)
				];

				var brazil = [
					new google.maps.LatLng(-1.817782, -44.695009),
					new google.maps.LatLng(-1.986664, -44.489727),
					new google.maps.LatLng(-2.323682, -44.654936),
					new google.maps.LatLng(-2.146391, -44.450836),
					new google.maps.LatLng(-2.341946, -44.360555),
					new google.maps.LatLng(-2.566809, -44.582091),
					new google.maps.LatLng(-3.2975, -44.786391),
					new google.maps.LatLng(-2.934446, -44.423064),
					new google.maps.LatLng(-2.526664, -44.356946),
					new google.maps.LatLng(-2.413609, -44.033891),
					new google.maps.LatLng(-2.7808, -44.338373),
					new google.maps.LatLng(-2.868891, -44.198336),
					new google.maps.LatLng(-2.548473, -43.928336),
					new google.maps.LatLng(-2.537782, -43.448336),
					new google.maps.LatLng(-2.382782, -43.477709),
					new google.maps.LatLng(-2.365836, -43.3475),
					new google.maps.LatLng(-2.837782, -42.235836),
					new google.maps.LatLng(-2.732218, -41.870836),
					new google.maps.LatLng(-3.023555, -41.248073),
					new google.maps.LatLng(-2.880282, -41.222782),
					new google.maps.LatLng(-2.846527, -39.998755),
					new google.maps.LatLng(-3.724864, -38.496536),
					new google.maps.LatLng(-4.918609, -37.174446),
					new google.maps.LatLng(-5.218473, -35.414446),
					new google.maps.LatLng(-7.172782, -34.792918),
					new google.maps.LatLng(-8.009309, -34.830982),
					new google.maps.LatLng(-9.228891, -35.327509),
					new google.maps.LatLng(-10.489164, -36.389864),
					new google.maps.LatLng(-10.929727, -37.011946),
					new google.maps.LatLng(-10.876882, -37.055182),
					new google.maps.LatLng(-11.099791, -37.154518),
					new google.maps.LatLng(-11.025209, -37.275627),
					new google.maps.LatLng(-11.219446, -37.207227),
					new google.maps.LatLng(-11.429864, -37.371882),
					new google.maps.LatLng(-11.1875, -37.342364),
					new google.maps.LatLng(-12.058336, -37.659173),
					new google.maps.LatLng(-12.937227, -38.317918),
					new google.maps.LatLng(-13.016009, -38.530527),
					new google.maps.LatLng(-12.726455, -38.507364),
					new google.maps.LatLng(-12.581109, -38.697991),
					new google.maps.LatLng(-12.803591, -38.799955),
					new google.maps.LatLng(-12.871255, -38.730136),
					new google.maps.LatLng(-13.538336, -39.080282),
					new google.maps.LatLng(-13.686109, -38.963473),
					new google.maps.LatLng(-14.146109, -39.074591),
					new google.maps.LatLng(-13.925136, -38.9207),
					new google.maps.LatLng(-14.650418, -39.066673),
					new google.maps.LatLng(-15.874173, -38.871946),
					new google.maps.LatLng(-17.166118, -39.209027),
					new google.maps.LatLng(-17.686318, -39.132227),
					new google.maps.LatLng(-18.231255, -39.646255),
					new google.maps.LatLng(-19.603618, -39.787509),
					new google.maps.LatLng(-21.276564, -40.964336),
					new google.maps.LatLng(-21.9825, -40.970146),
					new google.maps.LatLng(-22.346109, -41.763064),
					new google.maps.LatLng(-22.5657, -41.987436),
					new google.maps.LatLng(-22.919173, -42.034446),
					new google.maps.LatLng(-22.953336, -43.094173),
					new google.maps.LatLng(-22.668336, -43.075836),
					new google.maps.LatLng(-22.7366, -43.254309),
					new google.maps.LatLng(-22.951809, -43.147436),
					new google.maps.LatLng(-23.013055, -43.289455),
					new google.maps.LatLng(-23.103055, -43.996946),
					new google.maps.LatLng(-23.018891, -43.606809),
					new google.maps.LatLng(-22.926673, -43.768891),
					new google.maps.LatLng(-23.051109, -44.191946),
					new google.maps.LatLng(-22.920418, -44.353755),
					new google.maps.LatLng(-23.0557, -44.675209),
					new google.maps.LatLng(-23.353682, -44.574309),
					new google.maps.LatLng(-23.362227, -44.943891),
					new google.maps.LatLng(-23.628891, -45.410836),
					new google.maps.LatLng(-23.828055, -45.415482),
					new google.maps.LatLng(-23.767782, -45.890009),
					new google.maps.LatLng(-24.025836, -46.279727),
					new google.maps.LatLng(-23.868755, -46.380418),
					new google.maps.LatLng(-25.015, -48.026118),
					new google.maps.LatLng(-25.152364, -47.914309),
					new google.maps.LatLng(-25.460136, -48.2082),
					new google.maps.LatLng(-25.284727, -48.134055),
					new google.maps.LatLng(-25.296109, -48.395),
					new google.maps.LatLng(-25.480136, -48.4807),
					new google.maps.LatLng(-25.424727, -48.718609),
					new google.maps.LatLng(-25.579446, -48.361809),
					new google.maps.LatLng(-25.8841, -48.770146),
					new google.maps.LatLng(-25.872227, -48.581118),
					new google.maps.LatLng(-26.175691, -48.581046),
					new google.maps.LatLng(-26.132227, -48.793336),
					new google.maps.LatLng(-27.213473, -48.486946),
					new google.maps.LatLng(-27.237082, -48.620564),
					new google.maps.LatLng(-27.864446, -48.5639),
					new google.maps.LatLng(-28.4907, -48.761809),
					new google.maps.LatLng(-28.320282, -48.852782),
					new google.maps.LatLng(-28.617782, -48.842509),
					new google.maps.LatLng(-29.369727, -49.7525),
					new google.maps.LatLng(-31.081109, -50.749455),
					new google.maps.LatLng(-32.171946, -52.069655),
					new google.maps.LatLng(-31.826809, -52.086746),
					new google.maps.LatLng(-31.872918, -51.861255),
					new google.maps.LatLng(-31.471673, -51.2514),
					new google.maps.LatLng(-31.077846, -51.158964),
					new google.maps.LatLng(-31.122227, -50.970836),
					new google.maps.LatLng(-30.457555, -50.5681),
					new google.maps.LatLng(-30.194027, -50.605),
					new google.maps.LatLng(-30.408891, -50.966391),
					new google.maps.LatLng(-30.010555, -51.275036),
					new google.maps.LatLng(-30.799936, -51.277291),
					new google.maps.LatLng(-30.651109, -51.376946),
					new google.maps.LatLng(-31.060973, -51.467782),
					new google.maps.LatLng(-31.337364, -51.963755),
					new google.maps.LatLng(-31.745, -52.217636),
					new google.maps.LatLng(-32.055282, -52.254718),
					new google.maps.LatLng(-32.164382, -52.090764),
					new google.maps.LatLng(-33.115282, -52.628618),
					new google.maps.LatLng(-33.740673, -53.3743),
					new google.maps.LatLng(-33.656955, -53.534446),
					new google.maps.LatLng(-33.141609, -53.521046),
					new google.maps.LatLng(-32.723436, -53.0983),
					new google.maps.LatLng(-32.446109, -53.553336),
					new google.maps.LatLng(-31.974446, -53.875418),
					new google.maps.LatLng(-31.804446, -54.285836),
					new google.maps.LatLng(-31.460909, -54.5941),
					new google.maps.LatLng(-31.249727, -55.228755),
					new google.maps.LatLng(-30.846255, -55.584173),
					new google.maps.LatLng(-31.079791, -56.008918),
					new google.maps.LatLng(-30.795836, -56.001673),
					new google.maps.LatLng(-30.105282, -56.811391),
					new google.maps.LatLng(-30.108891, -57.070973),
					new google.maps.LatLng(-30.292082, -57.213891),
					new google.maps.LatLng(-30.184927, -57.608),
					new google.maps.LatLng(-28.369727, -55.893064),
					new google.maps.LatLng(-28.407709, -55.697536),
					new google.maps.LatLng(-28.217082, -55.748336),
					new google.maps.LatLng(-27.833891, -55.021664),
					new google.maps.LatLng(-27.535555, -54.813609),
					new google.maps.LatLng(-27.129173, -53.807782),
					new google.maps.LatLng(-26.25, -53.650009),
					new google.maps.LatLng(-25.685282, -53.861664),
					new google.maps.LatLng(-25.496391, -54.107573),
					new google.maps.LatLng(-25.573227, -54.598918),
					new google.maps.LatLng(-24.053609, -54.2439),
					new google.maps.LatLng(-23.804927, -54.6257),
					new google.maps.LatLng(-23.994446, -55.031391),
					new google.maps.LatLng(-23.954309, -55.412091),
					new google.maps.LatLng(-22.638473, -55.609173),
					new google.maps.LatLng(-22.288891, -55.849727),
					new google.maps.LatLng(-22.274727, -56.202918),
					new google.maps.LatLng(-22.068682, -56.396527),
					new google.maps.LatLng(-22.274173, -56.8775),
					new google.maps.LatLng(-22.091827, -57.985109),
					new google.maps.LatLng(-20.978755, -57.814591),
					new google.maps.LatLng(-20.168055, -58.158891),
					new google.maps.LatLng(-19.975509, -57.851873),
					new google.maps.LatLng(-19.741391, -58.121118),
					new google.maps.LatLng(-19.043609, -57.704727),
					new google.maps.LatLng(-18.203891, -57.521118),
					new google.maps.LatLng(-17.593891, -57.745509),
					new google.maps.LatLng(-17.259582, -58.390418),
					new google.maps.LatLng(-16.674636, -58.475773),
					new google.maps.LatLng(-16.279164, -58.327509),
					new google.maps.LatLng(-16.263055, -60.160282),
					new google.maps.LatLng(-15.478609, -60.227227),
					new google.maps.LatLng(-15.0975, -60.5714),
					new google.maps.LatLng(-15.093609, -60.2589),
					new google.maps.LatLng(-13.803473, -60.476809),
					new google.maps.LatLng(-13.493118, -61.038982),
					new google.maps.LatLng(-13.538746, -61.840309),
					new google.maps.LatLng(-13.153709, -62.113673),
					new google.maps.LatLng(-13.005836, -62.769727),
					new google.maps.LatLng(-12.659873, -63.0671),
					new google.maps.LatLng(-12.468336, -64.373064),
					new google.maps.LatLng(-11.989446, -65.008346),
					new google.maps.LatLng(-11.274727, -65.390709),
					new google.maps.LatLng(-9.703336, -65.376955),
					new google.maps.LatLng(-9.905764, -66.630482),
					new google.maps.LatLng(-10.694727, -67.703336),
					new google.maps.LatLng(-10.676391, -68.061109),
					new google.maps.LatLng(-10.979727, -68.280909),
					new google.maps.LatLng(-11.116391, -68.620836),
					new google.maps.LatLng(-10.950555, -69.567509),
					new google.maps.LatLng(-11.009164, -70.631391),
					new google.maps.LatLng(-9.428, -70.514664),
					new google.maps.LatLng(-9.995418, -71.296391),
					new google.maps.LatLng(-10.004718, -72.143891),
					new google.maps.LatLng(-9.492636, -72.371673),
					new google.maps.LatLng(-9.400764, -73.2007),
					new google.maps.LatLng(-8.988473, -72.962364),
					new google.maps.LatLng(-8.352364, -73.5332),
					new google.maps.LatLng(-7.948055, -73.771955),
					new google.maps.LatLng(-7.776391, -73.706664),
					new google.maps.LatLng(-7.554373, -74.004591),
					new google.maps.LatLng(-7.359164, -73.931118),
					new google.maps.LatLng(-7.309236, -73.705836),
					new google.maps.LatLng(-6.876946, -73.744173),
					new google.maps.LatLng(-6.447218, -73.1239),
					new google.maps.LatLng(-6.093609, -73.229736),
					new google.maps.LatLng(-5.124718, -72.851964),
					new google.maps.LatLng(-4.518191, -71.902482),
					new google.maps.LatLng(-4.382218, -70.956264),
					new google.maps.LatLng(-4.147709, -70.762436),
					new google.maps.LatLng(-4.139727, -70.320146),
					new google.maps.LatLng(-4.332655, -70.197827),
					new google.maps.LatLng(-4.236873, -69.956927),
					new google.maps.LatLng(-1.337918, -69.378546),
					new google.maps.LatLng(-0.519864, -69.606536),
					new google.maps.LatLng(-0.1575, -70.058064),
					new google.maps.LatLng(0.585, -70.044727),
					new google.maps.LatLng(0.7366, -69.459282),
					new google.maps.LatLng(0.644027, -69.127818),
					new google.maps.LatLng(1.033891, -69.264873),
					new google.maps.LatLng(1.072218, -69.842227),
					new google.maps.LatLng(1.710454, -69.8461),
					new google.maps.LatLng(1.724164, -68.153064),
					new google.maps.LatLng(1.9775, -68.1964),
					new google.maps.LatLng(1.745282, -67.914736),
					new google.maps.LatLng(2.142845, -67.422573),
					new google.maps.LatLng(1.620409, -67.071182),
					new google.maps.LatLng(1.1725, -67.075291),
					new google.maps.LatLng(1.220927, -66.870455),
					new google.maps.LatLng(0.751391, -66.314727),
					new google.maps.LatLng(0.990418, -65.595427),
					new google.maps.LatLng(0.649164, -65.521664),
					new google.maps.LatLng(1.142082, -65.103891),
					new google.maps.LatLng(1.582918, -64.113209),
					new google.maps.LatLng(1.949864, -64.002364),
					new google.maps.LatLng(2.149518, -63.399446),
					new google.maps.LatLng(2.42, -63.365418),
					new google.maps.LatLng(2.471318, -64.034036),
					new google.maps.LatLng(3.589654, -64.190218),
					new google.maps.LatLng(4.286391, -64.781673),
					new google.maps.LatLng(4.127773, -64.592018),
					new google.maps.LatLng(4.109582, -64.126391),
					new google.maps.LatLng(3.886109, -64.017791),
					new google.maps.LatLng(3.958054, -63.335555),
					new google.maps.LatLng(3.560136, -62.878055),
					new google.maps.LatLng(3.676527, -62.734027),
					new google.maps.LatLng(4.038609, -62.728336),
					new google.maps.LatLng(4.182673, -62.440136),
					new google.maps.LatLng(4.160554, -61.848891),
					new google.maps.LatLng(4.506664, -61.313609),
					new google.maps.LatLng(4.519309, -60.987091),
					new google.maps.LatLng(4.952636, -60.578546),
					new google.maps.LatLng(5.2048, -60.730373),
					new google.maps.LatLng(5.245691, -60.114582),
					new google.maps.LatLng(5.0225, -59.983064),
					new google.maps.LatLng(4.52, -60.148473),
					new google.maps.LatLng(4.385136, -59.674446),
					new google.maps.LatLng(3.899445, -59.568609),
					new google.maps.LatLng(3.524164, -59.831946),
					new google.maps.LatLng(2.688191, -59.988473),
					new google.maps.LatLng(2.284718, -59.735491),
					new google.maps.LatLng(1.861391, -59.749027),
					new google.maps.LatLng(1.386527, -59.243964),
					new google.maps.LatLng(1.186873, -58.8107),
					new google.maps.LatLng(1.269618, -58.519618),
					new google.maps.LatLng(1.582782, -58.297227),
					new google.maps.LatLng(1.515691, -58.007155),
					new google.maps.LatLng(1.715836, -57.528064),
					new google.maps.LatLng(1.972218, -57.331946),
					new google.maps.LatLng(1.9445, -56.470636),
					new google.maps.LatLng(1.901045, -55.901736),
					new google.maps.LatLng(2.249164, -56.115836),
					new google.maps.LatLng(2.533054, -55.962782),
					new google.maps.LatLng(2.400136, -55.713682),
					new google.maps.LatLng(2.550554, -54.969446),
					new google.maps.LatLng(2.329191, -54.603782),
					new google.maps.LatLng(2.113473, -54.109655),
					new google.maps.LatLng(2.370973, -53.746109),
					new google.maps.LatLng(2.206809, -52.896464),
					new google.maps.LatLng(2.473891, -52.594455),
					new google.maps.LatLng(3.1574, -52.344936),
					new google.maps.LatLng(4.034164, -51.684064),
					new google.maps.LatLng(4.153609, -51.540282),
					new google.maps.LatLng(3.9725, -51.447782),
					new google.maps.LatLng(4.385691, -51.548127),
					new google.maps.LatLng(3.912845, -51.092991),
					new google.maps.LatLng(3.13, -51.023609),
					new google.maps.LatLng(2.164718, -50.679727),
					new google.maps.LatLng(1.825836, -50.445282),
					new google.maps.LatLng(1.709927, -49.932082),
					new google.maps.LatLng(1.324236, -49.892991),
					new google.maps.LatLng(1.2134, -50.110555),
					new google.maps.LatLng(1.174445, -49.9032),
					new google.maps.LatLng(-0.191391, -51.2975),
					new google.maps.LatLng(-0.745191, -51.694073),
					new google.maps.LatLng(-1.334864, -51.927509),
					new google.maps.LatLng(-1.603055, -52.706955),
					new google.maps.LatLng(-1.535, -52.293336),
					new google.maps.LatLng(-1.692082, -52.208473),
					new google.maps.LatLng(-0.915, -50.852918),
					new google.maps.LatLng(-1.339409, -50.8371),
					new google.maps.LatLng(-1.771664, -50.667227),
					new google.maps.LatLng(-1.898336, -50.814727),
					new google.maps.LatLng(-1.647427, -51.3366),
					new google.maps.LatLng(-2.046391, -51.521946),
					new google.maps.LatLng(-2.279164, -51.447227),
					new google.maps.LatLng(-1.766909, -51.308227),
					new google.maps.LatLng(-2.029582, -50.991118),
					new google.maps.LatLng(-2.345, -51.029164),
					new google.maps.LatLng(-2.5075, -50.843818),
					new google.maps.LatLng(-2.339864, -51.006255),
					new google.maps.LatLng(-2.069164, -50.984309),
					new google.maps.LatLng(-2.223264, -50.716455),
					new google.maps.LatLng(-1.96, -50.822918),
					new google.maps.LatLng(-1.810446, -50.677955),
					new google.maps.LatLng(-1.952218, -50.416391),
					new google.maps.LatLng(-1.717709, -49.280909),
					new google.maps.LatLng(-2.565, -49.490009),
					new google.maps.LatLng(-1.898055, -49.190564),
					new google.maps.LatLng(-1.840555, -48.970491),
					new google.maps.LatLng(-1.469164, -48.697227),
					new google.maps.LatLng(-1.660282, -48.427227),
					new google.maps.LatLng(-1.499446, -48.413609),
					new google.maps.LatLng(-1.466255, -48.188964),
					new google.maps.LatLng(-1.461455, -48.499727),
					new google.maps.LatLng(-0.867782, -48.238064),
					new google.maps.LatLng(-0.637364, -47.744591),
					new google.maps.LatLng(-0.812782, -47.398064),
					new google.maps.LatLng(-0.5825, -47.4314),
					new google.maps.LatLng(-0.702782, -46.959727),
					new google.maps.LatLng(-0.898473, -46.96),
					new google.maps.LatLng(-0.713191, -46.826673),
					new google.maps.LatLng(-0.867782, -46.601109),
					new google.maps.LatLng(-1.0375, -46.61),
					new google.maps.LatLng(-0.9575, -46.191946),
					new google.maps.LatLng(-1.177782, -46.259446),
					new google.maps.LatLng(-1.210282, -46.046673),
					new google.maps.LatLng(-1.0775, -45.9757),
					new google.maps.LatLng(-1.259518, -45.861527),
					new google.maps.LatLng(-1.18, -45.735555),
					new google.maps.LatLng(-1.368682, -45.696182),
					new google.maps.LatLng(-1.310836, -45.446946),
					new google.maps.LatLng(-1.545555, -45.462227),
					new google.maps.LatLng(-1.314718, -45.324727),
					new google.maps.LatLng(-1.736809, -45.3507),
					new google.maps.LatLng(-1.480418, -45.158755),
					new google.maps.LatLng(-1.430627, -44.858891),
					new google.maps.LatLng(-1.601664, -44.951391),
					new google.maps.LatLng(-1.817782, -44.695009),
					new google.maps.LatLng(-1.202591, -50.790582),
					new google.maps.LatLng(-1.151946, -50.781109),
					new google.maps.LatLng(-1.101946, -50.569455),
					new google.maps.LatLng(-0.971946, -50.796955),
					new google.maps.LatLng(-0.644164, -50.775),
					new google.maps.LatLng(-0.678609, -50.557427),
					new google.maps.LatLng(-0.497782, -50.726391),
					new google.maps.LatLng(-0.2625, -50.646664),
					new google.maps.LatLng(-0.100282, -50.3289),
					new google.maps.LatLng(-0.262127, -48.410282),
					new google.maps.LatLng(-0.900282, -48.539173),
					new google.maps.LatLng(-1.487782, -48.876673),
					new google.maps.LatLng(-1.776664, -49.6725),
					new google.maps.LatLng(-1.638755, -49.757573),
					new google.maps.LatLng(-1.814446, -49.812991),
					new google.maps.LatLng(-1.708473, -50.054309),
					new google.maps.LatLng(-1.798682, -50.579518),
					new google.maps.LatLng(-1.510146, -50.723918),
					new google.maps.LatLng(-1.329518, -50.814309),
					new google.maps.LatLng(-1.202591, -50.790582),
					new google.maps.LatLng(-0.818109, -51.6428),
					new google.maps.LatLng(-0.733891, -51.609727),
					new google.maps.LatLng(-0.724818, -51.5914),
					new google.maps.LatLng(-0.530282, -51.198336),
					new google.maps.LatLng(-1.02, -51.276809),
					new google.maps.LatLng(-1.476664, -51.901391),
					new google.maps.LatLng(-0.818109, -51.6428),
					new google.maps.LatLng(0.0, -49.895018),
					new google.maps.LatLng(0.021809, -50.349864),
					new google.maps.LatLng(0.189718, -50.391946),
					new google.maps.LatLng(0.335, -49.703891),
					new google.maps.LatLng(0.210282, -49.643618),
					new google.maps.LatLng(0.0, -49.895018),
					new google.maps.LatLng(-0.283055, -50.857782),
					new google.maps.LatLng(-0.224164, -51.027227),
					new google.maps.LatLng(-0.09, -50.972782),
					new google.maps.LatLng(-0.054164, -50.5625),
					new google.maps.LatLng(-0.283055, -50.857782),
					new google.maps.LatLng(0.0, -49.397809),
					new google.maps.LatLng(-0.134446, -49.525555),
					new google.maps.LatLng(-0.064446, -49.8525),
					new google.maps.LatLng(0.077364, -49.650982),
					new google.maps.LatLng(0.0, -49.397809),
					new google.maps.LatLng(0.171109, -50.441118),
					new google.maps.LatLng(0.222364, -50.536391),
					new google.maps.LatLng(0.618336, -50.377782),
					new google.maps.LatLng(0.308891, -50.317782),
					new google.maps.LatLng(0.171109, -50.441118),
					new google.maps.LatLng(-0.962218, -51.140009),
					new google.maps.LatLng(-0.694446, -51.070282),
					new google.maps.LatLng(-0.576109, -50.813609),
					new google.maps.LatLng(-0.962218, -51.140009),
					new google.maps.LatLng(0.341945, -50.254173),
					new google.maps.LatLng(0.506391, -50.308064),
					new google.maps.LatLng(0.643054, -50.059864),
					new google.maps.LatLng(0.341945, -50.254173),
					new google.maps.LatLng(-23.967227, -45.243336),
					new google.maps.LatLng(-23.9175, -45.447918),
					new google.maps.LatLng(-23.726946, -45.321946),
					new google.maps.LatLng(-23.967227, -45.243336),
					new google.maps.LatLng(-1.646664, -52.200836),
					new google.maps.LatLng(-1.497218, -52.172227),
					new google.maps.LatLng(-1.520282, -51.915146),
					new google.maps.LatLng(-1.646664, -52.200836),
					new google.maps.LatLng(1.88, -50.404727),
					new google.maps.LatLng(2.077782, -50.499455),
					new google.maps.LatLng(2.133336, -50.378891),
					new google.maps.LatLng(1.88, -50.404727),
					new google.maps.LatLng(0.0, -50.437146),
					new google.maps.LatLng(0.152364, -50.657782),
					new google.maps.LatLng(0.154164, -50.472782),
					new google.maps.LatLng(0.0, -50.437146)
				];

				var iran = [
					new google.maps.LatLng(35.607245, 61.276554),
					new google.maps.LatLng(34.789436, 61.0511),
					new google.maps.LatLng(34.527909, 60.723873),
					new google.maps.LatLng(34.319718, 60.878873),
					new google.maps.LatLng(34.122218, 60.504436),
					new google.maps.LatLng(33.639991, 60.530827),
					new google.maps.LatLng(33.517036, 60.938882),
					new google.maps.LatLng(33.0661, 60.5825),
					new google.maps.LatLng(32.225964, 60.858327),
					new google.maps.LatLng(31.496109, 60.848809),
					new google.maps.LatLng(31.383327, 61.713609),
					new google.maps.LatLng(31.023882, 61.850127),
					new google.maps.LatLng(29.863654, 60.8663),
					new google.maps.LatLng(28.555, 61.905545),
					new google.maps.LatLng(28.263745, 62.782218),
					new google.maps.LatLng(27.2668, 62.780273),
					new google.maps.LatLng(27.148882, 63.330273),
					new google.maps.LatLng(26.639164, 63.185127),
					new google.maps.LatLng(26.566527, 62.437909),
					new google.maps.LatLng(26.3566, 62.274891),
					new google.maps.LatLng(26.230554, 61.854854),
					new google.maps.LatLng(25.197645, 61.611027),
					new google.maps.LatLng(25.080827, 61.396236),
					new google.maps.LatLng(25.269854, 60.622627),
					new google.maps.LatLng(25.441109, 60.550963),
					new google.maps.LatLng(25.397773, 60.410273),
					new google.maps.LatLng(25.265973, 60.4668),
					new google.maps.LatLng(25.477773, 59.450545),
					new google.maps.LatLng(25.393609, 59.051936),
					new google.maps.LatLng(25.56, 58.818327),
					new google.maps.LatLng(25.542918, 58.128182),
					new google.maps.LatLng(25.699991, 57.951236),
					new google.maps.LatLng(25.771454, 57.319091),
					new google.maps.LatLng(26.8475, 57.023463),
					new google.maps.LatLng(27.148327, 56.690545),
					new google.maps.LatLng(27.160273, 56.132763),
					new google.maps.LatLng(26.490409, 54.788463),
					new google.maps.LatLng(26.716109, 54.296936),
					new google.maps.LatLng(26.709164, 53.747773),
					new google.maps.LatLng(27.348191, 52.608327),
					new google.maps.LatLng(27.608609, 52.499718),
					new google.maps.LatLng(27.937773, 51.430273),
					new google.maps.LatLng(28.738745, 51.054718),
					new google.maps.LatLng(28.929791, 50.801036),
					new google.maps.LatLng(29.064582, 50.923745),
					new google.maps.LatLng(29.142773, 50.638882),
					new google.maps.LatLng(29.470418, 50.639163),
					new google.maps.LatLng(30.202773, 50.055545),
					new google.maps.LatLng(30.007218, 49.555054),
					new google.maps.LatLng(30.297354, 49.004709),
					new google.maps.LatLng(30.352482, 48.9581),
					new google.maps.LatLng(30.040691, 48.917354),
					new google.maps.LatLng(29.963027, 48.545554),
					new google.maps.LatLng(30.491382, 48.032491),
					new google.maps.LatLng(30.996109, 48.036663),
					new google.maps.LatLng(31.001109, 47.693882),
					new google.maps.LatLng(31.798609, 47.864436),
					new google.maps.LatLng(32.385554, 47.4379),
					new google.maps.LatLng(32.971064, 46.106418),
					new google.maps.LatLng(33.264782, 46.177145),
					new google.maps.LatLng(33.9752, 45.403609),
					new google.maps.LatLng(34.301273, 45.584163),
					new google.maps.LatLng(34.457836, 45.438636),
					new google.maps.LatLng(34.557609, 45.714673),
					new google.maps.LatLng(34.7352, 45.651654),
					new google.maps.LatLng(35.032491, 45.877773),
					new google.maps.LatLng(35.108518, 46.166009),
					new google.maps.LatLng(35.584718, 45.979991),
					new google.maps.LatLng(35.814191, 46.3452),
					new google.maps.LatLng(35.817345, 45.757127),
					new google.maps.LatLng(35.995418, 45.413882),
					new google.maps.LatLng(36.3811, 45.279163),
					new google.maps.LatLng(36.794582, 44.853045),
					new google.maps.LatLng(37.149709, 44.787336),
					new google.maps.LatLng(37.297418, 44.818182),
					new google.maps.LatLng(37.443091, 44.588854),
					new google.maps.LatLng(37.717973, 44.617763),
					new google.maps.LatLng(37.899154, 44.223973),
					new google.maps.LatLng(38.3413, 44.482518),
					new google.maps.LatLng(38.400536, 44.305263),
					new google.maps.LatLng(38.842627, 44.300263),
					new google.maps.LatLng(39.377445, 44.034954),
					new google.maps.LatLng(39.416518, 44.4011),
					new google.maps.LatLng(39.779154, 44.608463),
					new google.maps.LatLng(39.630818, 44.813045),
					new google.maps.LatLng(39.003182, 45.433473),
					new google.maps.LatLng(38.841145, 46.178245),
					new google.maps.LatLng(38.875591, 46.540373),
					new google.maps.LatLng(39.715582, 47.984709),
					new google.maps.LatLng(39.389909, 48.357882),
					new google.maps.LatLng(39.278182, 48.123873),
					new google.maps.LatLng(39.003745, 48.308736),
					new google.maps.LatLng(38.833391, 48.024636),
					new google.maps.LatLng(38.3965, 48.623509),
					new google.maps.LatLng(38.262809, 49.714527),
					new google.maps.LatLng(38.714854, 51.292709),
					new google.maps.LatLng(37.927827, 51.9716),
					new google.maps.LatLng(37.777636, 52.655009),
					new google.maps.LatLng(37.323436, 53.5271),
					new google.maps.LatLng(37.440127, 54.668745),
					new google.maps.LatLng(37.746382, 54.833054),
					new google.maps.LatLng(38.083327, 55.437627),
					new google.maps.LatLng(38.272354, 57.241518),
					new google.maps.LatLng(37.938464, 57.454018),
					new google.maps.LatLng(37.535545, 59.343045),
					new google.maps.LatLng(37.232764, 59.479991),
					new google.maps.LatLng(37.011664, 60.063463),
					new google.maps.LatLng(36.658045, 60.331245),
					new google.maps.LatLng(36.650409, 61.153736),
					new google.maps.LatLng(35.607245, 61.276554),
					new google.maps.LatLng(26.949973, 56.288327),
					new google.maps.LatLng(26.710182, 55.912636),
					new google.maps.LatLng(26.558609, 55.283609),
					new google.maps.LatLng(26.792773, 55.769991),
					new google.maps.LatLng(26.952082, 55.754582),
					new google.maps.LatLng(26.949973, 56.288327)
				];

				var japan = [
					new google.maps.LatLng(34.704118, 134.299382),
					new google.maps.LatLng(34.583327, 133.932463),
					new google.maps.LatLng(34.584718, 134.042072),
					new google.maps.LatLng(34.450818, 133.936845),
					new google.maps.LatLng(34.423191, 133.251918),
					new google.maps.LatLng(34.249782, 133.071154),
					new google.maps.LatLng(34.191936, 132.550463),
					new google.maps.LatLng(34.353464, 132.353991),
					new google.maps.LatLng(33.772491, 132.050536),
					new google.maps.LatLng(34.0536, 131.745791),
					new google.maps.LatLng(33.918473, 131.258318),
					new google.maps.LatLng(34.039582, 131.0304),
					new google.maps.LatLng(33.913736, 130.905118),
					new google.maps.LatLng(34.293054, 130.879672),
					new google.maps.LatLng(34.4286, 130.976627),
					new google.maps.LatLng(34.422073, 131.4061),
					new google.maps.LatLng(35.440545, 132.681091),
					new google.maps.LatLng(35.5825, 133.091063),
					new google.maps.LatLng(35.444991, 133.381072),
					new google.maps.LatLng(35.597545, 134.368654),
					new google.maps.LatLng(35.762218, 135.2222),
					new google.maps.LatLng(35.525409, 135.193436),
					new google.maps.LatLng(35.521664, 135.822209),
					new google.maps.LatLng(35.740964, 136.014709),
					new google.maps.LatLng(35.660545, 136.081363),
					new google.maps.LatLng(35.9761, 135.961072),
					new google.maps.LatLng(36.751391, 136.712463),
					new google.maps.LatLng(37.339718, 136.752472),
					new google.maps.LatLng(37.504718, 137.356354),
					new google.maps.LatLng(37.087773, 136.863282),
					new google.maps.LatLng(37.056654, 137.044436),
					new google.maps.LatLng(36.829164, 137.005554),
					new google.maps.LatLng(36.748327, 137.314972),
					new google.maps.LatLng(36.934718, 137.461909),
					new google.maps.LatLng(37.203327, 138.300809),
					new google.maps.LatLng(37.822491, 138.856627),
					new google.maps.LatLng(38.088327, 139.365782),
					new google.maps.LatLng(39.465, 140.052182),
					new google.maps.LatLng(39.825273, 140.024691),
					new google.maps.LatLng(39.929436, 139.703154),
					new google.maps.LatLng(40.230818, 140.020536),
					new google.maps.LatLng(40.598191, 139.852327),
					new google.maps.LatLng(40.806654, 140.268863),
					new google.maps.LatLng(41.247073, 140.345518),
					new google.maps.LatLng(41.181382, 140.639282),
					new google.maps.LatLng(40.830827, 140.721909),
					new google.maps.LatLng(40.991518, 140.882736),
					new google.maps.LatLng(40.856936, 141.134827),
					new google.maps.LatLng(41.192764, 141.261382),
					new google.maps.LatLng(41.123318, 140.791654),
					new google.maps.LatLng(41.400545, 140.838582),
					new google.maps.LatLng(41.529573, 140.923018),
					new google.maps.LatLng(41.373882, 141.417754),
					new google.maps.LatLng(40.715, 141.421082),
					new google.maps.LatLng(40.465545, 141.647218),
					new google.maps.LatLng(39.465827, 142.0547),
					new google.maps.LatLng(39.019854, 141.848163),
					new google.maps.LatLng(38.994854, 141.636109),
					new google.maps.LatLng(38.780545, 141.533054),
					new google.maps.LatLng(38.263464, 141.519427),
					new google.maps.LatLng(38.364436, 141.095791),
					new google.maps.LatLng(38.148045, 140.953582),
					new google.maps.LatLng(36.984718, 140.974545),
					new google.maps.LatLng(36.779164, 140.746063),
					new google.maps.LatLng(36.247491, 140.565518),
					new google.maps.LatLng(35.743327, 140.837191),
					new google.maps.LatLng(35.503882, 140.450809),
					new google.maps.LatLng(35.173327, 140.390809),
					new google.maps.LatLng(34.895, 139.838163),
					new google.maps.LatLng(35.278873, 139.848845),
					new google.maps.LatLng(35.552354, 140.113145),
					new google.maps.LatLng(35.633327, 139.777191),
					new google.maps.LatLng(35.137218, 139.678727),
					new google.maps.LatLng(35.285554, 139.557891),
					new google.maps.LatLng(35.238045, 139.173309),
					new google.maps.LatLng(34.874709, 139.138582),
					new google.maps.LatLng(34.593182, 138.850391),
					new google.maps.LatLng(34.954645, 138.7679),
					new google.maps.LatLng(35.034782, 138.905945),
					new google.maps.LatLng(35.123464, 138.741209),
					new google.maps.LatLng(34.858045, 138.332454),
					new google.maps.LatLng(34.599154, 138.214145),
					new google.maps.LatLng(34.567836, 137.028791),
					new google.maps.LatLng(34.718745, 137.3483),
					new google.maps.LatLng(34.7593, 137.026782),
					new google.maps.LatLng(34.919018, 136.977891),
					new google.maps.LatLng(34.685409, 136.973845),
					new google.maps.LatLng(34.720264, 136.877745),
					new google.maps.LatLng(35.079027, 136.849836),
					new google.maps.LatLng(34.676654, 136.521091),
					new google.maps.LatLng(34.433609, 136.915682),
					new google.maps.LatLng(34.266518, 136.897691),
					new google.maps.LatLng(34.189709, 136.343845),
					new google.maps.LatLng(33.454991, 135.772218),
					new google.maps.LatLng(33.875545, 135.064682),
					new google.maps.LatLng(34.140409, 135.195954),
					new google.maps.LatLng(34.249436, 135.098018),
					new google.maps.LatLng(34.525827, 135.436372),
					new google.maps.LatLng(34.691364, 135.419236),
					new google.maps.LatLng(34.704118, 134.299382),
					new google.maps.LatLng(43.953882, 144.367736),
					new google.maps.LatLng(43.9177, 144.791645),
					new google.maps.LatLng(44.344154, 145.338854),
					new google.maps.LatLng(43.754027, 145.0715),
					new google.maps.LatLng(43.553191, 145.356845),
					new google.maps.LatLng(43.600909, 145.208127),
					new google.maps.LatLng(43.275127, 145.311491),
					new google.maps.LatLng(43.365482, 145.812409),
					new google.maps.LatLng(43.170273, 145.520809),
					new google.maps.LatLng(42.906654, 143.989682),
					new google.maps.LatLng(42.378327, 143.386109),
					new google.maps.LatLng(41.924718, 143.243145),
					new google.maps.LatLng(42.606382, 141.790527),
					new google.maps.LatLng(42.297009, 140.990245),
					new google.maps.LatLng(42.550964, 140.752254),
					new google.maps.LatLng(42.570827, 140.470654),
					new google.maps.LatLng(42.241245, 140.298718),
					new google.maps.LatLng(41.794954, 141.194409),
					new google.maps.LatLng(41.705127, 140.980791),
					new google.maps.LatLng(41.824164, 140.666363),
					new google.maps.LatLng(41.5143, 140.414563),
					new google.maps.LatLng(41.449154, 140.0322),
					new google.maps.LatLng(41.9836, 140.137636),
					new google.maps.LatLng(42.243154, 139.786091),
					new google.maps.LatLng(42.613945, 139.836209),
					new google.maps.LatLng(43.007491, 140.529636),
					new google.maps.LatLng(43.316518, 140.356218),
					new google.maps.LatLng(43.138536, 141.158527),
					new google.maps.LatLng(43.296936, 141.411091),
					new google.maps.LatLng(43.711582, 141.338227),
					new google.maps.LatLng(43.942218, 141.645809),
					new google.maps.LatLng(44.616664, 141.795672),
					new google.maps.LatLng(45.189154, 141.574827),
					new google.maps.LatLng(45.399991, 141.693863),
					new google.maps.LatLng(45.486382, 141.971072),
					new google.maps.LatLng(44.490273, 143.121891),
					new google.maps.LatLng(44.094082, 143.776227),
					new google.maps.LatLng(44.108536, 144.171354),
					new google.maps.LatLng(43.953882, 144.367736),
					new google.maps.LatLng(33.607109, 131.194918),
					new google.maps.LatLng(33.647491, 131.669709),
					new google.maps.LatLng(33.466382, 131.729554),
					new google.maps.LatLng(33.264664, 131.517382),
					new google.maps.LatLng(33.247182, 131.896682),
					new google.maps.LatLng(33.119645, 131.816554),
					new google.maps.LatLng(32.830554, 131.989409),
					new google.maps.LatLng(32.534927, 131.685182),
					new google.maps.LatLng(31.369227, 131.334545),
					new google.maps.LatLng(31.448745, 131.071627),
					new google.maps.LatLng(31.267354, 131.129118),
					new google.maps.LatLng(30.999582, 130.668245),
					new google.maps.LatLng(31.3143, 130.798718),
					new google.maps.LatLng(31.5859, 130.602109),
					new google.maps.LatLng(31.682491, 130.807954),
					new google.maps.LatLng(31.714164, 130.644991),
					new google.maps.LatLng(31.528882, 130.534427),
					new google.maps.LatLng(31.182282, 130.638309),
					new google.maps.LatLng(31.247491, 130.231082),
					new google.maps.LatLng(31.625973, 130.336209),
					new google.maps.LatLng(32.006945, 130.162472),
					new google.maps.LatLng(32.435273, 130.564563),
					new google.maps.LatLng(32.631936, 130.587463),
					new google.maps.LatLng(32.619436, 130.450236),
					new google.maps.LatLng(32.783464, 130.606918),
					new google.maps.LatLng(33.170827, 130.211091),
					new google.maps.LatLng(32.854018, 130.096209),
					new google.maps.LatLng(32.861936, 130.314136),
					new google.maps.LatLng(32.6593, 130.3394),
					new google.maps.LatLng(32.587282, 130.176909),
					new google.maps.LatLng(32.784436, 130.088145),
					new google.maps.LatLng(32.5611, 129.746063),
					new google.maps.LatLng(32.718745, 129.857609),
					new google.maps.LatLng(32.838045, 129.685518),
					new google.maps.LatLng(33.078573, 129.687527),
					new google.maps.LatLng(32.858464, 129.804),
					new google.maps.LatLng(32.863054, 129.969972),
					new google.maps.LatLng(33.209509, 129.570145),
					new google.maps.LatLng(33.364018, 129.588582),
					new google.maps.LatLng(33.292227, 129.834336),
					new google.maps.LatLng(33.527218, 129.869263),
					new google.maps.LatLng(33.439427, 130.003327),
					new google.maps.LatLng(33.650827, 130.207454),
					new google.maps.LatLng(33.584018, 130.365372),
					new google.maps.LatLng(33.935891, 130.702745),
					new google.maps.LatLng(33.8811, 130.982182),
					new google.maps.LatLng(33.607109, 131.194918),
					new google.maps.LatLng(33.527573, 134.305145),
					new google.maps.LatLng(33.242009, 134.186554),
					new google.maps.LatLng(33.516382, 133.747609),
					new google.maps.LatLng(33.362909, 133.281509),
					new google.maps.LatLng(32.743045, 132.964418),
					new google.maps.LatLng(32.895545, 132.483018),
					new google.maps.LatLng(33.244709, 132.5347),
					new google.maps.LatLng(33.467727, 132.366718),
					new google.maps.LatLng(33.340473, 132.018718),
					new google.maps.LatLng(33.673736, 132.639827),
					new google.maps.LatLng(34.106109, 132.896927),
					new google.maps.LatLng(33.912345, 133.145954),
					new google.maps.LatLng(33.962773, 133.5231),
					new google.maps.LatLng(34.220682, 133.679691),
					new google.maps.LatLng(34.386382, 134.1315),
					new google.maps.LatLng(34.224154, 134.579127),
					new google.maps.LatLng(33.817354, 134.744691),
					new google.maps.LatLng(33.527573, 134.305145),
					new google.maps.LatLng(26.855, 128.2872),
					new google.maps.LatLng(26.658327, 128.271363),
					new google.maps.LatLng(26.436382, 127.849718),
					new google.maps.LatLng(26.155554, 127.813027),
					new google.maps.LatLng(26.085691, 127.652209),
					new google.maps.LatLng(26.432082, 127.717545),
					new google.maps.LatLng(26.547354, 127.959991),
					new google.maps.LatLng(26.6675, 127.883882),
					new google.maps.LatLng(26.642491, 128.067472),
					new google.maps.LatLng(26.855, 128.2872),
					new google.maps.LatLng(38.281109, 138.511109),
					new google.maps.LatLng(37.915273, 138.510545),
					new google.maps.LatLng(37.800827, 138.218291),
					new google.maps.LatLng(37.966664, 138.337191),
					new google.maps.LatLng(38.075, 138.242463),
					new google.maps.LatLng(38.281109, 138.511109),
					new google.maps.LatLng(28.497718, 129.690463),
					new google.maps.LatLng(28.116318, 129.373291),
					new google.maps.LatLng(28.2525, 129.143309),
					new google.maps.LatLng(28.497718, 129.690463),
					new google.maps.LatLng(34.184436, 134.762209),
					new google.maps.LatLng(34.296945, 134.666927),
					new google.maps.LatLng(34.590827, 135.019972),
					new google.maps.LatLng(34.261382, 134.9465),
					new google.maps.LatLng(34.184436, 134.762209),
					new google.maps.LatLng(30.4431, 130.523527),
					new google.maps.LatLng(30.380136, 130.668182),
					new google.maps.LatLng(30.243609, 130.5983),
					new google.maps.LatLng(30.349582, 130.388454),
					new google.maps.LatLng(30.4431, 130.523527),
					new google.maps.LatLng(32.188318, 130.0),
					new google.maps.LatLng(32.543609, 130.153872),
					new google.maps.LatLng(32.333464, 130.207609),
					new google.maps.LatLng(32.188318, 130.0),
					new google.maps.LatLng(34.685618, 129.473054),
					new google.maps.LatLng(34.294718, 129.3365),
					new google.maps.LatLng(34.556936, 129.300263),
					new google.maps.LatLng(34.685618, 129.473054),
					new google.maps.LatLng(32.696636, 128.652409),
					new google.maps.LatLng(32.7925, 128.813291),
					new google.maps.LatLng(32.646873, 128.901018),
					new google.maps.LatLng(32.696636, 128.652409)
				];

				var korea = [
					new google.maps.LatLng(37.833909, 126.688491),
					new google.maps.LatLng(38.284164, 127.100963),
					new google.maps.LatLng(38.311936, 128.079954),
					new google.maps.LatLng(38.625245, 128.363554),
					new google.maps.LatLng(37.059854, 129.429445),
					new google.maps.LatLng(36.022827, 129.392027),
					new google.maps.LatLng(36.003854, 129.586872),
					new google.maps.LatLng(35.475827, 129.439418),
					new google.maps.LatLng(35.112209, 129.136936),
					new google.maps.LatLng(35.169991, 128.572754),
					new google.maps.LatLng(35.039164, 128.382063),
					new google.maps.LatLng(35.008327, 128.501372),
					new google.maps.LatLng(34.832773, 128.405963),
					new google.maps.LatLng(34.946518, 128.334963),
					new google.maps.LatLng(34.940127, 127.597072),
					new google.maps.LatLng(34.7254, 127.745809),
					new google.maps.LatLng(34.615964, 127.6379),
					new google.maps.LatLng(34.8186, 127.418318),
					new google.maps.LatLng(34.590827, 127.512763),
					new google.maps.LatLng(34.4711, 127.389427),
					new google.maps.LatLng(34.551382, 127.126218),
					new google.maps.LatLng(34.740127, 127.335118),
					new google.maps.LatLng(34.412491, 126.889427),
					new google.maps.LatLng(34.585409, 126.780745),
					new google.maps.LatLng(34.299854, 126.597209),
					new google.maps.LatLng(34.345264, 126.478318),
					new google.maps.LatLng(34.745754, 126.292136),
					new google.maps.LatLng(34.578045, 126.451663),
					new google.maps.LatLng(34.810127, 126.660263),
					new google.maps.LatLng(34.791382, 126.375563),
					new google.maps.LatLng(34.963609, 126.433591),
					new google.maps.LatLng(35.113464, 126.248736),
					new google.maps.LatLng(35.068882, 126.457209),
					new google.maps.LatLng(35.336936, 126.3875),
					new google.maps.LatLng(35.533391, 126.684418),
					new google.maps.LatLng(35.637909, 126.477063),
					new google.maps.LatLng(35.861664, 126.801091),
					new google.maps.LatLng(35.965682, 126.632691),
					new google.maps.LatLng(36.056245, 126.872018),
					new google.maps.LatLng(36.136409, 126.544418),
					new google.maps.LatLng(36.723873, 126.497209),
					new google.maps.LatLng(36.581936, 126.293054),
					new google.maps.LatLng(36.707218, 126.125818),
					new google.maps.LatLng(36.962073, 126.294845),
					new google.maps.LatLng(36.793045, 126.286991),
					new google.maps.LatLng(36.851936, 126.401091),
					new google.maps.LatLng(36.991382, 126.345127),
					new google.maps.LatLng(36.843182, 126.474809),
					new google.maps.LatLng(37.051245, 126.500818),
					new google.maps.LatLng(36.967491, 126.772072),
					new google.maps.LatLng(36.7609, 126.833036),
					new google.maps.LatLng(36.910818, 126.9922),
					new google.maps.LatLng(37.047909, 126.754782),
					new google.maps.LatLng(37.1743, 126.869418),
					new google.maps.LatLng(37.159018, 126.660954),
					new google.maps.LatLng(37.265545, 126.861845),
					new google.maps.LatLng(37.645064, 126.549282),
					new google.maps.LatLng(37.833909, 126.688491)
				];

  				var australiaLayer = new google.maps.Polygon({
				    strokeWeight: 0,
				    fillColor: "#F00000",
				    fillOpacity: 0.15
  				});

  				var brazilLayer = new google.maps.Polygon({
				    strokeWeight: 0,
				    fillColor: "#F00000",
				    fillOpacity: 0.15
  				});

  				var iranLayer = new google.maps.Polygon({
				    strokeWeight: 0,
				    fillColor: "#F00000",
				    fillOpacity: 0.15
  				});

  				var japanLayer = new google.maps.Polygon({
				    strokeWeight: 0,
				    fillColor: "#F00000",
				    fillOpacity: 0.15
  				});

  				var koreaLayer = new google.maps.Polygon({
				    strokeWeight: 0,
				    fillColor: "#F00000",
				    fillOpacity: 0.15
  				});
				
  				australiaLayer.setPath(australia);
  				australiaLayer.setMap(map);

  				brazilLayer.setPath(brazil);
  				brazilLayer.setMap(map);

  				iranLayer.setPath(iran);
  				iranLayer.setMap(map);

  				japanLayer.setPath(japan);
  				japanLayer.setMap(map);

  				koreaLayer.setPath(korea);
  				koreaLayer.setMap(map);


				// Associate the styled map with the MapTypeId and set it to display.
				map.mapTypes.set('map_style', styledMap);
				map.setMapTypeId('map_style');

				var lastClickedLayer = koreaLayer;

				//Listeners for each nation.

				google.maps.event.addListener(koreaLayer, 'click', function (e) {
					var nation = 'South Korea';
					resetMap();

					lastClickedLayer.setOptions({
						strokeWeight: 0,
					    fillColor: "#F00000",
					    fillOpacity: 0.15
					});

					lastClickedLayer = koreaLayer;
					selectedNation = nation;
					fetchData();

					koreaLayer.setOptions({
				    strokeWeight: 0,
				    fillColor: "#FF0000",
				    fillOpacity: 0.55
  				});

				$("#country-name").text(nation);
            	});

            	google.maps.event.addListener(iranLayer, 'click', function (e) {
            		var nation = 'Iran';
            		resetMap();

            		lastClickedLayer.setOptions({
						strokeWeight: 0,
					    fillColor: "#F00000",
					    fillOpacity: 0.15
					});

					lastClickedLayer = iranLayer;
					selectedNation = nation;
					fetchData();

					iranLayer.setOptions({
				    strokeWeight: 0,
				    fillColor: "#FF0000",
				    fillOpacity: 0.55
  				});

				$("#country-name").text(nation);
            	});

            	google.maps.event.addListener(australiaLayer, 'click', function (e) {
            		var nation = 'Australia';
            		resetMap();

            		lastClickedLayer.setOptions({
						strokeWeight: 0,
					    fillColor: "#F00000",
					    fillOpacity: 0.15
					});

					lastClickedLayer = australiaLayer;
					selectedNation = nation;
					fetchData();

					australiaLayer.setOptions({
				    strokeWeight: 0,
				    fillColor: "#FF0000",
				    fillOpacity: 0.55
  				});

				$("#country-name").text(nation);
            	});

            	google.maps.event.addListener(brazilLayer, 'click', function (e) {
            		var nation = 'Brazil';
            		resetMap();

            		lastClickedLayer.setOptions({
						strokeWeight: 0,
					    fillColor: "#F00000",
					    fillOpacity: 0.15
					});

					lastClickedLayer = brazilLayer;
					selectedNation = nation;
					fetchData();

					brazilLayer.setOptions({
				    strokeWeight: 0,
				    fillColor: "#FF0000",
				    fillOpacity: 0.55
  				});

				$("#country-name").text(nation);
            	});

            	            	google.maps.event.addListener(japanLayer, 'click', function (e) {
            		var nation = 'Japan';
            		resetMap();

            		lastClickedLayer.setOptions({
						strokeWeight: 0,
					    fillColor: "#F00000",
					    fillOpacity: 0.15
					});

					lastClickedLayer = japanLayer;
					selectedNation = nation;
					fetchData();

					japanLayer.setOptions({
				    strokeWeight: 0,
				    fillColor: "#FF0000",
				    fillOpacity: 0.55
  				});

				$("#country-name").text(nation);
            	});
			}

			google.maps.event.addDomListener(window, 'load', initialize);