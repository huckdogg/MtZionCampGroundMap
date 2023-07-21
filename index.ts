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

const mapPointArray:google.maps.Data.Feature[] = []
const mapPolygonArray:google.maps.Data.Feature[] = []

async function initMap() {
  const { AdvancedMarkerElement, PinElement } = await google.maps.importLibrary("marker") as google.maps.MarkerLibrary;

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

    const tentImg = 'node_modules/images/glyphs/camping_FILL0_wght400_GRAD0_opsz48.png';
    const churchImg = 'node_modules/images/glyphs/church_FILL0_wght500_GRAD0_opsz48.png';
    const hotelImg = 'node_modules/images/glyphs/hotel_FILL0_wght500_GRAD0_opsz48.png';

    map.data.loadGeoJson("map.geojson", { idPropertyName: 'id' }, function(features) {
    
    var currImg;
    map.data.forEach(feature => {        
        if (feature.getGeometry()?.getType() == "Polygon")
        {
            map.data.overrideStyle(feature, {strokeColor: feature.getProperty("stroke")});
            map.data.overrideStyle(feature, {strokeWeight: feature.getProperty("stroke-width")});
            map.data.overrideStyle(feature, {strokeOpacity: feature.getProperty("stroke-opacity")});
            map.data.overrideStyle(feature, {fillColor: feature.getProperty("fill")});
            map.data.overrideStyle(feature, {fillOpacity: feature.getProperty("fill-opacity")});

            mapPolygonArray.push(feature);
        }
        else if (feature.getGeometry()?.getType() == "Point")
        {
            var pntLatLng;
            if (feature.getProperty("marker-symbol") == "campsite")  {
                currImg = tentImg;
            }     

            switch(feature.getProperty("marker-symbol")) {
                case "campsite": {
                    currImg = 'node_modules/images/glyphs/camping_FILL0_wght400_GRAD0_opsz48.png';
                    break;
                }
                case "lodging": {
                    currImg = 'node_modules/images/glyphs/hotel_FILL0_wght500_GRAD0_opsz48.png';
                    break;
                }
                case "religious-christian": {
                    currImg = 'node_modules/images/glyphs/church_FILL0_wght500_GRAD0_opsz48.png';
                    break;
                }    
                case "parking": {
                    currImg = 'node_modules/images/glyphs/local_parking_FILL0_wght500_GRAD0_opsz48.png';
                    break;
                }    
                case "restaurant": {
                    currImg = 'node_modules/images/glyphs/restaurant_FILL0_wght500_GRAD0_opsz48.png';
                    break;
                }      
                case "cemetery": {
                    currImg = 'node_modules/images/glyphs/cemetery_FILL0_wght500_GRAD0_opsz48.png';
                    break;
                }
                case "picnic-site": {
                    currImg = 'node_modules/images/glyphs/rv_hookup_FILL0_wght400_GRAD0_opsz48.png';
                    break;
                }
                case "water": {
                    currImg = 'node_modules/images/glyphs/water_drop_FILL0_wght500_GRAD0_opsz48.png';
                    break;
                }
                case "playground": {
                    currImg = 'node_modules/images/glyphs/seesaw_FILL0_wght400_GRAD0_opsz48.png';
                    break;
                }
                case "home": {
                    currImg = 'node_modules/images/glyphs/cottage_FILL0_wght400_GRAD0_opsz48.png';
                    break;
                }
                case "hardware": {
                    currImg = 'node_modules/images/glyphs/handyman_FILL0_wght500_GRAD0_opsz48.png';
                    break;
                }                
                default: {
                    break;                    
                }
            }
                 
            feature.getGeometry()?.forEachLatLng(latLng => {
                pntLatLng = latLng;
            })

            const markerBG = new google.maps.Marker ({
                map,
                position: pntLatLng,
                //content: pinElement.element,
                icon: {
                    url: "node_modules/images/glyphs/Google_Maps_pin.png",
                    scaledSize: new google.maps.Size(30,50),
                    anchor: new google.maps.Point(15,49)               
                }
            })              

            const markerIcon = new google.maps.Marker ({
                map,
                position: pntLatLng,
                title: feature.getProperty("name"),
                //content: pinElement.element,
                icon: {
                    url: currImg,
                    scaledSize: new google.maps.Size(20,20),
                    anchor: new google.maps.Point(9.5,45)
                }
            })  

            currImg = null;
            map.data.overrideStyle(feature, {visible: false});
        };
    });
    
    });
    
  mapGlobal = map;


};

function restoreBoundsOverlay() {
    mapPolygonArray.forEach(feature => {
        mapGlobal.data.overrideStyle(feature, {visible: true});
    });
}

function removeBoundsOverlay() {
    mapPolygonArray.forEach(feature => {
        mapGlobal.data.overrideStyle(feature, {visible: false});
    });
}

declare global {
  interface Window {
    initMap: () => void;
  }
}
window.initMap = initMap;
export {};
