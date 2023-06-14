import { environment } from 'src/environments/environment.development';
import { Component, OnInit } from '@angular/core';
import { Loader } from '@googlemaps/js-api-loader';
import * as _ from 'lodash';
import { HttpClient } from '@angular/common/http';

let map: google.maps.Map;
const VietNamCor = { lat: 15.9031, lng: 105.8067 };
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
];

let loader = new Loader({
    apiKey: environment.apiKey,
    version: 'weekly',
});

const circles: Array<any> = [];
const blueMarkers: Array<any> = [];
let currentInfoWindow: any = null;
let demo:any = []
@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
    constructor(private http: HttpClient) {}

    result: any;
    successMarkers: Array<Object> = [];
    coordinate: Array<Object> = [
        {
            lat: Number,
            lng: Number,
        },
    ];
    drawingManager: any;

    ngOnInit(): void {
        this.demo();
    }

    demo() {
        const detectWater = async (lat?: number, lng?: number) => {
            try {
                const url = `https://isitwater-com.p.rapidapi.com/?latitude=${lat}&longitude=${lng}`;
                const options = {
                    method: 'GET',
                    headers: {
                        'X-RapidAPI-Key':
                            '911f81d9e3msh5f705b8931d758cp13855bjsn19b3ba12960e',
                        'X-RapidAPI-Host': 'isitwater-com.p.rapidapi.com',
                    },
                };
                const response = await fetch(url, options);
                const result = await response.json();
                if (result.water) {
                    return true;
                }
                return false;
            } catch (error) {
                console.error(error);
                return undefined;
            }
        };

        loader.load().then(async () => {
            //* initial map element
            const { Map } = (await google.maps.importLibrary(
                'maps'
            )) as google.maps.MapsLibrary;
            map = new Map(document.getElementById('map') as HTMLElement, {
                center: VietNamCor,
                zoom: 8,
            });
            //* create circle instance.
            const circle1 = new google.maps.Circle({
                editable: true,
                strokeColor: '#FF0000',
                strokeOpacity: 0.8,
                strokeWeight: 2,
                fillColor: '#FF0000',
                fillOpacity: 0.35,
                map,
                center: { lat: 16.463713, lng: 107.590866 },
                radius: Math.sqrt(2) * 100000,
            });
            const circle2 = new google.maps.Circle({
                editable: true,
                strokeColor: '#FF0000',
                strokeOpacity: 0.8,
                strokeWeight: 2,
                fillColor: '#FF0000',
                fillOpacity: 0.35,
                map,
                center: { lat: 13.9833, lng: 108 },
                radius: Math.sqrt(2) * 100000,
            });

            //* Create the polygon instance
            // const polygon = new google.maps.Polygon({
            //     paths: triangleCoords,
            //     strokeColor: '#FF0000',
            //     strokeOpacity: 0.8,
            //     strokeWeight: 2,
            //     fillColor: '#FF0000',
            //     fillOpacity: 0.35,
            // });

            // const rectangle = new google.maps.Rectangle({
            //     strokeColor: '#FF0000',
            //     strokeOpacity: 0.8,
            //     strokeWeight: 2,
            //     fillColor: '#FF0000',
            //     fillOpacity: 0.35,
            //     map,
            //     bounds: {
            //         north: 23.393395,
            //         south: 8.559559,
            //         east: 109.464211,
            //         west: 102.144033,
            //     },
            // });

            // rectangle.addListener('rightclick', () => {
            //     rectangle.setEditable(true);
            // });

            // polygon.addListener('rightclick', () => {
            //     polygon.setEditable(true);
            // });

            // polygon.addListener('bounds_changed', () => {
            //     console.log('event fired');
            // });

            //* Create marker instance
            const markers = VNlocations.map(
                (item: { lat: number; lng: number }, index: number) => {
                    const marker = new google.maps.Marker({
                        position: item,
                        map,
                        title: `Item index ${index}`,
                    });

                    marker.addListener('rightclick', () => {
                        if (currentInfoWindow) {
                            currentInfoWindow.close();
                        }
                        const infowindow = new google.maps.InfoWindow({
                            content:
                                '<div><input type="checkbox" id="edit">Edit</div>' +
                                '<div><input type="checkbox" id="remove">Remove</div>',
                        });
                        infowindow.open(map, marker);
                        currentInfoWindow = infowindow;

                        infowindow.addListener('domready', () => {
                            const editCheckbox =
                                document.getElementById('edit');
                            const removeCheckbox =
                                document.getElementById('remove');

                            if (marker.getDraggable()) {
                                editCheckbox?.setAttribute('checked', 'true');
                            } else {
                                editCheckbox?.removeAttribute('checked');
                            }

                            editCheckbox?.addEventListener('change', () => {
                                if (marker.getDraggable()) {
                                    editCheckbox?.removeAttribute('checked');
                                    marker.setDraggable(false);
                                } else {
                                    editCheckbox.setAttribute(
                                        'checked',
                                        'true'
                                    );
                                    marker.setDraggable(true);
                                }
                            });

                            removeCheckbox?.addEventListener('change', () => {
                                marker.setMap(null);
                            });

                            marker.addListener('dragend', async () => {
                                const lat = marker.getPosition()?.lat();
                                const lng = marker.getPosition()?.lng();

                                const isWater = await detectWater(lat, lng);

                                if (isWater) {
                                    marker.setIcon(
                                        'http://maps.google.com/mapfiles/ms/icons/blue-dot.png'
                                    );
                                } else {
                                    marker.setIcon(
                                        'http://maps.google.com/mapfiles/ms/icons/red-dot.png'
                                    );
                                }
                            });
                        });
                    });
                    // const demo1 = circle.getCenter();
                    // const demo2 = marker.getPosition();

                    // if (demo2 && demo1) {
                    //     if (
                    //         google.maps.geometry.spherical.computeDistanceBetween(
                    //             demo1,
                    //             demo2
                    //         ) <= circle.getRadius()
                    //     ) {
                    //         marker.setIcon(
                    //             'http://maps.google.com/mapfiles/ms/icons/blue-dot.png'
                    //         );
                    //     } else {
                    //         marker.setIcon(
                    //             'http://maps.google.com/mapfiles/ms/icons/red-dot.png'
                    //         );
                    //     }
                    // } else {
                    //     console.log(`Error before`);
                    // }
                    return marker;
                }
            );

            // rectangle.addListener('bounds_changed', () => {
            //     const rectangleBound = rectangle.getBounds();
            //     markers.forEach((item, index) => {
            //         const itemPosition = item.getPosition();
            //         if (
            //             itemPosition &&
            //             rectangleBound?.contains(itemPosition)
            //         ) {
            //             item.setIcon(
            //                 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png'
            //             );
            //         } else {
            //             item.setIcon(
            //                 'http://maps.google.com/mapfiles/ms/icons/red-dot.png'
            //             );
            //         }
            //     });
            // });

            // this.http
            //     .get('assets/Book1.csv', { responseType: 'text' })
            //     .subscribe(
            //         (data: any) => {
            //             this.result = data.split('\n');

            //             const markers = this.result.map(
            //                 (item: any, index: number) => {
            // this.coordinate.push({
            //     lat: item.split(',')[0],
            //     lng: item.split(',')[1],
            // });

            //                     const marker = new google.maps.Marker({
            //                         position: {
            //                             lat: Number(item.split(',')[0]),
            //                             lng: Number(item.split(',')[1]),
            //                         },
            //                         map,
            //                         title: `Item index ${index}`,
            //                     });

            //                     return marker;
            //                 }
            //             );
            //         },
            //         (error: any) => console.log(error.error)
            //     );

            //* Create polyline instance
            // const poly = new google.maps.Polyline({
            //     path: flightPlanCoordinates,
            //     geodesic: true,
            //     strokeColor: '#FF0000',
            //     strokeOpacity: 1.0,
            //     strokeWeight: 2,
            // });

            // circle.addListener('bounds_changed', () => {
            //     VNlocations.map(
            //         (item: { lat: number; lng: number }, index: number) => {
            //             const marker = new google.maps.Marker({
            //                 position: item,
            //                 map,
            //                 title: `Item index ${index}`,
            //             });
            //             const demo1 = circle.getCenter();
            //             const demo2 = marker.getPosition();

            //             if (demo2 && demo1) {
            //                 if (
            //                     google.maps.geometry.spherical.computeDistanceBetween(
            //                         demo1,
            //                         demo2
            //                     ) <= circle.getRadius()
            //                 ) {
            //                     marker.setIcon(
            //                         'http://maps.google.com/mapfiles/ms/icons/blue-dot.png'
            //                     );
            //                 } else {
            //                     marker.setIcon(
            //                         'http://maps.google.com/mapfiles/ms/icons/red-dot.png'
            //                     );
            //                 }
            //             } else {
            //                 console.log(`Error before`);
            //             }
            //         }
            //     );
            // });

            //! Add click event listener to map instance
            map.addListener('click', function (event: any) {
                // const lat = e.latLng.lat();
                // const lng = e.latLng.lng();

                //! check if on water
                // detectWater(lat, lng);

                let marker = new google.maps.Marker({
                    position: event.latLng,
                    map: map,
                });
            });

            //! Add click event listener to marker instance
            // marker.addListener('click', () => {
            //     console.log('click event fired');
            // });

            // poly.setMap(map);
            // polygon.setMap(map);

            this.drawingManager = new google.maps.drawing.DrawingManager({
                drawingMode: null,
                drawingControl: false,
                circleOptions: {
                    fillColor: '#ffff00',
                    fillOpacity: 1,
                    strokeWeight: 5,
                    clickable: false,
                    editable: true,
                    zIndex: 1,
                },
            });

            // google.maps.event.addListener(
            //     this.drawingManager,
            //     'circlecomplete',
            //     function (circle: any) {
            //         const circleCenter = circle.getCenter();
            //         const circleRadius = circle.getRadius();
            //         VNlocations.map(
            //             (item: { lat: number; lng: number }, index: number) => {
            //                 const marker = new google.maps.Marker({
            //                     position: item,
            //                     map,
            //                     title: `Item index ${index}`,
            //                 });
            //                 const markerPosition = marker.getPosition();

            //                 if (markerPosition && circleCenter) {
            //                     if (
            //                         google.maps.geometry.spherical.computeDistanceBetween(
            //                             circleCenter,
            //                             markerPosition
            //                         ) <= circleRadius
            //                     ) {
            //                         marker.setIcon(
            //                             'http://maps.google.com/mapfiles/ms/icons/blue-dot.png'
            //                         );
            //                         blueMarkers.push(marker);
            //                     } else {
            //                         marker.setIcon(
            //                             'http://maps.google.com/mapfiles/ms/icons/red-dot.png'
            //                         );
            //                     }
            //                 } else {
            //                     console.log(`Error before`);
            //                 }
            //             }
            //         );
            //     }
            // );
            this.drawingManager.setMap(map);
        });
    }

    handleDrawHandClick = () => {
        this.drawingManager.setDrawingMode(null);
    };

    handleDrawMarkerClick = () => {
        this.drawingManager.setDrawingMode(
            google.maps.drawing.OverlayType.MARKER
        );

        google.maps.event.addListener(
            this.drawingManager,
            'markercomplete',
            function (marker: any) {
                marker.addListener('rightclick', () => {
                    if (currentInfoWindow) {
                        currentInfoWindow.close();
                    }
                    const infowindow = new google.maps.InfoWindow({
                        content:
                            '<div><input type="checkbox" id="edit">Edit</div>' +
                            '<div><input type="checkbox" id="remove">Remove</div>',
                    });

                    infowindow.open(map, marker);
                    currentInfoWindow = infowindow;

                    infowindow.addListener('domready', () => {
                        const editCheckbox = document.getElementById('edit');
                        const removeCheckbox =
                            document.getElementById('remove');

                        if (marker.getDraggable()) {
                            editCheckbox?.setAttribute('checked', 'true');
                        } else {
                            editCheckbox?.removeAttribute('checked');
                        }

                        editCheckbox?.addEventListener('change', () => {
                            if (marker.getDraggable()) {
                                editCheckbox?.removeAttribute('checked');
                                marker.setDraggable(null);
                            } else {
                                editCheckbox.setAttribute('checked', 'true');
                                marker.setDraggable(true);
                            }
                        });

                        removeCheckbox?.addEventListener('change', () => {
                            marker.setMap(null);
                        });
                    });
                });
            }
        );
    };

    handleDrawCircleClick = () => {
        this.drawingManager.setDrawingMode(
            google.maps.drawing.OverlayType.CIRCLE
        );

        google.maps.event.addListener(
            this.drawingManager,
            'circlecomplete',
            function (circle: any) {
                circles.push(circle);

                circle.addListener('rightclick', function () {
                    console.log('Right click triggered');
                });

                circle.addListener('bounds_changed', () => {
                    const circleCenter = circle.getCenter();
                    const circleRadius = circle.getRadius();
                    VNlocations.map(
                        (item: { lat: number; lng: number }, index: number) => {
                            const marker = new google.maps.Marker({
                                position: item,
                                map,
                                title: `Item index ${index}`,
                            });
                            const markerPosition = marker.getPosition();

                            if (markerPosition && circleCenter) {
                                if (
                                    google.maps.geometry.spherical.computeDistanceBetween(
                                        circleCenter,
                                        markerPosition
                                    ) <= circleRadius
                                ) {
                                    marker.setIcon(
                                        'http://maps.google.com/mapfiles/ms/icons/blue-dot.png'
                                    );
                                    blueMarkers.push(marker);
                                } else {
                                    marker.setIcon(
                                        'http://maps.google.com/mapfiles/ms/icons/red-dot.png'
                                    );
                                }
                            } else {
                                console.log(`Error before`);
                            }
                        }
                    );
                });
            }
        );
    };

    handleClearCircleClick = () => {
        circles.forEach((circle) => {
            circle.setMap(null);
        });

        // circles.length = 0;
    };

    handleDrawShapeClick = () => {
        this.drawingManager.setDrawingMode(
            google.maps.drawing.OverlayType.POLYGON
        );

        google.maps.event.addListener(
            this.drawingManager,
            'polygoncomplete',
            function (polygon: any) {
                polygon.addListener('rightclick', function (event: any) {
                    if (currentInfoWindow) {
                        currentInfoWindow.close();
                    }
                    const infowindow = new google.maps.InfoWindow({
                        content:
                            '<div><input type="checkbox" id="edit">Edit</div>' +
                            '<div><input type="checkbox" id="remove">Remove</div>',
                    });

                    infowindow.setPosition(event.latLng);
                    infowindow.open(map);
                    currentInfoWindow = infowindow;

                    infowindow.addListener('domready', () => {
                        const editCheckbox = document.getElementById('edit');
                        const removeCheckbox =
                            document.getElementById('remove');

                        if (polygon.getDraggable()) {
                            editCheckbox?.setAttribute('checked', 'true');
                        } else {
                            editCheckbox?.removeAttribute('checked');
                        }

                        editCheckbox?.addEventListener('change', () => {
                            if (polygon.getDraggable()) {
                                editCheckbox?.removeAttribute('checked');
                                polygon.setDraggable(null);
                            } else {
                                editCheckbox.setAttribute('checked', 'true');
                                polygon.setDraggable(true);
                            }
                        });

                        removeCheckbox?.addEventListener('change', () => {
                            polygon.setMap(null);
                            infowindow.close();
                        });
                    });
                });
            }
        );
    };
    handleDrawLineClick = () => {
        this.drawingManager.setDrawingMode(
            google.maps.drawing.OverlayType.POLYLINE
        );

        google.maps.event.addListener(
            this.drawingManager,
            'polylinecomplete',
            function (line: any) {
                line.addListener('rightclick', function (event: any) {
                    if (currentInfoWindow) {
                        currentInfoWindow.close();
                    }
                    const infowindow = new google.maps.InfoWindow({
                        content:
                            '<div><input type="checkbox" id="edit">Edit</div>' +
                            '<div><input type="checkbox" id="remove">Remove</div>',
                    });

                    infowindow.setPosition(event.latLng);
                    infowindow.open(map);
                    currentInfoWindow = infowindow;

                    infowindow.addListener('domready', () => {
                        const editCheckbox = document.getElementById('edit');
                        const removeCheckbox =
                            document.getElementById('remove');

                        if (line.getDraggable()) {
                            editCheckbox?.setAttribute('checked', 'true');
                        } else {
                            editCheckbox?.removeAttribute('checked');
                        }

                        editCheckbox?.addEventListener('change', () => {
                            if (line.getDraggable()) {
                                editCheckbox?.removeAttribute('checked');
                                line.setDraggable(null);
                            } else {
                                editCheckbox.setAttribute('checked', 'true');
                                line.setDraggable(true);
                            }
                        });

                        removeCheckbox?.addEventListener('change', () => {
                            line.setMap(null);
                            infowindow.close();
                        });
                    });
                });
            }
        );
    };
    handleDrawRectangleClick = () => {
        this.drawingManager.setDrawingMode(
            google.maps.drawing.OverlayType.RECTANGLE
        );

        google.maps.event.addListener(
            this.drawingManager,
            'rectanglecomplete',
            function (rectangle: any) {
                rectangle.addListener('rightclick', function (event: any) {
                    if (currentInfoWindow) {
                        currentInfoWindow.close();
                    }
                    const infowindow = new google.maps.InfoWindow({
                        content:
                            '<div><input type="checkbox" id="edit">Edit</div>' +
                            '<div><input type="checkbox" id="remove">Remove</div>',
                    });

                    infowindow.setPosition(event.latLng);
                    infowindow.open(map);
                    currentInfoWindow = infowindow;

                    infowindow.addListener('domready', () => {
                        const editCheckbox = document.getElementById('edit');
                        const removeCheckbox =
                            document.getElementById('remove');

                        if (rectangle.getDraggable()) {
                            editCheckbox?.setAttribute('checked', 'true');
                        } else {
                            editCheckbox?.removeAttribute('checked');
                        }

                        editCheckbox?.addEventListener('change', () => {
                            if (rectangle.getDraggable()) {
                                editCheckbox?.removeAttribute('checked');
                                rectangle.setDraggable(null);
                            } else {
                                editCheckbox.setAttribute('checked', 'true');
                                rectangle.setDraggable(true);
                            }
                        });

                        removeCheckbox?.addEventListener('change', () => {
                            rectangle.setMap(null);
                            infowindow.close();
                        });
                    });
                });
            }
        );
    };

    handleShowBlueMarkers = () => {
        blueMarkers.forEach((item, index) =>
            console.log(`item at index ${index}`)
        );
    };
}
