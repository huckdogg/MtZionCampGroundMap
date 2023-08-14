/**
 * @license
 * Copyright 2023 Brian Huckaby All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */

import type { FeatureCollection, Feature, Polygon } from "geojson";

//Define map panning boundary
const CAMP_GROUND_BOUNDS = {
    north: 33.28617547986973, 
    south: 33.2227561612825, 
    west: -84.41972040672398,
    east: -84.24538406049818,
  };

const geoJSONFile = '/data/map.geojson';
const pinMarkerBG = '/data/images/glyphs/Google_Maps_pin.png';
const tentImg = '/data/images/glyphs/camping_FILL0_wght400_GRAD0_opsz48.png';
const churchImg = '/data/images/glyphs/church_FILL0_wght500_GRAD0_opsz48.png';
const hotelImg = '/data/images/glyphs/hotel_FILL0_wght500_GRAD0_opsz48.png';
const parkingImg = 'data/images/glyphs/local_parking_FILL0_wght500_GRAD0_opsz48.png';
const diningHallImg = 'data/images/glyphs/restaurant_FILL0_wght500_GRAD0_opsz48.png';
const cemeteryImg = 'data/images/glyphs/cemetery_FILL0_wght500_GRAD0_opsz48.png';
const rvParkImg = 'data/images/glyphs/rv_hookup_FILL0_wght400_GRAD0_opsz48.png';
const springImg = 'data/images/glyphs/water_drop_FILL0_wght500_GRAD0_opsz48.png';
const playgroundImg = 'data/images/glyphs/seesaw_FILL0_wght400_GRAD0_opsz48.png';
const houseImg = 'data/images/glyphs/cottage_FILL0_wght400_GRAD0_opsz48.png';
const shedImg = 'data/images/glyphs/handyman_FILL0_wght500_GRAD0_opsz48.png';

var mapGlobal;
var infoWindow;
var boundsHidden: boolean = false;
var markersHidden: boolean = false;

const tentMarkerToggleZoomLevel = 18.3;
const poiMarkerToggleZoomLevel = 17.5;
const poiMarkerClusterToggleZoomLevel = 17.5;
const campGroundMarkerToggleZoomLevel = 25;
const campGroundBoundsToggleZoomLevel = 25;

