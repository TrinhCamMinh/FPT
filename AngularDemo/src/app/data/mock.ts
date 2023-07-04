//! use for Drawing function
export const data = [
	{
		cableTypeP: 115492,
		name: "HCMP001.0258/CO",
		headTypeP: 3158762,
		headpoint: "HCMP001.151/MO",
		headlatlng: "(10.780988022597578,106.69645875692368)",
		headtype: "4",
		headspliter: 1,
		color: "#9009E6",
		method: "Treo",
		porttotall: null,
		portused: null,
		portfree: null,
		code: "HCMP001.0258/CO",
		headporttotal: null,
		headportused: null,
		headportfree: null,
		tailType: 1156422,
		tailpoint: "HCMP001.097/HB",
		taillatlng: "10.780958979181227,106.69657684270419",
		tailtype: "3",
		tailporttotal: 16,
		tailportused: 5,
		tailportfree: 11,
		cablelatlng:
			"(10.780988022597578,106.69645875692368);(10.780914216393507,106.6965352341754);(10.780958979181227,106.69657684270419)",
		headspliter1: 1,
		tailspliter: 1,
		cabtype: 2,
		layer: "hatang",
	},
	{
		cableTypeP: 270282,
		name: "HCMP001.0261/CU",
		headTypeP: 222392,
		headpoint: "HCMP001.104/HB",
		headlatlng: "(10.779904431861624,106.69577814638615)",
		headtype: "3",
		headspliter: 1,
		color: "#9009E6",
		method: "Ngầm",
		porttotall: 16,
		portused: 16,
		portfree: 0,
		code: "HCMP001.0261/CU",
		headporttotal: 16,
		headportused: 16,
		headportfree: 0,
		tailType: 222412,
		tailpoint: "HCMP001.103/HB",
		taillatlng: "10.779867543597708,106.69581301510334",
		tailtype: "3",
		tailporttotal: 8,
		tailportused: 8,
		tailportfree: 0,
		cablelatlng:
			"(10.779904431861624,106.69577814638615);10.779867543597708,106.69581301510334",
		headspliter1: 1,
		tailspliter: 1,
		cabtype: 2,
		layer: "hatang",
	},
];

