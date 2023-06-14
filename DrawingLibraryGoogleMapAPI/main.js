import svg from './assets/marker-svgrepo-com.svg';
import { contentString } from './instance';

function initMap() {
    const position = { lat: 14.058324, lng: 108.277199 };
    const labels = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let labelIndex = 0;

    const map = new google.maps.Map(document.getElementById('map'), {
        center: position,
        zoom: 8,
    });

    const infowindow = new google.maps.InfoWindow({
        content: contentString,
        ariaLabel: 'Uluru',
    });

    const flightPlanCoordinates = [
        { lat: 37.772, lng: -122.214 },
        { lat: 21.291, lng: -157.821 },
        { lat: -18.142, lng: 178.431 },
        { lat: -27.467, lng: 153.027 },
    ];

    const triangleCoords = [
        { lat: 23.393396, lng: 102.14682 },
        { lat: 22.719568, lng: 105.776716 },
        { lat: 8.383496, lng: 104.938748 },
        { lat: 8.383496, lng: 102.14682 },
    ];

    const poly = new google.maps.Polyline({
        path: flightPlanCoordinates,
        geodesic: true,
        strokeColor: '#FF0000',
        strokeOpacity: 1.0,
        strokeWeight: 2,
    });

    const marker = new google.maps.Marker({
        icon: svg,
        position: position,
        map,
        title: 'Hello World!',
        optimized: true,
        draggable: true,
    });

    // Construct the polygon.
    const polygon = new google.maps.Polygon({
        paths: triangleCoords,
        strokeColor: '#FF0000',
        strokeOpacity: 0.8,
        strokeWeight: 2,
        fillColor: '#FF0000',
        fillOpacity: 0.35,
    });

    // Construct the circle.
    const circle = new google.maps.Circle({
        editable: true,
        strokeColor: '#FF0000',
        strokeOpacity: 0.8,
        strokeWeight: 2,
        fillColor: '#FF0000',
        fillOpacity: 0.35,
        map,
        center: { lat: 40.714, lng: -74.005 },
        radius: Math.sqrt(8405837) * 100,
    });

    //! Adds a marker to the map.
    function addMarker(location, map) {
        // Add the marker at the clicked location, and add the next-available label
        // from the array of alphabetical characters.
        const marker = new google.maps.Marker({
            position: location,
            title: 'Hello World',
            label: labels[labelIndex++ % labels.length],
            map: map,
        });

        //! Add click event listener to marker instance
        marker.addListener('click', () => {
            infowindow.open({
                anchor: marker,
                map,
            });
        });
    }

    //! Add a polyline to the map
    function addPoly(event) {
        const path = poly.getPath();

        // Because path is an MVCArray, we can simply append a new coordinate
        // and it will automatically appear.
        path.push(event.latLng);
        // Add a new marker at the new plotted point on the polyline.
        new google.maps.Marker({
            position: event.latLng,
            title: '#' + path.getLength(),
            map: map,
        });
    }

    function showArrays(event) {
        const polygon = this;
        const vertices = polygon.getPath();
        let contentString =
            '<b>Bermuda Triangle polygon</b><br>' +
            'Clicked location: <br>' +
            event.latLng.lat() +
            ',' +
            event.latLng.lng() +
            '<br>';

        // Iterate over the vertices.
        for (let i = 0; i < vertices.getLength(); i++) {
            const xy = vertices.getAt(i);

            contentString += '<br>' + 'Coordinate ' + i + ':<br>' + xy.lat() + ',' + xy.lng();
        }

        // Replace the info window's content and position.
        infowindow.setContent(contentString);
        infowindow.setPosition(event.latLng);
        infowindow.open(map);
    }

    //! Add click event listener to map instance to add marker to the map
    google.maps.event.addListener(map, 'click', (event) => {
        addMarker(event.latLng, map);
        // addPoly(event);
    });

    //! Add click event listener to marker instance
    marker.addListener('click', () => {
        infowindow.open({
            anchor: marker,
            map,
        });
    });

    //! Add click event listener to marker instance
    polygon.addListener('click', () => {
        infowindow.open({
            anchor: polygon,
            map,
        });
    });

    polygon.addListener('click', showArrays);

    circle.addListener('click', () => {
        return alert('you click the circle');
    });

    poly.setMap(map);
    polygon.setMap(map);
}

window.initMap = initMap;