const mapMarkerArray:google.maps.Marker[] = [];
const zoomOutMapMarkerArray:google.maps.Marker[] = [];
const mapAdvMarkerArray:google.maps.marker.AdvancedMarkerElement[] = [];
const mapPolygonArray:google.maps.Polygon[] = [];

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
        .getElementById("toggle-bounds-overlay")!
        .addEventListener("click", toggleBoundsOverlay);
    document
        .getElementById("toggle-marker-overlay")!
        .addEventListener("click", () => {toggleMarkerOverlay(map)});

    // event listener for zoom level changes
    /* Change markers on zoom */
    google.maps.event.addListener(map, 'zoom_changed', function() {
        var zoom = getZoomLevel(map);

        //If the zoom level is above the tent marker hiding threshold and the markers are not hidden from the button, display the tent glyphs
        if (zoom > tentMarkerToggleZoomLevel && !markersHidden) {
            setAdvancedMarkerVisible(map);
        }
        //If the zoom level is below the tent marker hiding threshold and the markers are not already hidden from the button, hide the tent glyphs
        else if (zoom <= tentMarkerToggleZoomLevel && !markersHidden) {
            setAdvancedMarkerVisible(null);
        }
        //If the zoom level is above the POI marker hiding threshold and the markers are not hidden from the button, display the POI markers
        if (zoom > poiMarkerClusterToggleZoomLevel && !markersHidden) {
            setMarkerVisible(true);
        }
        //If the zoom level is below the POI marker hiding threshold and the markers are not already hidden from the button, hide the POI markers
        else if (zoom <= poiMarkerClusterToggleZoomLevel && !markersHidden) {
            setMarkerVisible(false);
        }

        if (zoom > poiMarkerToggleZoomLevel && !markersHidden) {
            setMarkerVisible(true);
            zoomOutMapMarkerArray.forEach(feature => {
                if (!feature.getTitle()?.includes("Tent - ") ) {
                    feature.setVisible(false);
                }
            })
        }
        else if (zoom <= poiMarkerToggleZoomLevel && !markersHidden) {
            setMarkerVisible(false);
            zoomOutMapMarkerArray.forEach(feature => {
                if (!feature.getTitle()?.includes("Tent - ") ) {
                    feature.setVisible(true);
                }
            })
        }
    });

    // const tentImg = '/data/images/glyphs/camping_FILL0_wght400_GRAD0_opsz48.png';
    // const churchImg = '/data/images/glyphs/church_FILL0_wght500_GRAD0_opsz48.png';
    // const hotelImg = '/data/images/glyphs/hotel_FILL0_wght500_GRAD0_opsz48.png';

    map.data.loadGeoJson(geoJSONFile, { idPropertyName: 'id' }, function(features) {
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
                var pntLatLngArray:google.maps.LatLng[] = [];
                var pntLatLng: google.maps.LatLng;
                var currLatLng = 0;

                feature.getGeometry()?.forEachLatLng(latLng => {
                    pntLatLngArray[currLatLng] = latLng;
                    currLatLng++;
                })

                pntLatLng = pntLatLngArray[0];
                
                const markerBG = new google.maps.Marker ({
                    map,
                    position: pntLatLng,
                    title: feature.getProperty("name"),
                    icon: {
                        url: pinMarkerBG,
                        scaledSize: new google.maps.Size(30,50),
                        anchor: new google.maps.Point(15,49)               
                    }
                }); 
                mapMarkerArray.push(markerBG);

                var shape = {
                    coords: [0,0, 1000,1000],
                    type: 'rect'
                };
                var markerIcon;

                switch(feature.getProperty("marker-symbol")) {
                    case "campsite": {
                        var tentNumber = +feature.getId();
                        if (isNaN(+tentNumber)) {
                            tentNumber = 0;
                        }
                        const pin = new PinElement({
                            glyph: tentNumber.toString(),
                            scale: 1.3,
                            background: 'ff4646ff',
                            borderColor: 'd73534ff',
                        });

                        markerIcon = new AdvancedMarkerElement({
                            position:  pntLatLng,
                            map: map,
                            title: "Tent - " + feature.getProperty("name"),
                            zIndex: tentNumber * -1,
                            content: pin.element,
                        })

                        markerBG.setTitle("Tent - " + feature.getProperty("name"));
                        markerBG.setZIndex(tentNumber * -1);

                        mapAdvMarkerArray.push(markerIcon);

                        break;
                    }
                    case "historic": {
                        markerIcon = new google.maps.Marker ({
                            map,
                            position: pntLatLng,
                            title: feature.getProperty("name"),
                            label: feature.getProperty("name"),
                            shape: shape,
                            icon: {
                                url: churchImg,
                                scaledSize: new google.maps.Size(20,20),
                                anchor: new google.maps.Point(9.5,45),
                                labelOrigin: new google.maps.Point(10,55),
                            }
                        });
                        markerIcon.setZIndex(1);
                        markerBG.setZIndex(1);
                        //Remove the background marker from the general array and place it in the zoomed out marker array
                        mapMarkerArray.pop();
                        zoomOutMapMarkerArray.push(markerIcon);
                        zoomOutMapMarkerArray.push(markerBG);

                        zoomOutMapMarkerArray.forEach(feature => {
                            if (!feature.getTitle()?.includes("Tent - ") ) {
                                feature.setVisible(false);
                            }
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
                                url: hotelImg,
                                scaledSize: new google.maps.Size(20,20),
                                anchor: new google.maps.Point(9.5,45),
                                labelOrigin: new google.maps.Point(10,55),
                            }
                        });
                        markerIcon.setZIndex(1);
                        markerBG.setZIndex(1);
                        mapMarkerArray.push(markerIcon);
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
                                url: churchImg,
                                scaledSize: new google.maps.Size(20,20),
                                anchor: new google.maps.Point(9.5,45),
                                labelOrigin: new google.maps.Point(10,55),
                            }
                        });
                        markerIcon.setZIndex(2);
                        markerBG.setZIndex(2);
                        mapMarkerArray.push(markerIcon);
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
                                url: parkingImg,
                                scaledSize: new google.maps.Size(20,20),
                                anchor: new google.maps.Point(9,42),
                                labelOrigin: new google.maps.Point(10,55),
                            }
                        });
                        markerIcon.setZIndex(3);
                        markerBG.setZIndex(3);
                        mapMarkerArray.push(markerIcon);
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
                                url: diningHallImg,
                                scaledSize: new google.maps.Size(20,20),
                                anchor: new google.maps.Point(9.5,42),
                                labelOrigin: new google.maps.Point(10,55),
                            }
                        });
                        markerIcon.setZIndex(4);
                        markerBG.setZIndex(4);
                        mapMarkerArray.push(markerIcon);
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
                                url: cemeteryImg,
                                scaledSize: new google.maps.Size(20,20),
                                anchor: new google.maps.Point(9.5,45),
                                labelOrigin: new google.maps.Point(10,55),
                            }
                        });
                        markerIcon.setZIndex(5);
                        markerBG.setZIndex(5);
                        mapMarkerArray.push(markerIcon);
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
                                url: rvParkImg,
                                scaledSize: new google.maps.Size(20,20),
                                anchor: new google.maps.Point(9.5,45),
                                labelOrigin: new google.maps.Point(10,55),
                            }
                        });
                        markerIcon.setZIndex(6);
                        markerBG.setZIndex(6);
                        mapMarkerArray.push(markerIcon);
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
                                url: springImg,
                                scaledSize: new google.maps.Size(20,20),
                                anchor: new google.maps.Point(9.5,45),
                                labelOrigin: new google.maps.Point(10,55),
                            }
                        });
                        markerIcon.setZIndex(7);
                        markerBG.setZIndex(7);
                        mapMarkerArray.push(markerIcon);
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
                                url: playgroundImg,
                                scaledSize: new google.maps.Size(29,29),
                                anchor: new google.maps.Point(15,48),
                                labelOrigin: new google.maps.Point(10,55),
                            }
                        });
                        markerIcon.setZIndex(8);
                        markerBG.setZIndex(8);
                        mapMarkerArray.push(markerIcon);
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
                                url: houseImg,
                                scaledSize: new google.maps.Size(20,20),
                                anchor: new google.maps.Point(9.5,45),
                                labelOrigin: new google.maps.Point(10,55),
                            }
                        });
                        markerIcon.setZIndex(9);
                        markerBG.setZIndex(9);
                        mapMarkerArray.push(markerIcon);
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
                                url: shedImg,
                                scaledSize: new google.maps.Size(20,20),
                                anchor: new google.maps.Point(9.5,45),
                                labelOrigin: new google.maps.Point(10,55),
                            }
                        });
                        markerIcon.setZIndex(10);
                        markerBG.setZIndex(10);
                        mapMarkerArray.push(markerIcon);
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

                //currIcon = null;
                map.data.overrideStyle(feature, {visible: false});
            };
        });
    
    });
    
  mapGlobal = map;


};

