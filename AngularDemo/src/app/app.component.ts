import { environment } from 'src/environments/environment.development';
import { Component, OnInit } from '@angular/core';
import { Loader } from '@googlemaps/js-api-loader';
import { HttpClient } from '@angular/common/http';
import { MarkerClusterer } from '@googlemaps/markerclusterer';
// import tinycolor from 'tinycolor2';

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
		// this.readFile('assets/Doan_Ong_Ngam.csv', 'DoanOngNgam');
		// this.readFile('assets/Doan_Ong_Ngam.csv', 'DoanOngNgamMang');
		this.demo();

		const sideBarItems = document.querySelectorAll('.sidebar-item');
		const sideBarForm = document.querySelector('.sidebar-form-container');
		const buttons = document.querySelectorAll('.button-5');
		const sideBarFormContentItemContainer = document.querySelector(
			'.sidebar-form-content-item-container'
		);

		sideBarItems.forEach((item) => {
			let isOpen = false;

			item.addEventListener('click', () => {
				if (sideBarForm) {
					if (!isOpen) {
						(sideBarForm as HTMLElement).style.display = 'flex';
						isOpen = true;
					} else {
						(sideBarForm as HTMLElement).style.display = 'none';
						isOpen = false;
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
				if (imageContainer) {
					//TODO: append more text content (Ganivo, Tiles Piniline)
					if (text.trim() === 'Tanks') {
						//TODO: replace the icon with our own
						imageContainer.innerHTML = `
						<img width="50" height="50" src="https://img.icons8.com/ios/50/internet--v1.png" alt="internet--v1"/>
`;
					}
				}
			});
		});
	}

	private initInforWindow = (instance: any, content?: string) => {
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

	private iniRightSideBar = (name: string) => {
		const markerName = document.querySelector('.marker-name');
		const rightSidebar = document.querySelector('.right-sidebar-container');
		if (markerName) {
			markerName.innerHTML = name;
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

	async readFile(fileURL: any = 'assets/Demo.csv', type: any = null) {
		const data = await this.http
			.get(fileURL, { responseType: 'text' })
			.toPromise();
		const result = data?.split('\n');

		if (type === 'Ganivo' || type === 'HamBe' || type === 'OngNgoi') {
			const markers = result?.map((item: any, index: number) => {
				const lat = item.split(',')[2].replaceAll('"', ' ');
				const lng = item.split(',')[3].replaceAll('"', ' ');
				const name = item.split(',')[0].replaceAll('"', ' ');

				const marker = new google.maps.Marker({
					position: {
						lat: Number(lat),
						lng: Number(lng),
					},
					map,
					title: `Item index ${index}`,
				});

				if (type === 'Ganivo') {
					marker.setIcon('/assets/images/ganivo1.png');
					ganivos.push(marker);
				}

				if (type === 'HamBe') {
					marker.setIcon('/assets/images/tank1.png');
					tanks.push(marker);
				}

				if (type === 'OngNgoi') {
					marker.setIcon('/assets/images/tiles.png');
					TilePines.push(marker);
				}

				marker.addListener('click', () => {
					this.initInforWindow(marker, `<strong>${name}</strong>`);
				});

				marker.addListener('rightclick', () => {
					this.initInforWindow(marker);
				});

				return marker;
			});

			new MarkerClusterer({ markers, map });
		}

		if (type === 'DoanOngNgam') {
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
					strokeWeight: 6,
				});

				polyline.addListener('mouseover', () => {
					map.getDiv().setAttribute('title', `${name}`);
				});

				polylines1.push(polyline);
				polyline.setMap(map);
			});
		}

		if (type === 'DoanOngNgamMang') {
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
	private handleWaterCheckBox = (event: any) => {
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
				center: { lat: 15.9031, lng: 105.8067 },
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

		const demo = this.iniRightSideBar;

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

				marker.addListener('click', () => {
					demo('MINHCT');
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
		}

		if (type === 2) {
			ganivos.forEach((item) => {
				item.setIcon('/assets/images/ganivo2.png');
			});
		}
	};

	handleChangeTilePineIcon = (type: number = 1) => {
		if (type === 1) {
			TilePines.forEach((item) => {
				item.setIcon('/assets/images/tiles.png');
			});
		}
	};

	handleChangeTankIcon = (type: number = 1) => {
		if (type === 1) {
			tanks.forEach((item) => {
				item.setIcon('/assets/images/tank1.png');
			});
		}

		if (type === 2) {
			tanks.forEach((item) => {
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
		// if (checkBox.checked) {
		// 	this.readFile('assets/OngNgoi_SG.csv', 'OngNgoi');
		// } else {
		//* make the marker become invisible
		// 	TilePines.forEach((item) => item.setVisible(false));

		//* Deletes all markers in the array by removing references to them.
		// 	TilePines.length = 0;
		// 	checkBox.removeAttribute('checked');
		// }

		//! Demo only here
		// if (!checkBox.checked) {
		// 	polylines1.forEach((item) =>
		// 		item.setOptions({ strokeColor: 'blue' })
		// 	);
		// 	light1 = true;
		// } else {
		// 	polylines1.forEach((item) =>
		// 		item.setOptions({ strokeColor: 'red' })
		// 	);
		// 	checkBox.removeAttribute('checked');
		// 	light1 = false;
		// }

		// if (light1 === light2) {
		// 	alert('error');
		// }
	};

	handleChangePolylineColor = (event: any) => {
		const color = event.target.textContent;
		polylines1.forEach((item) => item.setOptions({ strokeColor: color }));

		// const contrastRatio = tinycolor.readability(color, 'blue');
		// console.log(contrastRatio);

		// if (contrastRatio <= 1) alert('error');
	};
}
