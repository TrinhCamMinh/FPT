import { environment } from 'src/environments/environment.development';
import { Component, OnInit } from '@angular/core';
import { Loader } from '@googlemaps/js-api-loader';
import * as _ from 'lodash';
import { HttpClient } from '@angular/common/http';

let map: google.maps.Map;
const VietNamCor = { lat: 15.9031, lng: 105.8067 };

let loader = new Loader({
    apiKey: environment.apiKey,
    version: 'weekly',
});

let currentInfoWindow: any = null;
const circles: Array<any> = [];
const markers: Array<any> = [];
const rectangles: Array<any> = [];
let isOpenDetectWater: Boolean = false;
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

    readFile = () => {
        this.http.get('assets/Book1.csv', { responseType: 'text' }).subscribe(
            (data: any) => {
                this.result = data.split('\n');

                this.result.map((item: any, index: number) => {
                    this.coordinate.push({
                        lat: item.split(',')[0],
                        lng: item.split(',')[1],
                    });

                    const marker = new google.maps.Marker({
                        position: {
                            lat: Number(item.split(',')[0]),
                            lng: Number(item.split(',')[1]),
                        },
                        map,
                        title: `Item index ${index}`,
                    });

                    return marker;
                });
            },
            (error: any) => console.log(error.error)
        );
    };

    handleWaterCheckBox = (event: any) => {
        if (event.target.checked) {
            isOpenDetectWater = true;
        } else {
            isOpenDetectWater = false;
        }
    };

    demo() {
        loader.load().then(async () => {
            //* initial map element
            const { Map } = (await google.maps.importLibrary(
                'maps'
            )) as google.maps.MapsLibrary;
            map = new Map(document.getElementById('map') as HTMLElement, {
                center: VietNamCor,
                zoom: 8,
            });

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
            this.drawingManager.setMap(map);
        });
    }

    handleDrawHandClick = () => {
        this.drawingManager.setDrawingMode(null);
    };

    handleDrawMarkerClick = () => {
        async function detectWater(lat?: number, lng?: number) {
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
        }

        this.drawingManager.setDrawingMode(
            google.maps.drawing.OverlayType.MARKER
        );

        google.maps.event.addListener(
            this.drawingManager,
            'markercomplete',
            async function (marker: any) {
                marker.setIcon(
                    'http://maps.google.com/mapfiles/ms/icons/red-dot.png'
                );

                const lat = marker.getPosition()?.lat();
                const lng = marker.getPosition()?.lng();

                //Toggle check water functionality
                if (isOpenDetectWater) {
                    const isWater = await detectWater(lat, lng);

                    if (isWater) {
                        alert('You are placing marker on water');
                        return marker.setMap(null);
                    }
                }

                markers.push(marker);

                if (circles.length > 0) {
                    circles.forEach((item) => {
                        const circleCenter = item.getCenter();
                        const circleRadius = item.getRadius();
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
                            } else {
                                marker.setIcon(
                                    'http://maps.google.com/mapfiles/ms/icons/red-dot.png'
                                );
                            }
                        }
                    });
                }

                if (rectangles.length > 0) {
                    const markerPosition = marker.getPosition();
                    rectangles.forEach((item) => {
                        const rectangleBound = item.getBounds();
                        if (
                            markerPosition &&
                            rectangleBound?.contains(markerPosition)
                        ) {
                            marker.setIcon(
                                'http://maps.google.com/mapfiles/ms/icons/blue-dot.png'
                            );
                        } else {
                            marker.setIcon(
                                'http://maps.google.com/mapfiles/ms/icons/red-dot.png'
                            );
                        }
                    });
                }

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

                marker.addListener('dragend', async () => {
                    const lat = marker.getPosition()?.lat();
                    const lng = marker.getPosition()?.lng();
                    const markerPosition = marker.getPosition();

                    if (isOpenDetectWater) {
                        const isWater = await detectWater(lat, lng);
                        if (isWater) {
                            alert('You are placing marker on water');
                            return marker.setMap(null);
                        }
                    }

                    circles.forEach((item) => {
                        const circleCenter = item.getCenter();
                        const circleRadius = item.getRadius();

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
                            } else {
                                marker.setIcon(
                                    'http://maps.google.com/mapfiles/ms/icons/red-dot.png'
                                );
                            }
                        }
                    });

                    rectangles.forEach((item) => {
                        const rectangleBound = item.getBounds();
                        if (
                            markerPosition &&
                            rectangleBound?.contains(markerPosition)
                        ) {
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

                circle.addListener('bounds_changed', () => {
                    const circleCenter = circle.getCenter();
                    const circleRadius = circle.getRadius();

                    markers.forEach((item) => {
                        const markerPosition = item.getPosition();

                        if (markerPosition && circleCenter) {
                            if (
                                google.maps.geometry.spherical.computeDistanceBetween(
                                    circleCenter,
                                    markerPosition
                                ) <= circleRadius
                            ) {
                                item.setIcon(
                                    'http://maps.google.com/mapfiles/ms/icons/blue-dot.png'
                                );
                            } else {
                                item.setIcon(
                                    'http://maps.google.com/mapfiles/ms/icons/red-dot.png'
                                );
                            }
                        }
                    });
                });
            }
        );
    };

    handleClearCircleClick = () => {
        circles.forEach((circle) => {
            circle.setMap(null);
        });

        circles.length = 0;
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
                rectangles.push(rectangle);

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

                rectangle.addListener('dragend', () => {
                    const rectangleBound = rectangle.getBounds();
                    markers.forEach((item) => {
                        const itemPosition = item.getPosition();
                        if (
                            itemPosition &&
                            rectangleBound?.contains(itemPosition)
                        ) {
                            item.setIcon(
                                'http://maps.google.com/mapfiles/ms/icons/blue-dot.png'
                            );
                        } else {
                            item.setIcon(
                                'http://maps.google.com/mapfiles/ms/icons/red-dot.png'
                            );
                        }
                    });
                });
            }
        );
    };
}
