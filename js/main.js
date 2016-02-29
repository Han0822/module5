//1.create map
function createMap(){
    //create the map
    var map = L.map('map', {
        center: [40,100],
        zoom: 4
    });

    //add OSM base tilelayer
    L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap contributors</a>'
    }).addTo(map);

    //call getData function
    getData(map);
};





//3: Add circle markers for point features to the map
function createPropSymbols(data, map){
   
    //create a Leaflet GeoJSON layer and add it to the map
    L.geoJson(data, {
        pointToLayer:pointToLayer
    }).addTo(map);
};



// 2: Import GeoJSON data
function getData(map){
    //load the data
    $.ajax("data/MegaCities.geojson", {
        dataType: "json",
        success: function(response){
            //call function to create proportional symbols
            createPropSymbols(response, map);
        }
    });
};

 
//calculate the radius of each proportional symbol
function calcPropRadius(attValue) {
    //scale factor to adjust symbol size evenly
    var scaleFactor = 0.03;
    //area based on attribute value and scale factor
    var area = attValue * scaleFactor;
    //radius calculated based on area
    var radius = Math.sqrt(area/Math.PI);

    return radius;
};




///function to convert markers to circle markers
function pointToLayer(feature, latlng){
    //define attribute
    var attribute = "gdp_2014";

    // marker options
    var options = {
        fillColor: "#ff7800",
        color: "#000",
        weight: 1,
        opacity: 1,
        fillOpacity: 0.8
    };

    //define value
    var attValue = Number(feature.properties[attribute]);

    //define option
    options.radius = calcPropRadius(attValue);

    //create circle marker layer
    var layer = L.circleMarker(latlng, options);
    
    //popup content string 
    var popupContent = "<p><b>City:</b> " + feature.properties.Province + "</p>";

    //popup content string
    var year = attribute.toString();
    popupContent += "<p><b>GDP (/100 million Yuan) " + year + ":</b> " + feature.properties[attribute] + "</p>";
    
    //bind the popup to the circle marker
    layer.bindPopup(popupContent);

    //return the circle marker to the L.geoJson pointToLayer option
    return layer;
};














$(document).ready(createMap);