function getZoomLevel(map): number {
    var zoom = map.getZoom();
    //(document.getElementById("debug-text")).textContent = zoom.toString();
    if (isNaN(+zoom)) {
        zoom = 0;
    }
    return zoom;
}

function openInfoWindow(feature: google.maps.Data.Feature, marker, map) {
    if (infoWindow) {
        infoWindow.close();
    }
    
    infoWindow = new google.maps.InfoWindow({
        content: '<h1>' + feature.getProperty('name') + '</h1><h2>Tent Number: ' + feature.getId() + '</h2> <h3>' + feature.getProperty('year-built') + '</h3> <p>' + feature.getProperty("description") + '</p> <img src="https://nationaltoday.com/wp-content/uploads/2022/06/22-Log-Cabin.jpg.webp" width="300" height="300">', //contentString,
        ariaLabel: "Uluru",
    });
        
    infoWindow.open({
        anchor: marker,
        map: marker.map,
    });
}

function toggleBoundsOverlay() {
    if (boundsHidden) {
        mapPolygonArray.forEach(feature => {
            feature.setVisible(true);
        });
        boundsHidden = false;
        (document.getElementById("toggle-bounds-overlay")).textContent = "Hide boundaries";
    }
    else {
        mapPolygonArray.forEach(feature => {
            feature.setVisible(false);
        });
        boundsHidden = true;
        (document.getElementById("toggle-bounds-overlay")).textContent = "Show boundaries";
    }
}

function toggleMarkerOverlay(map: google.maps.Map) {
    //Unhide all markers and glyphs
    if (markersHidden) {
        markersHidden = false;
        if (getZoomLevel(map) > tentMarkerToggleZoomLevel) {
            setMarkerVisible(true);
            setAdvancedMarkerVisible(map);
        }
        if (getZoomLevel(map) <= poiMarkerToggleZoomLevel) {
            zoomOutMapMarkerArray.forEach(feature => {
                if (!feature.getTitle()?.includes("Tent - ") ) {
                    feature.setVisible(true);
                }
            })
        }
        (document.getElementById("toggle-marker-overlay")).textContent = "Hide map pins";
    }
    //Hide all markers and glyphs
    else {
        markersHidden = true;
        setMarkerVisible(false);
        setAdvancedMarkerVisible(null);
        if (getZoomLevel(map) <= poiMarkerToggleZoomLevel) {
            zoomOutMapMarkerArray.forEach(feature => {
                if (!feature.getTitle()?.includes("Tent - ") ) {
                    feature.setVisible(false);
                }
            })
        }
        (document.getElementById("toggle-marker-overlay")).textContent = "Show map pins";
    }

    var markersHiddenString: string = String(markersHidden);
    //(document.getElementById("debug-text-2")).textContent = markersHiddenString;
}

function setAdvancedMarkerVisible(map) {
    mapAdvMarkerArray.forEach(feature => {
        feature.map = map;
    })
    if (map) {
        setTentMarkerVisible(true);
    }
    else {
        setTentMarkerVisible(false);
    }
}

function setTentMarkerVisible(setVisible: boolean) {
    mapMarkerArray.forEach(feature => {
        if (feature.getTitle()?.includes("Tent - ") ) {
            feature.setVisible(setVisible);
        }
    })
}

function setMarkerVisible(setVisible: boolean) {
    mapMarkerArray.forEach(feature => {
        if (!feature.getTitle()?.includes("Tent - ") ) {
            feature.setVisible(setVisible);
        }
    })
}

function setMarkerClusterVisible(setVisible: boolean) {
    mapMarkerArray.forEach(feature => {
        if (!feature.getTitle()?.includes("Tent - ") ) {
            feature.setVisible(setVisible);
        }
    })
}

declare global {
  interface Window {
    initMap: () => void;
  }
}
window.initMap = initMap;
export {};
