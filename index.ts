/**
 * @license
 * Copyright 2019 Google LLC. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */

//Define map panning boundary
const CAMP_GROUND_BOUNDS = {
    north: 33.24999133556339,
    south: 33.24455143691366,
    west: -84.39354171266014,
    east: -84.38413147273877,
  };

var campGroundsPolygonGlobal1;
var campGroundsPolygonGlobal2;
var campGroundsPolygonGlobal3;
var campGroundsPolygonGlobal4;

function initMap(): void {
  const map = new google.maps.Map(
    document.getElementById("map") as HTMLElement,
    {
      zoom: 18.5,
      center: { lat: 33.247843666385506, lng: -84.3891508463981 },
      restriction: {
        latLngBounds: CAMP_GROUND_BOUNDS,
        strictBounds: false,
      },
    }
  );

  // add event listener for click event
  document
    .getElementById("restore-bounds-overlay")!
    .addEventListener("click", restoreBoundsOverlay);
  document
    .getElementById("remove-bounds-overlay")!
    .addEventListener("click", removeBoundsOverlay);

    // Define the LatLng coordinates for the polygon's path.
    const boundaryCoords1 = [
        { lat: 33.248703542715226, lng: -84.38877916247348 },
        { lat: 33.24804911078591 , lng: -84.3886170801787  },
        { lat: 33.24825093951656 , lng: -84.38747807290191 },
        { lat: 33.24798686444784 , lng: -84.3873314680049  },
        { lat: 33.24783219153704 , lng: -84.38796299679204 },
        { lat: 33.24771147102623 , lng: -84.3881953091673  },
        { lat: 33.247471915768806, lng: -84.38838476780346 },
        { lat: 33.24701850157549 , lng: -84.38867033197648 },
        { lat: 33.24686111335823 , lng: -84.38889201627056 },
        { lat: 33.24652632898373 , lng: -84.38956025885022 },
        { lat: 33.24638761317266 , lng: -84.38970539029378 },
        { lat: 33.245924780928625, lng: -84.39008974938947 },
        { lat: 33.24583941678948 , lng: -84.39019341470538 },
        { lat: 33.24577806126414 , lng: -84.39040393504109 },
        { lat: 33.24574338203513 , lng: -84.39098446081536 },
        { lat: 33.24569272166766 , lng: -84.39131931788683 },
        { lat: 33.245558005993324, lng: -84.39172759975061 },
        { lat: 33.24536060047047 , lng: -84.39200510382952 },
        { lat: 33.244857021431635, lng: -84.39252222945693 },
        { lat: 33.244706115630365, lng: -84.39266206797409 },
        { lat: 33.2486243820839  , lng: -84.3926748664401  },
        { lat: 33.248703542715226, lng: -84.38877916247348 },
        //{ lat:  lng:  },
    ];

    const boundaryCoords2 = [
        { lat: 33.24785483247928, lng: -84.38725218515646 },
        { lat: 33.245369387700684, lng: -84.38527003273866 },
        { lat: 33.24536490127437, lng: -84.38754186368794 },
        { lat: 33.24518320081582, lng: -84.39073905679226 },
        { lat: 33.24561389758185, lng: -84.39088926048723 },
        { lat: 33.24565651850058, lng: -84.39028039908078 },
        { lat: 33.24574400347918, lng: -84.39006850458249 },
        { lat: 33.24587410918286, lng: -84.38991830088752 },
        { lat: 33.24641920511627, lng: -84.38945427877383 },
        { lat: 33.246748952868465, lng: -84.38879713757535 },
        { lat: 33.24692840689745, lng: -84.38855037436217 },
        { lat: 33.24761481517005, lng: -84.38808098778124 },
        { lat: 33.24770902764787, lng: -84.38788250432715 },
        { lat: 33.24785483247928, lng: -84.38725218515646 },
    ];

    const boundaryCoords3 = [
        { lat: 33.24876330323087, lng: -84.3875069949407 },
        { lat: 33.24874214621616, lng: -84.38577160582183 },
        { lat: 33.24765189440698, lng: -84.38576709490223 },
        { lat: 33.247921629252254, lng: -84.3870662397457 },
        { lat: 33.24828841901431, lng: -84.38728153559515 },
        { lat: 33.24876330323087, lng: -84.3875069949407 },
    ];

    const boundaryCoords4 = [
        { lat: 33.24775230733426, lng: -84.38694625946133 },
        { lat: 33.247566125527115, lng: -84.38603833176931 },
        { lat: 33.24704795479521, lng: -84.38610136367706 },
        { lat: 33.24669914116049, lng: -84.3861107514093 },
        { lat: 33.24775230733426, lng: -84.38694625946133 },
    ];

    // Construct the polygon.
    const campGroundsPolygon1 = new google.maps.Polygon({
        paths: boundaryCoords1,
        strokeColor: "#FF0000",
        strokeOpacity: 0.6,
        strokeWeight: 2,
        fillColor: "#FF0000",
        fillOpacity: 0.15,
    });

    const campGroundsPolygon2 = new google.maps.Polygon({
        paths: boundaryCoords2,
        strokeColor: "#FF0000",
        strokeOpacity: 0.6,
        strokeWeight: 2,
        fillColor: "#FF0000",
        fillOpacity: 0.15,
    });

    const campGroundsPolygon3 = new google.maps.Polygon({
        paths: boundaryCoords3,
        strokeColor: "#FF0000",
        strokeOpacity: 0.6,
        strokeWeight: 2,
        fillColor: "#FF0000",
        fillOpacity: 0.15,
    });

    const campGroundsPolygon4 = new google.maps.Polygon({
        paths: boundaryCoords4,
        strokeColor: "#FF0000",
        strokeOpacity: 0.6,
        strokeWeight: 2,
        fillColor: "#FF0000",
        fillOpacity: 0.15,
    });

  campGroundsPolygon1.setMap(map);
  campGroundsPolygonGlobal1 = campGroundsPolygon1;

  campGroundsPolygon2.setMap(map);
  campGroundsPolygonGlobal2 = campGroundsPolygon2;

  campGroundsPolygon3.setMap(map);
  campGroundsPolygonGlobal3 = campGroundsPolygon3;

  campGroundsPolygon4.setMap(map);
  campGroundsPolygonGlobal4 = campGroundsPolygon4;
}

function restoreBoundsOverlay() {
    campGroundsPolygonGlobal1.setVisible(true);
    campGroundsPolygonGlobal2.setVisible(true);
    campGroundsPolygonGlobal3.setVisible(true);
    campGroundsPolygonGlobal4.setVisible(true);
}

function removeBoundsOverlay() {
    campGroundsPolygonGlobal1.setVisible(false);
    campGroundsPolygonGlobal2.setVisible(false);
    campGroundsPolygonGlobal3.setVisible(false);
    campGroundsPolygonGlobal4.setVisible(false);
}

declare global {
  interface Window {
    initMap: () => void;
  }
}
window.initMap = initMap;
export {};
