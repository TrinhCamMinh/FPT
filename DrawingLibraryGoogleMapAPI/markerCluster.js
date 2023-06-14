import _ from 'lodash';

function initMap() {
    const locations = [
        { lat: 23.393396, lng: 102.14682 },
        { lat: 22.11844105421303, lng: 108.61158254195138 },
        { lat: 9.03620530870753, lng: 111.47456282556622 },
        { lat: 8.383496, lng: 104.938748 },
    ];

    const VNlocations = [
        { lat: 21.0278, lng: 105.8342 }, // Hanoi
        { lat: 16.0544, lng: 108.2022 }, // Da Nang
        { lat: 10.8231, lng: 106.6297 }, // Ho Chi Minh City
        { lat: 12.2388, lng: 109.1967 }, // Nha Trang
        { lat: 20.8449, lng: 106.6881 }, // Hai Phong
        { lat: 21.0283, lng: 105.8537 }, // Bac Ninh
        { lat: 10.9656, lng: 108.107 }, // Vung Tau
        { lat: 21.4049, lng: 103.2055 }, // Lao Cai
        { lat: 10.0333, lng: 105.7833 }, // Can Tho
        { lat: 16.4692, lng: 107.5787 }, // Hue
        { lat: 13.9833, lng: 108 }, // Quy Nhon
        { lat: 14.0583, lng: 108.2772 }, // Tuy Hoa
        { lat: 13.7665, lng: 109.2237 }, // Phan Rang-Thap Cham
        { lat: 11.9325, lng: 109.1967 }, // Phan Thiet
        { lat: 10.3833, lng: 105.4167 }, // Rach Gia
        { lat: 21.5942, lng: 105.8481 }, // Vinh Yen
        { lat: 20.8172, lng: 106.7244 }, // Ha Long
        { lat: 20.9544, lng: 107.0806 }, // Thai Nguyen
        { lat: 21.3281, lng: 103.8733 }, // Yen Bai
        { lat: 37.7749, lng: -122.4194 }, // San Francisco, California
        { lat: 40.7128, lng: -74.006 }, // New York City, New York
        { lat: 34.0522, lng: -118.2437 }, // Los Angeles, California
        { lat: 41.8781, lng: -87.6298 }, // Chicago, Illinois
        { lat: 29.7604, lng: -95.3698 }, // Houston, Texas
        { lat: 33.4484, lng: -112.074 }, // Phoenix, Arizona
        { lat: 39.7392, lng: -104.9903 }, // Denver, Colorado
        { lat: 47.6062, lng: -122.3321 }, // Seattle, Washington
        { lat: 36.1699, lng: -115.1398 }, // Las Vegas, Nevada
        { lat: 33.6846, lng: -117.8265 }, // Irvine, California
        { lat: 38.9072, lng: -77.0369 }, // Washington D.C.
        { lat: 42.3601, lng: -71.0589 }, // Boston, Massachusetts
        { lat: 33.7175, lng: -117.8311 }, // Santa Ana, California
        { lat: 32.7157, lng: -117.1611 }, // San Diego, California
        { lat: 37.3382, lng: -121.8863 }, // San Jose, California
    ];

    const map = new google.maps.Map(document.getElementById('map'), {
        zoom: 3,
        center: { lat: -28.024, lng: 140.887 },
    });
    // const infoWindow = new google.maps.InfoWindow({
    //     content: '',
    //     disableAutoPan: true,
    // });
    const polygon = new google.maps.Polygon({
        paths: locations,
        strokeColor: '#FF0000',
        strokeOpacity: 0.8,
        strokeWeight: 2,
        fillColor: '#FF0000',
        fillOpacity: 0.35,
    });

    // Add some markers to the map.
    let i;
    for (i = 0; i <= 500; i++) {
        const demo = _.random(0, 15);

        new google.maps.Marker({
            position: VNlocations[demo],
            map,
            title: 'Hello World!',
            optimized: true,
            draggable: true,
        });
    }

    // const marker = new google.maps.Marker({
    //     position: { lat: 17.974855, lng: 102.630867 },
    //     map,
    //     title: 'Hello World!',
    //     // By default, the Maps JavaScript API will decide whether a marker will be optimized. When there is a large number of markers, the Maps JavaScript API will attempt to render markers with optimization.
    //     optimized: true,
    //     draggable: true,
    // });

    polygon.setMap(map);
    // Add a marker clusterer to manage the markers.
    // new MarkerClusterer({ markers, map });

    // polygon.addListener('click', function (event) {
    //     console.log('click event fired');
    //     if (!google.maps.geometry.poly.containsLocation(event.latLng, polygon)) {
    //         alert('You clicked outside the area!');
    //     } else {
    //         alert('Success');
    //     }
    // });

    // google.maps.event.addListener(map, 'click', function (event) {
    //     const lat = event.latLng.lat();
    //     const lng = event.latLng.lng();
    //     console.log(lat, lng);
    //     if (!google.maps.geometry.poly.containsLocation(event.latLng, polygon)) {
    //         alert('You clicked outside the area!');
    //     }
    // });
}

window.initMap = initMap;
