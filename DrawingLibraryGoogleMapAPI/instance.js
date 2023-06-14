export const contentString =
    '<div id="content">' +
    '<div id="siteNotice">' +
    '</div>' +
    '<h1 id="firstHeading" class="firstHeading">Uluru</h1>' +
    '<div id="bodyContent">' +
    '<p><b>Uluru</b>, also referred to as <b>Ayers Rock</b>, is a large ' +
    'sandstone rock formation in the southern part of the ' +
    'Northern Territory, central Australia. It lies 335&#160;km (208&#160;mi) ' +
    'south west of the nearest large town, Alice Springs; 450&#160;km ' +
    '(280&#160;mi) by road. Kata Tjuta and Uluru are the two major ' +
    'features of the Uluru - Kata Tjuta National Park. Uluru is ' +
    'sacred to the Pitjantjatjara and Yankunytjatjara, the ' +
    'Aboriginal people of the area. It has many springs, waterholes, ' +
    'rock caves and ancient paintings. Uluru is listed as a World ' +
    'Heritage Site.</p>' +
    '<p>Attribution: Uluru, <a href="https://en.wikipedia.org/w/index.php?title=Uluru&oldid=297882194">' +
    'https://en.wikipedia.org/w/index.php?title=Uluru</a> ' +
    '(last visited June 22, 2009).</p>' +
    '</div>' +
    '</div>';

// google.maps.event.addListener(drawingManager, 'overlaycomplete', function (event) {
//     if (event.type == google.maps.drawing.OverlayType.CIRCLE) {
//         const circle = event.overlay;
//         const center = circle.getCenter();
//         const radius = circle.getRadius();

//         google.maps.event.addListener(map, 'click', function (event) {
//             const distance = google.maps.geometry.spherical.computeDistanceBetween(center, event.latLng);

//             //! check if outside boundary
//             if (distance > radius) {
//                 return swal('Opps', 'You clicked outside the boundary!', 'info');
//             }
//         });
//     }
// });

// google.maps.event.addListener(map, 'click', function (event) {
//     const lat = event.latLng.lat();
//     const lng = event.latLng.lng();

//     //! check if on water
//     detectWater(lat, lng);
// });

// const detectWater = async (lat, lng) => {
//     try {
//         const url = `https://isitwater-com.p.rapidapi.com/?latitude=${lat}&longitude=${lng}`;
//         const options = {
//             method: 'GET',
//             headers: {
//                 'X-RapidAPI-Key': '911f81d9e3msh5f705b8931d758cp13855bjsn19b3ba12960e',
//                 'X-RapidAPI-Host': 'isitwater-com.p.rapidapi.com',
//             },
//         };
//         const response = await fetch(url, options);
//         const result = await response.json();
//         console.log(result);
//         if (result.water) {
//             return alert('You clicked outside the land!');
//         }
//         return alert('You clicked inside the land!');
//     } catch (error) {
//         console.error(error);
//     }
// };
