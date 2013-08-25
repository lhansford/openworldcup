google.maps.visualRefresh = true;


//These are all the countries and the three variables needed for them in json.
//Geometry and layer variables are preloaded from geometry.js

var australia = {
	"name":"Australia",
	"geometry": australiaGeometry,
	"layer": australiaLayer
};

var brazil = {
	"name":"Brazil",
	"geometry": brazilGeometry,
	"layer": brazilLayer
};

var iran = {
	"name":"Iran",
	"geometry": iranGeometry,
	"layer": iranLayer
};

var japan = {
	"name":"Japan",
	"geometry": japanGeometry,
	"layer": japanLayer
};

var southKorea = {
	"name":"South Korea",
	"geometry": southKoreaGeometry,
	"layer": southKoreaLayer
};

var countries = [australia, brazil, iran, japan, southKorea];

//This function goes through countries and places each layer on the map.
function setLayers(countries){
	for (i = 0; i < countries.length; i++){
		countries[i].layer.setPath(countries[i].geometry);
		countries[i].layer.setMap(map);
	}
}

//Apply the spidefier click listener
function setSpiderfierListener(){
	console.log("spiderlistener")
	var iw = new google.maps.InfoWindow();
	oms.addListener('click', function(marker, event) {
		console.log("clicked")
		iw.setContent(marker.desc);
		iw.open(map, marker);
	});
}



// Displays the data for a player when they're are clicked on.
function displayData(name){
	for (i = 0; i < selectedNationData.length; i++){
		if (selectedNationData[i][4] === name){
			$("#sec1-col1-1").text(selectedNationData[i][4]);
	        $("#club").text('Club: ' + selectedNationData[i][8]);
	        $("#country").text('Country: ' + selectedNationData[i][3]);
	        $("#age").text('Age: ' + selectedNationData[i][5]);
	        $("#position").text('Position: ' + selectedNationData[i][6]);
	        $("#caps").text('International Caps: ' + selectedNationData[i][7]);
	        break
		}

	}

}



var map;
var oms;
var markerCluster;
var infoWindow = new google.maps.InfoWindow();
var DEFAULT_ICON_URL = 'http://g.etfv.co/http://www.google.com';
var latitudeColumn = 'LATITUDE';
var longitudeColumn = 'LONGITUDE';
var iconUrlColumn = 'ICON';
var nationColumn = 'NATION';
var nameColumn = 'NAME';
var clubColumn = 'CLUB';
var ageColumn = 'AGE';
var positionColumn = 'POSITION'
var capsColumn = 'CAPS'
var selectedNation;
var tableID = '1FE9Nx-lm6-670f_aOkv-h9MyGATmeRI8pWKG_rM';
var apiKey = 'AIzaSyDMfbcJAH81sfrsOLV6zykZcvFSUjG3X4E';

var selectedNationData;

var playerMarkers = [];


// Sets the map on all markers in the array. Needed to delete all markers.
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

    $(".stats").text('');
    $(".player-name").text('');

}

// Deletes all markers in the array by removing references to them.
function resetMap() {
	resetHtml();
	clearOverlays();
	playerMarkers = [];
	try{ markerCluster.clearMarkers(); }catch(e){ }
}

function createMarker (coordinate, url, country, name, age, position, caps, club) {
	var marker = new google.maps.Marker({
		map: map,
        position: coordinate,
        // icon: new google.maps.MarkerImage('http://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=%E2%80%A2|FE7569')
        icon: new google.maps.MarkerImage(url)

    });
  	google.maps.event.addListener(marker, 'click', function(event) {
        $("#sec1-col1-1").text(name);
        $("#club").text('Club: ' + club);
        $("#country").text('Country: ' + country);
        $("#age").text('Age: ' + age);
        $("#position").text('Position: ' + position);
        $("#caps").text('International Caps: ' + caps);

  	});
  	marker.desc = name;
  	oms.addMarker(marker); //add the marker to the spiderfier layer.
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
                + ageColumn + ','
                + positionColumn + ','
                + capsColumn + ','
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

        //Sends the data to a global variable so it can be accessed via player names
        selectedNationData = rows;

        // Copy each row of data from the response into variables.
        // Each column is present in the order listed in the query.
        // Starting from 0.
        // EDIT this if you've changed the columns, above.
        var x = 0
        for (var i in rows) {
        	if (rows[i][3] == selectedNation){
        		x = x + 1;
        		coordinate = new google.maps.LatLng(rows[i][0],rows[i][1]);
        		iconUrl = rows[i][2];
        		country = rows[i][3];
        		name = rows[i][4];
        		age = rows[i][5];
				position = rows[i][6];
        		caps = rows[i][7];
        		club = rows[i][8];
        		
        		var playerNumber = "#player-" + x;
				$(playerNumber).text(name);     		

        		if (iconUrl) {   // ensure not empty
            		createMarker(coordinate, iconUrl, country, name, age, position, caps, club);
          		} else {
            		createMarker(coordinate, DEFAULT_ICON_URL, country, name, age, position, caps, club);
          		}

          	}
        }
        markerCluster = new MarkerClusterer(map, playerMarkers);
        var minClusterZoom = 4;
		markerCluster.setMaxZoom(minClusterZoom);
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

	//Create markerclusterer
	// markerCluster = new MarkerClusterer(map);

	//Add the Spiderfier fuctionality
	oms = new OverlappingMarkerSpiderfier(map);
	setSpiderfierListener();

	//Place layers on the map
	setLayers(countries);

	// Associate the styled map with the MapTypeId and set it to display.
	map.mapTypes.set('map_style', styledMap);
	map.setMapTypeId('map_style');

	var lastClickedLayer = southKoreaLayer;
	//Listeners for each nation.

	google.maps.event.addListener(southKoreaLayer, 'click', function (e) {
		var nation = 'South Korea';
		resetMap();

		lastClickedLayer.setOptions({
			strokeWeight: 0,
		    fillColor: "#F00000",
		    fillOpacity: 0.15
		});

		lastClickedLayer = southKoreaLayer;
		selectedNation = nation;
		fetchData();

		southKoreaLayer.setOptions({
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