//! use for styling map
export const styles: Record<string, google.maps.MapTypeStyle[]> = {
	default: [],
	silver: [
		{
			elementType: 'geometry',
			stylers: [{ color: '#f5f5f5' }],
		},
		{
			elementType: 'labels.icon',
			stylers: [{ visibility: 'off' }],
		},
		{
			elementType: 'labels.text.fill',
			stylers: [{ color: '#616161' }],
		},
		{
			elementType: 'labels.text.stroke',
			stylers: [{ color: '#f5f5f5' }],
		},
		{
			featureType: 'administrative.land_parcel',
			elementType: 'labels.text.fill',
			stylers: [{ color: '#bdbdbd' }],
		},
		{
			featureType: 'poi',
			elementType: 'geometry',
			stylers: [{ color: '#eeeeee' }],
		},
		{
			featureType: 'poi',
			elementType: 'labels.text.fill',
			stylers: [{ color: '#757575' }],
		},
		{
			featureType: 'poi.park',
			elementType: 'geometry',
			stylers: [{ color: '#e5e5e5' }],
		},
		{
			featureType: 'poi.park',
			elementType: 'labels.text.fill',
			stylers: [{ color: '#9e9e9e' }],
		},
		{
			featureType: 'road',
			elementType: 'geometry',
			stylers: [{ color: '#ffffff' }],
		},
		{
			featureType: 'road.arterial',
			elementType: 'labels.text.fill',
			stylers: [{ color: '#757575' }],
		},
		{
			featureType: 'road.highway',
			elementType: 'geometry',
			stylers: [{ color: '#dadada' }],
		},
		{
			featureType: 'road.highway',
			elementType: 'labels.text.fill',
			stylers: [{ color: '#616161' }],
		},
		{
			featureType: 'road.local',
			elementType: 'labels.text.fill',
			stylers: [{ color: '#9e9e9e' }],
		},
		{
			featureType: 'transit.line',
			elementType: 'geometry',
			stylers: [{ color: '#e5e5e5' }],
		},
		{
			featureType: 'transit.station',
			elementType: 'geometry',
			stylers: [{ color: '#eeeeee' }],
		},
		{
			featureType: 'water',
			elementType: 'geometry',
			stylers: [{ color: '#c9c9c9' }],
		},
		{
			featureType: 'water',
			elementType: 'labels.text.fill',
			stylers: [{ color: '#9e9e9e' }],
		},
	],

	night: [
		{
			elementType: 'geometry',
			stylers: [{ color: '#242f3e' }],
		},
		{
			elementType: 'labels.text.stroke',
			stylers: [{ color: '#242f3e' }],
		},
		{
			elementType: 'labels.text.fill',
			stylers: [{ color: '#746855' }],
		},
		{
			featureType: 'administrative.locality',
			elementType: 'labels.text.fill',
			stylers: [{ color: '#d59563' }],
		},
		{
			featureType: 'poi',
			elementType: 'labels.text.fill',
			stylers: [{ color: '#d59563' }],
		},
		{
			featureType: 'poi.park',
			elementType: 'geometry',
			stylers: [{ color: '#263c3f' }],
		},
		{
			featureType: 'poi.park',
			elementType: 'labels.text.fill',
			stylers: [{ color: '#6b9a76' }],
		},
		{
			featureType: 'road',
			elementType: 'geometry',
			stylers: [{ color: '#38414e' }],
		},
		{
			featureType: 'road',
			elementType: 'geometry.stroke',
			stylers: [{ color: '#212a37' }],
		},
		{
			featureType: 'road',
			elementType: 'labels.text.fill',
			stylers: [{ color: '#9ca5b3' }],
		},
		{
			featureType: 'road.highway',
			elementType: 'geometry',
			stylers: [{ color: '#746855' }],
		},
		{
			featureType: 'road.highway',
			elementType: 'geometry.stroke',
			stylers: [{ color: '#1f2835' }],
		},
		{
			featureType: 'road.highway',
			elementType: 'labels.text.fill',
			stylers: [{ color: '#f3d19c' }],
		},
		{
			featureType: 'transit',
			elementType: 'geometry',
			stylers: [{ color: '#2f3948' }],
		},
		{
			featureType: 'transit.station',
			elementType: 'labels.text.fill',
			stylers: [{ color: '#d59563' }],
		},
		{
			featureType: 'water',
			elementType: 'geometry',
			stylers: [{ color: '#17263c' }],
		},
		{
			featureType: 'water',
			elementType: 'labels.text.fill',
			stylers: [{ color: '#515c6d' }],
		},
		{
			featureType: 'water',
			elementType: 'labels.text.stroke',
			stylers: [{ color: '#17263c' }],
		},
	],

	retro: [
		{
			elementType: 'geometry',
			stylers: [{ color: '#ebe3cd' }],
		},
		{
			elementType: 'labels.text.fill',
			stylers: [{ color: '#523735' }],
		},
		{
			elementType: 'labels.text.stroke',
			stylers: [{ color: '#f5f1e6' }],
		},
		{
			featureType: 'administrative',
			elementType: 'geometry.stroke',
			stylers: [{ color: '#c9b2a6' }],
		},
		{
			featureType: 'administrative.land_parcel',
			elementType: 'geometry.stroke',
			stylers: [{ color: '#dcd2be' }],
		},
		{
			featureType: 'administrative.land_parcel',
			elementType: 'labels.text.fill',
			stylers: [{ color: '#ae9e90' }],
		},
		{
			featureType: 'landscape.natural',
			elementType: 'geometry',
			stylers: [{ color: '#dfd2ae' }],
		},
		{
			featureType: 'poi',
			elementType: 'geometry',
			stylers: [{ color: '#dfd2ae' }],
		},
		{
			featureType: 'poi',
			elementType: 'labels.text.fill',
			stylers: [{ color: '#93817c' }],
		},
		{
			featureType: 'poi.park',
			elementType: 'geometry.fill',
			stylers: [{ color: '#a5b076' }],
		},
		{
			featureType: 'poi.park',
			elementType: 'labels.text.fill',
			stylers: [{ color: '#447530' }],
		},
		{
			featureType: 'road',
			elementType: 'geometry',
			stylers: [{ color: '#f5f1e6' }],
		},
		{
			featureType: 'road.arterial',
			elementType: 'geometry',
			stylers: [{ color: '#fdfcf8' }],
		},
		{
			featureType: 'road.highway',
			elementType: 'geometry',
			stylers: [{ color: '#f8c967' }],
		},
		{
			featureType: 'road.highway',
			elementType: 'geometry.stroke',
			stylers: [{ color: '#e9bc62' }],
		},
		{
			featureType: 'road.highway.controlled_access',
			elementType: 'geometry',
			stylers: [{ color: '#e98d58' }],
		},
		{
			featureType: 'road.highway.controlled_access',
			elementType: 'geometry.stroke',
			stylers: [{ color: '#db8555' }],
		},
		{
			featureType: 'road.local',
			elementType: 'labels.text.fill',
			stylers: [{ color: '#806b63' }],
		},
		{
			featureType: 'transit.line',
			elementType: 'geometry',
			stylers: [{ color: '#dfd2ae' }],
		},
		{
			featureType: 'transit.line',
			elementType: 'labels.text.fill',
			stylers: [{ color: '#8f7d77' }],
		},
		{
			featureType: 'transit.line',
			elementType: 'labels.text.stroke',
			stylers: [{ color: '#ebe3cd' }],
		},
		{
			featureType: 'transit.station',
			elementType: 'geometry',
			stylers: [{ color: '#dfd2ae' }],
		},
		{
			featureType: 'water',
			elementType: 'geometry.fill',
			stylers: [{ color: '#b9d3c2' }],
		},
		{
			featureType: 'water',
			elementType: 'labels.text.fill',
			stylers: [{ color: '#92998d' }],
		},
	],

	hiding: [
		{
			featureType: 'poi.business',
			stylers: [{ visibility: 'off' }],
		},
		{
			featureType: 'transit',
			elementType: 'labels.icon',
			stylers: [{ visibility: 'off' }],
		},
	],
};