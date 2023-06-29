import { environment } from 'src/environments/environment.development';
import { Component, OnInit } from '@angular/core';
import { Loader } from '@googlemaps/js-api-loader';
import { HttpClient } from '@angular/common/http';
import { MarkerClusterer } from '@googlemaps/markerclusterer';
// import tinycolor from 'tinycolor2';
import hull from 'hull.js';

let map: google.maps.Map;
let currentInfoWindow: any = null;
let isOpenDetectWater: Boolean = false;

const circles: Array<any> = [];
const markers: Array<any> = [];
const rectangles: Array<any> = [];
const ganivos: Array<any> = [];
const tanks: Array<any> = [];
const TilePines: Array<any> = [];
const polylines1: Array<any> = [];
const polylines2: Array<any> = [];

let demo: Array<any> = [];
let rectangle: any;
let randomMarkers = [];
let randomTanksMarkers: Array<any> = [];
let randomGanivoMarkers: Array<any> = [];
let randomTIlesMarkers: Array<any> = [];
let polygon: any;
let polygonHull: Array<any> = [];
let marker;
let points: Array<any> = [];

const loader = new Loader({
	apiKey: environment.apiKey,
	version: 'weekly',
});

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
	constructor(private http: HttpClient) {}

	successMarkers: Array<Object> = [];
	coordinate: Array<Object> = [
		{
			lat: Number,
			lng: Number,
		},
	];
	drawingManager: any;

	ngOnInit(): void {
		// this.readFile('assets/GaniVo_SG.csv', 'Ganivo');
		// this.readFile('assets/HamBe_SG.csv', 'HamBe');
		// this.readFile('assets/OngNgoi_SG.csv', 'OngNgoi');
		// this.readFile('assets/Doan_Ong_Ngam.csv', 'DoanOngNgamMang');
		// this.readFile('assets/Doan_Ong_Ngam.csv', 'DoanOngNgam');
		this.initLeftSideBar();
		this.init();
	}

	initInforWindow = (instance: any, content?: string) => {
		let defaultValue = false;
		if (!content) {
			content = `
                <div><input type="checkbox" id="edit">Edit</div>
                <div><input type="checkbox" id="remove">Remove</div>
            `;
			defaultValue = true;
		}

		if (currentInfoWindow) {
			currentInfoWindow.close();
		}

		const infowindow = new google.maps.InfoWindow({
			content,
		});

		infowindow.open(map, instance);
		currentInfoWindow = infowindow;

		infowindow.addListener('domready', () => {
			//* check if content is equal to a default value
			if (defaultValue) {
				const editCheckbox = document.getElementById('edit');
				const removeCheckbox = document.getElementById('remove');

				if (instance.getDraggable()) {
					editCheckbox?.setAttribute('checked', 'true');
				} else {
					editCheckbox?.removeAttribute('checked');
				}

				editCheckbox?.addEventListener('change', () => {
					if (instance.getDraggable()) {
						editCheckbox?.removeAttribute('checked');
						instance.setDraggable(null);
					} else {
						editCheckbox.setAttribute('checked', 'true');
						instance.setDraggable(true);
					}
				});

				removeCheckbox?.addEventListener('change', () => {
					instance.setMap(null);
				});
			}
		});
	};

	initLeftSideBar = () => {
		const sideBarItems = document.querySelectorAll('.sidebar-item');
		const sideBarForm = document.querySelector('.sidebar-form-container');
		const buttons = document.querySelectorAll('.button-5');
		const randomBtn = document.createElement('button');
		const sideBarFormContentItemContainer = document.querySelector(
			'.sidebar-form-content-item-container'
		);

		sideBarItems.forEach((item) => {
			let isOpen = false;

			item.addEventListener('click', () => {
				const text = item.textContent;
				console.log(text)
				if (sideBarForm) {
					if (text === 'Underground infrastructure map') {
						if (!isOpen) {
							(sideBarForm as HTMLElement).style.display = 'flex';
							isOpen = true;
						} else {
							(sideBarForm as HTMLElement).style.display = 'none';
							isOpen = false;
						}
					}
				}
			});
		});

		buttons.forEach((item) => {
			let isShow = false;
			const text = (item as HTMLElement).innerText;
			const imageContainer = document.querySelector(
				'.sidebar-form-content-image-group'
			);

			item.addEventListener('click', () => {
				if (!isShow && sideBarFormContentItemContainer) {
					(
						sideBarFormContentItemContainer as HTMLElement
					).style.display = 'flex';
					isShow = true;
				} else if (sideBarFormContentItemContainer) {
					(
						sideBarFormContentItemContainer as HTMLElement
					).style.display = 'none';
					isShow = false;
				}

				if (isShow === false) {
					randomBtn.remove();
				}

				if (imageContainer) {
					if (text.trim() === 'Tanks') {
						randomBtn.textContent = 'Demo Tank Button';

						imageContainer.innerHTML = `
							<img width="24" height="24" src="/assets/images/tank1.png" alt="tank--v1"/>
							<img width="24" height="24" src="/assets/images/tank2.png" alt="tank--v2"/>
						`;
						imageContainer.after(randomBtn);

						//! catch click event on append change icon
						document.addEventListener('click', (event: any) => {
							if (event.target.matches('img')) {
								if (event.target.alt === 'tank--v1') {
									this.handleChangeTankIcon(1);
								}

								if (event.target.alt === 'tank--v2') {
									this.handleChangeTankIcon(2);
								}
							}
						});

						randomBtn?.addEventListener('click', () => {
							this.handleRandomMarker('Tanks');
						});
					}

					if (text.trim() === 'Ganivo') {
						randomBtn.textContent = 'Demo Ganivo Button';

						imageContainer.innerHTML = `
							<img width="24" height="24" src="/assets/images/ganivo1.png" alt="ganivo--v1"/>
							<img width="24" height="24" src="/assets/images/ganivo2.png" alt="ganivo--v2"/>
						`;

						imageContainer.after(randomBtn);

						//! catch click event on append change icon
						document.addEventListener('click', (event: any) => {
							if (event.target.matches('img')) {
								if (event.target.alt === 'ganivo--v1') {
									this.handleChangeGanivoIcon(1);
								}

								if (event.target.alt === 'ganivo--v2') {
									this.handleChangeGanivoIcon(2);
								}
							}
						});

						randomBtn?.addEventListener('click', () => {
							this.handleRandomMarker('Ganivo');
						});
					}

					if (text.trim() === 'Tiles Piline') {
						randomBtn.textContent = 'Demo Tiles Button';

						imageContainer.innerHTML = `
							<img width="24" height="24" src="/assets/images/tiles.png" alt="tiles--v1"/>
						`;

						imageContainer.after(randomBtn);

						//! catch click event on append change icon
						document.addEventListener('click', (event: any) => {
							if (event.target.matches('img')) {
								if (event.target.alt === 'tiles--v1') {
									this.handleChangeTilePineIcon(1);
								}
							}
						});

						randomBtn?.addEventListener('click', () => {
							this.handleRandomMarker('Tiles Piline');
						});
					}
				}
			});
		});
	};

	iniRightSideBar = (name: string, type: string) => {
		const markerName = document.querySelector('.marker-name');
		const markerType = document.querySelector('.marker-type');
		const rightSidebar = document.querySelector('.right-sidebar-container');

		if (markerName && markerType) {
			markerName.innerHTML = name;
			markerType.innerHTML = type;
			(rightSidebar as HTMLElement).style.display = 'flex';
		}

		//close sidebar
		const closeBtn = document.querySelector('.close-btn');
		const rightSideBar = document.querySelector('.right-sidebar-container');

		if (closeBtn && rightSideBar) {
			closeBtn.addEventListener('click', () => {
				(rightSideBar as HTMLElement).style.display = 'none';
			});
		}
	};

	getRandom_marker(bounds: any) {
		const leftBottom = [
			bounds.getSouthWest().lat(),
			bounds.getSouthWest().lng(),
		];
		const rightTop = [
			bounds.getNorthEast().lat(),
			bounds.getNorthEast().lng(),
		];
		const latlng = [
			leftBottom[0] +
				Math.floor(Math.random() * (rightTop[0] - leftBottom[0])),
			leftBottom[1] +
				Math.floor(Math.random() * (rightTop[1] - leftBottom[1])),
		];
		const marker = new google.maps.Marker({
			position: new google.maps.LatLng(latlng[0], latlng[1]),
			icon: 'http://maps.google.com/mapfiles/ms/icons/red-dot.png',
			map,
			title: 'Hello World',
		});

		return marker;
	}

	async readFile(fileURL: any = 'assets/Demo.csv', instance: any = null) {
		const data = await this.http
			.get(fileURL, { responseType: 'text' })
			.toPromise();
		const result = data?.split('\n');

		if (
			instance === 'Ganivo' ||
			instance === 'HamBe' ||
			instance === 'OngNgoi'
		) {
			const markers = result?.map((item: any, index: number) => {
				const lat = item.split(',')[2].replaceAll('"', ' ');
				const lng = item.split(',')[3].replaceAll('"', ' ');
				const name = item.split(',')[0].replaceAll('"', ' ');
				const type = item.split(',')[1].replaceAll('"', ' ');

				const marker = new google.maps.Marker({
					position: {
						lat: Number(lat),
						lng: Number(lng),
					},
					map,
					title: `Item index ${index}`,
				});

				if (instance === 'Ganivo') {
					console.log('here 2');
					marker.setIcon('/assets/images/ganivo1.png');
					ganivos.push(marker);
				}

				if (instance === 'HamBe') {
					marker.setIcon('/assets/images/tank1.png');
					tanks.push(marker);
				}

				if (instance === 'OngNgoi') {
					marker.setIcon('/assets/images/tiles.png');
					TilePines.push(marker);
				}

				marker.addListener('click', () => {
					// this.initInforWindow(marker, `<strong>${name}</strong>`);
					this.iniRightSideBar(name, type);
				});

				marker.addListener('rightclick', () => {
					this.initInforWindow(marker);
				});

				return marker;
			});

			new MarkerClusterer({ markers, map });
		}

		if (instance === 'DoanOngNgam') {
			result?.map((item: any) => {
				const nums = item.split(',')[2].match(/\d+(.\d+)?/g);
				const name = item.split(',')[0];

				const Coordinates = nums.reduce(
					(acc: any, cur: any, i: number) => {
						if (i % 2 === 0) {
							acc.push({
								lat: Number(cur),
								lng: Number(nums[i + 1]),
							});
						}
						return acc;
					},
					[]
				);

				//! create polyline instance for each line inside the file
				const polyline = new google.maps.Polyline({
					path: Coordinates,
					geodesic: true,
					strokeColor: '#FF0000',
					strokeOpacity: 1.0,
					strokeWeight: 2,
					icons: [
						{
							icon: {
								path: 'M 0,-1 0,1',
								strokeOpacity: 1,
								scale: 4,
							},
							offset: '0',
							repeat: '20px',
						},
					],
				});

				let count = 0;
				window.setInterval(() => {
					count = (count + 1) % 200;

					const icons = polyline.get(
						'icons'
					) as google.maps.IconSequence[];
					icons[0].offset = `${count / 2}%`;
					polyline.set('icons', icons);
				}, 20);

				polyline.addListener('mouseover', () => {
					map.getDiv().setAttribute('title', `${name}`);
				});

				polylines1.push(polyline);
				polyline.setMap(map);
			});
		}

		if (instance === 'DoanOngNgamMang') {
			result?.map((item: any) => {
				const nums = item.split(',')[2].match(/\d+(.\d+)?/g);
				const name = item.split(',')[0];

				const Coordinates = nums.reduce(
					(acc: any, cur: any, i: number) => {
						if (i % 2 === 0) {
							acc.push({
								lat: Number(cur),
								lng: Number(nums[i + 1]),
							});
						}
						return acc;
					},
					[]
				);

				//! create polyline instance for each line inside the file
				const polyline = new google.maps.Polyline({
					path: Coordinates,
					geodesic: true,
					strokeColor: '#4169e1',
					strokeOpacity: 1.0,
					strokeWeight: 2,
				});

				polyline.addListener('mouseover', () => {
					map.getDiv().setAttribute('title', `${name}`);
				});

				polylines2.push(polyline);
				polyline.setMap(map);
			});
		}
	}

	//* Check if this position is in water or not by toggle this variable
	//* if true then it will call the check water function
	handleWaterCheckBox = (event: any) => {
		if (event.target.checked) {
			isOpenDetectWater = true;
		} else {
			isOpenDetectWater = false;
		}
	};

	handleRandomMarker(instance: string) {
		marker = this.getRandom_marker(rectangle.getBounds());

		if (instance === 'Tanks') {
			randomTanksMarkers.push(marker);
			marker.setIcon('/assets/images/tank1.png');
		}

		if (instance === 'Ganivo') {
			randomGanivoMarkers.push(marker);
			marker.setIcon('/assets/images/ganivo1.png');
		}

		if (instance === 'Tiles Piline') {
			randomTIlesMarkers.push(marker);
			marker.setIcon('/assets/images/tiles.png');
		}

		markers.push(marker);

		randomMarkers.push({
			lat: marker.getPosition()?.lat(),
			lng: marker.getPosition()?.lng(),
		});

		markers.forEach((item) => {
			points.push([item.getPosition().lat(), item.getPosition().lng()]);
		});

		if (demo) {
			demo.length = 0;
		}

		if (polygonHull) {
			polygonHull.length = 0;
		}

		if (polygon) {
			polygon.setMap(null);
		}

		demo = hull(points, 40);

		demo.forEach((item) => {
			polygonHull.push({
				lat: item[0],
				lng: item[1],
			});
		});

		polygon = new google.maps.Polygon({
			paths: polygonHull,
			strokeColor: '#FF0000',
			strokeOpacity: 0.8,
			strokeWeight: 2,
			fillColor: '#FF0000',
			fillOpacity: 0.35,
		});

		polygon.setMap(map);

		// if (randomMarkers.length >= 3) {
		// 	if (!polygon) {
		// 		//create a new polygon
		// 		polygon = new google.maps.Polygon({
		// 			paths: randomMarkers,
		// 			strokeColor: '#FF0000',
		// 			strokeOpacity: 0.8,
		// 			strokeWeight: 2,
		// 			fillColor: '#FF0000',
		// 			fillOpacity: 0.35,
		// 		});

		// 		polygon.setMap(map);
		// 	} else {
		// 		if (
		// 			google.maps.geometry.poly.containsLocation(
		// 				marker.getPosition(),
		// 				polygon
		// 			)
		// 		) {
		// 			// Marker is inside the polygon -- change to blue marker
		// 			marker.setIcon(
		// 				'http://maps.google.com/mapfiles/ms/icons/blue-dot.png'
		// 			);
		// 		} else {
		// 			//clear the old polygon
		// 			polygon.setMap(null);
		// 			//expand the polygon's bound
		// 			polygon = new google.maps.Polygon({
		// 				paths: randomMarkers,
		// 				strokeColor: '#FF0000',
		// 				strokeOpacity: 0.8,
		// 				strokeWeight: 2,
		// 				fillColor: '#FF0000',
		// 				fillOpacity: 0.35,
		// 			});

		// 			polygon.setMap(map);
		// 		}
		// 	}
		// }
	}

	init() {
		loader.load().then(async () => {
			//* initial map element
			const { Map } = (await google.maps.importLibrary(
				'maps'
			)) as google.maps.MapsLibrary;
			map = new Map(document.getElementById('map') as HTMLElement, {
				center: { lat: 15.9031, lng: 105.8067 },
				zoom: 8,
				mapTypeControl: true,
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

			rectangle = new google.maps.Rectangle({
				strokeColor: '#FF0000',
				strokeOpacity: 0.8,
				strokeWeight: 2,
				fillColor: '#FF0000',
				fillOpacity: 0.35,
				map,
				bounds: {
					north: 23.393395,
					south: 8.559559,
					east: 109.464211,
					west: 102.144033,
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

	handleChangeGanivoIcon = (type: number = 1) => {
		if (type === 1) {
			ganivos.forEach((item) => {
				item.setIcon('/assets/images/ganivo1.png');
			});

			randomGanivoMarkers.forEach((item) => {
				item.setIcon('/assets/images/ganivo1.png');
			});
		}

		if (type === 2) {
			ganivos.forEach((item) => {
				item.setIcon('/assets/images/ganivo2.png');
			});

			randomGanivoMarkers.forEach((item) => {
				item.setIcon('/assets/images/ganivo2.png');
			});
		}
	};

	handleChangeTilePineIcon = (type: number = 1) => {
		if (type === 1) {
			TilePines.forEach((item) => {
				item.setIcon('/assets/images/tiles.png');
			});

			randomTIlesMarkers.forEach((item) => {
				item.setIcon('/assets/images/tiles.png');
			});
		}
	};

	handleChangeTankIcon = (type: number = 1) => {
		if (type === 1) {
			tanks.forEach((item) => {
				item.setIcon('/assets/images/tank1.png');
			});

			randomTanksMarkers.forEach((item) => {
				item.setIcon('/assets/images/tank1.png');
			});
		}

		if (type === 2) {
			tanks.forEach((item) => {
				item.setIcon('/assets/images/tank2.png');
			});

			randomTanksMarkers.forEach((item) => {
				item.setIcon('/assets/images/tank2.png');
			});
		}
	};

	handleToggleTanks = (event: any) => {
		const checkBox = event.target;
		if (checkBox.checked) {
			this.readFile('assets/HamBe_SG.csv', 'HamBe');
		} else {
			//* make the marker become invisible
			tanks.forEach((item) => item.setVisible(false));

			//* Deletes all markers in the array by removing references to them.
			tanks.length = 0;
			checkBox.removeAttribute('checked');
		}
	};

	handleToggleGanivo = (event: any) => {
		const checkBox = event.target;
		if (checkBox.checked) {
			this.readFile('assets/GaniVo_SG.csv', 'Ganivo');
		} else {
			//* make the marker become invisible
			ganivos.forEach((item) => item.setVisible(false));

			//* Deletes all markers in the array by removing references to them.
			ganivos.length = 0;
			checkBox.removeAttribute('checked');
		}
	};

	handleToggleTiles = (event: any) => {
		const checkBox = event.target;
		if (checkBox.checked) {
			this.readFile('assets/OngNgoi_SG.csv', 'OngNgoi');
		} else {
			TilePines.forEach((item) => item.setVisible(false));
			TilePines.length = 0;
			checkBox.removeAttribute('checked');
		}
	};

	handleChangePolylineColor = (event: any) => {
		const color = event.target.textContent;
		polylines1.forEach((item) => item.setOptions({ strokeColor: color }));

		// const contrastRatio = tinycolor.readability(color, 'blue');
		// console.log(contrastRatio);

		// if (contrastRatio <= 1) alert('error');
	};
}
