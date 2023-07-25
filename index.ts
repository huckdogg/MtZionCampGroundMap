/**
 * @license
 * Copyright 2019 Google LLC. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */

import type { FeatureCollection, Feature, Polygon } from "geojson";

//Define map panning boundary
const CAMP_GROUND_BOUNDS = {
    north: 33.24999133556339,
    south: 33.24455143691366,
    west: -84.39354171266014,
    east: -84.38413147273877,
  };

var mapGlobal;
var infoWindow;

const mapPointArray:google.maps.Marker[] = []
const mapPolygonArray:google.maps.Polygon[] = []

async function initMap() {
  const { Map, InfoWindow } = await google.maps.importLibrary("maps") as google.maps.MapsLibrary;
  const { AdvancedMarkerElement, PinElement } = await google.maps.importLibrary("marker") as google.maps.MarkerLibrary;
  //const {Symbol, SymbolPath} = await google.maps.importLibrary("core");

  const map = new google.maps.Map(
    document.getElementById("map") as HTMLElement,
    {
      zoom: 18.5,
      center: { lat: 33.247843666385506, lng: -84.3891508463981 },
      restriction: {
        latLngBounds: CAMP_GROUND_BOUNDS,
        strictBounds: false,
      },
      mapId: "a1ba09bec1919684",
    }
  );

  // add event listener for click event
  document
    .getElementById("restore-bounds-overlay")!
    .addEventListener("click", restoreBoundsOverlay);
  document
    .getElementById("remove-bounds-overlay")!
    .addEventListener("click", removeBoundsOverlay);
  document
    .getElementById("restore-bounds-overlay")!
    .addEventListener("click", restorePointsOverlay);
  document
    .getElementById("remove-bounds-overlay")!
    .addEventListener("click", removePointsOverlay);

    const tentImg = 'node_modules/images/glyphs/camping_FILL0_wght400_GRAD0_opsz48.png';
    const churchImg = 'node_modules/images/glyphs/church_FILL0_wght500_GRAD0_opsz48.png';
    const hotelImg = 'node_modules/images/glyphs/hotel_FILL0_wght500_GRAD0_opsz48.png';

    map.data.loadGeoJson("map.geojson", { idPropertyName: 'id' }, function(features) {
        map.data.forEach(feature => {        
            if (feature.getGeometry()?.getType() == "Polygon")
            {
                var currPolyPoints:google.maps.LatLng[] = []
                feature.getGeometry()?.forEachLatLng( latLngPoly =>
                    currPolyPoints.push(latLngPoly)
                    );
                var polyOptions = {
                    map: map,
                    clickable: true,
                    fillColor: feature.getProperty("fill"),
                    fillOpacity: feature.getProperty("fill-opacity"),
                    strokeColor: feature.getProperty("stroke"),
                    strokeOpacity: feature.getProperty("stroke-opacity"),
                    strokeWeight: feature.getProperty("stroke-width"),
                    paths: currPolyPoints,
                };

                var poly = new google.maps.Polygon(polyOptions);
                
                // poly.addListener("click", () => {
                //     if (infoWindow) {
                //         infoWindow.close();
                //     }
                //     infoWindow = new google.maps.InfoWindow({
                //         content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.", //contentString,
                //         ariaLabel: "Uluru",
                //     });            
                //     infoWindow.open({
                //     anchor: new google.maps.Point(33.24889775300887, -84.3893718738753),
                //     map,
                //     });
                // });

                mapPolygonArray.push(poly);

                map.data.remove(feature);
                

            }
            else if (feature.getGeometry()?.getType() == "Point")
            {
                var pntLatLng;
                var currIcon;

                feature.getGeometry()?.forEachLatLng(latLng => {
                    pntLatLng = latLng;
                })

                const markerBG = new google.maps.Marker ({
                    map,
                    position: pntLatLng,
                    title: feature.getProperty("name"),
                    icon: {
                        url: "node_modules/images/glyphs/Google_Maps_pin.png",
                        scaledSize: new google.maps.Size(30,50),
                        anchor: new google.maps.Point(15,49)               
                    }
                })              

                var shape = {
                    coords: [0,0, 1000,1000],
                    type: 'rect'
                };
                var markerIcon;

                switch(feature.getProperty("marker-symbol")) {
                    case "campsite": {
                        var tentNumber = +feature.getId();
                        
                        const pin = new PinElement({
                            glyph: tentNumber.toString(),
                            scale: 1.3,
                            background: 'ff4646ff',
                            borderColor: 'd73534ff',
                        });

                        markerIcon = new AdvancedMarkerElement({
                            position: pntLatLng,
                            map: map,
                            title: feature.getProperty("name"),
                            zIndex: tentNumber,
                            content: pin.element,
                        })

                        break;
                    }
                    case "lodging": {
                        markerIcon = new google.maps.Marker ({
                            map,
                            position: pntLatLng,
                            title: feature.getProperty("name"),
                            label: feature.getProperty("name"),
                            shape: shape,
                            icon: {
                                url: 'node_modules/images/glyphs/hotel_FILL0_wght500_GRAD0_opsz48.png',
                                scaledSize: new google.maps.Size(20,20),
                                anchor: new google.maps.Point(9.5,45),
                                labelOrigin: new google.maps.Point(10,55),
                            }
                        });
                        break;
                    }
                    case "religious-christian": {
                        markerIcon = new google.maps.Marker ({
                            map,
                            position: pntLatLng,
                            title: feature.getProperty("name"),
                            label: feature.getProperty("name"),
                            shape: shape,
                            icon: {
                                url: 'node_modules/images/glyphs/church_FILL0_wght500_GRAD0_opsz48.png',
                                scaledSize: new google.maps.Size(20,20),
                                anchor: new google.maps.Point(9.5,45),
                                labelOrigin: new google.maps.Point(10,55),
                            }
                        });
                        break;
                    }    
                    case "parking": {
                        markerIcon = new google.maps.Marker ({
                            map,
                            position: pntLatLng,
                            title: feature.getProperty("name"),
                            label: feature.getProperty("name"),
                            shape: shape,
                            icon: {
                                url: 'node_modules/images/glyphs/local_parking_FILL0_wght500_GRAD0_opsz48.png',
                                scaledSize: new google.maps.Size(20,20),
                                anchor: new google.maps.Point(9,42),
                                labelOrigin: new google.maps.Point(10,55),
                            }
                        });
                        break;
                    }    
                    case "restaurant": {
                        markerIcon = new google.maps.Marker ({
                            map,
                            position: pntLatLng,
                            title: feature.getProperty("name"),
                            label: feature.getProperty("name"),
                            shape: shape,
                            icon: {
                                url: 'node_modules/images/glyphs/restaurant_FILL0_wght500_GRAD0_opsz48.png',
                                scaledSize: new google.maps.Size(20,20),
                                anchor: new google.maps.Point(9.5,42),
                                labelOrigin: new google.maps.Point(10,55),
                            }
                        });
                        break;
                    }      
                    case "cemetery": {
                        markerIcon = new google.maps.Marker ({
                            map,
                            position: pntLatLng,
                            title: feature.getProperty("name"),
                            label: feature.getProperty("name"),
                            shape: shape,
                            icon: {
                                url: 'node_modules/images/glyphs/cemetery_FILL0_wght500_GRAD0_opsz48.png',
                                scaledSize: new google.maps.Size(20,20),
                                anchor: new google.maps.Point(9.5,45),
                                labelOrigin: new google.maps.Point(10,55),
                            }
                        });
                        break;
                    }
                    case "picnic-site": {
                        markerIcon = new google.maps.Marker ({
                            map,
                            position: pntLatLng,
                            title: feature.getProperty("name"),
                            label: feature.getProperty("name"),
                            shape: shape,
                            icon: {
                                url: 'node_modules/images/glyphs/rv_hookup_FILL0_wght400_GRAD0_opsz48.png',
                                scaledSize: new google.maps.Size(20,20),
                                anchor: new google.maps.Point(9.5,45),
                                labelOrigin: new google.maps.Point(10,55),
                            }
                        });
                        break;
                    }
                    case "water": {
                        markerIcon = new google.maps.Marker ({
                            map,
                            position: pntLatLng,
                            title: feature.getProperty("name"),
                            label: feature.getProperty("name"),
                            shape: shape,
                            icon: {
                                url: 'node_modules/images/glyphs/water_drop_FILL0_wght500_GRAD0_opsz48.png',
                                scaledSize: new google.maps.Size(20,20),
                                anchor: new google.maps.Point(9.5,45),
                                labelOrigin: new google.maps.Point(10,55),
                            }
                        });
                        break;
                    }
                    case "playground": {
                        markerIcon = new google.maps.Marker ({
                            map,
                            position: pntLatLng,
                            title: feature.getProperty("name"),
                            label: feature.getProperty("name"),
                            shape: shape,
                            icon: {
                                url: 'node_modules/images/glyphs/seesaw_FILL0_wght400_GRAD0_opsz48.png',
                                scaledSize: new google.maps.Size(20,20),
                                anchor: new google.maps.Point(9.5,45),
                                labelOrigin: new google.maps.Point(10,55),
                            }
                        });
                        break;
                    }
                    case "home": {
                        markerIcon = new google.maps.Marker ({
                            map,
                            position: pntLatLng,
                            title: feature.getProperty("name"),
                            label: feature.getProperty("name"),
                            shape: shape,
                            icon: {
                                url: 'node_modules/images/glyphs/cottage_FILL0_wght400_GRAD0_opsz48.png',
                                scaledSize: new google.maps.Size(20,20),
                                anchor: new google.maps.Point(9.5,45),
                                labelOrigin: new google.maps.Point(10,55),
                            }
                        });
                        break;
                    }
                    case "hardware": {
                        markerIcon = new google.maps.Marker ({
                            map,
                            position: pntLatLng,
                            title: feature.getProperty("name"),
                            label: feature.getProperty("name"),
                            shape: shape,
                            icon: {
                                url: 'node_modules/images/glyphs/handyman_FILL0_wght500_GRAD0_opsz48.png',
                                scaledSize: new google.maps.Size(20,20),
                                anchor: new google.maps.Point(9.5,45),
                                labelOrigin: new google.maps.Point(10,55),
                            }
                        });
                        break;
                    }                
                    default: {
                        markerIcon = null;
                        break;                    
                    }
                }
                
                if (markerIcon) {
                    markerIcon.addListener("click", () => {
                       openInfoWindow(feature, markerIcon, map);
                    }
                    );
                }

                if (markerBG) {
                    markerBG.addListener("click", () => {
                        openInfoWindow(feature, markerBG, map);
                    });
                }
                
                mapPointArray.push(markerBG);
                mapPointArray.push(markerIcon);

                currIcon = null;
                map.data.overrideStyle(feature, {visible: false});
            };
        });
    
    });
    
  mapGlobal = map;


};

function openInfoWindow(feature: google.maps.Data.Feature, marker, map) {
    if (infoWindow) {
        infoWindow.close();
    }
    
    infoWindow = new google.maps.InfoWindow({
        content: feature.getId() + '<h1>' + feature.getProperty('name') + '</h1> <h3>' + feature.getProperty('year-built') + '</h3> <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p> <img src="https://nationaltoday.com/wp-content/uploads/2022/06/22-Log-Cabin.jpg.webp" width="300" height="300">', //contentString,
        ariaLabel: "Uluru",
    });
        
    infoWindow.open({
        anchor: marker,
        map: marker.map,
    });
}

function restoreBoundsOverlay() {
    mapPolygonArray.forEach(feature => {
        feature.setVisible(true);
    });
}

function removeBoundsOverlay() {
    mapPolygonArray.forEach(feature => {
        feature.setVisible(false);
    });
}

function restorePointsOverlay() {
    mapPointArray.forEach(feature => {
        feature.setVisible(true);
    });
}

function removePointsOverlay() {
    mapPointArray.forEach(feature => {
        feature.setVisible(false);
    });
}

declare global {
  interface Window {
    initMap: () => void;
  }
}
window.initMap = initMap;
export {};
