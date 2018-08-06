import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
declare const google: any;
declare const $: any;

@Component({
    selector: 'app-control-room',
    templateUrl: './control-room.component.html',
    styleUrls: ['./control-room.component.scss']
})
export class ControlRoomComponent implements OnInit {

    @ViewChild('map') mapRef: ElementRef;
    @ViewChild('infowindow') infoWindow: ElementRef;
    @ViewChild('centerControl') centerControl: ElementRef;
    @ViewChild('bottomRightControl') bottomRightControl: ElementRef;
    map: any; // google map

    constructor() { }

    ngOnInit() {
        this.initMap();
    }

    initMap() {
        // The location of IPSAA DAY CARE
        const ipsaa = { lat: 28.4221193, lng: 77.0634805 };

        // create map centered at IPSAA DAY CARE,GURGAON
        this.map = new google.maps.Map(
            this.mapRef.nativeElement,
            { zoom: 14, center: ipsaa, mapTypeControl: false, styles: this.giveStyledMap() }
        );

        // add custom form controls on map
        this.map.controls[google.maps.ControlPosition.BOTTOM_CENTER].push(this.centerControl.nativeElement);
        this.map.controls[google.maps.ControlPosition.RIGHT_BOTTOM].push(this.bottomRightControl.nativeElement);


        // map.addListener('click', this.addMarkerOnClick.bind(this, map));

    }

    onAddJunctionClick() {

    }

    onAddJunctionFormSave(formValue: any) {
        console.log(formValue);
        const pos = { lat: Number(formValue.latitude), lng: Number(formValue.longitude) };

        $('#addJunctionModal').modal('hide');
        this.addMarkerOnAddedJunction(pos);

    }

    addMarkerOnAddedJunction(pos: any) {

        this.map.panTo(pos);
        const marker = new google.maps.Marker({
            position: pos,
            map: this.map,
            // title: 'Click to configure',
            label: 'A',
            draggable: true,
            animation: google.maps.Animation.DROP,

        });
        // shift map's center to newly created marker

        // // console.log(map, e);
        // const marker = new google.maps.Marker({
        //     position: e.latLng,
        //     map: map,
        //     title: 'Click to configure',
        //     label: 'A',
        //     draggable: true,
        //     animation: google.maps.Animation.DROP,

        // });
        // // shift map's center to newly created marker
        // map.panTo(e.latLng);

        // this.attachInfoWindowToMarker(map, marker);
        // this.attachDragEventToMarker(marker);
    }

    attachInfoWindowToMarker(map: any, marker: any) {
        const content =
            `
          <div >
            <button>Configure</button>
          </div>
          `;

        const infowindow = new google.maps.InfoWindow({
            content: content
        });

        marker.addListener('click', () => {
            infowindow.open(map, marker);
        });

    }

    attachDragEventToMarker(marker: any) {
        marker.addListener('drag', () => {
            console.log('drag ');

        });
        marker.addListener('dragend', (e) => {
            console.log('drag end', e);
            marker.set('draggable', false);
        });
    }



    onBtnControlClick() {
        console.log('aaaaaaa');
    }

    giveStyledMap() {
        // night mode map
        return [
            { elementType: 'geometry', stylers: [{ color: '#242f3e' }] },
            { elementType: 'labels.text.stroke', stylers: [{ color: '#242f3e' }] },
            { elementType: 'labels.text.fill', stylers: [{ color: '#746855' }] },
            {
                featureType: 'administrative.locality',
                elementType: 'labels.text.fill',
                stylers: [{ color: '#d59563' }]
            },
            {
                featureType: 'poi',
                elementType: 'labels.text.fill',
                stylers: [{ color: '#d59563' }]
            },
            {
                featureType: 'poi.park',
                elementType: 'geometry',
                stylers: [{ color: '#263c3f' }]
            },
            {
                featureType: 'poi.park',
                elementType: 'labels.text.fill',
                stylers: [{ color: '#6b9a76' }]
            },
            {
                featureType: 'road',
                elementType: 'geometry',
                stylers: [{ color: '#38414e' }]
            },
            {
                featureType: 'road',
                elementType: 'geometry.stroke',
                stylers: [{ color: '#212a37' }]
            },
            {
                featureType: 'road',
                elementType: 'labels.text.fill',
                stylers: [{ color: '#9ca5b3' }]
            },
            {
                featureType: 'road.highway',
                elementType: 'geometry',
                stylers: [{ color: '#746855' }]
            },
            {
                featureType: 'road.highway',
                elementType: 'geometry.stroke',
                stylers: [{ color: '#1f2835' }]
            },
            {
                featureType: 'road.highway',
                elementType: 'labels.text.fill',
                stylers: [{ color: '#f3d19c' }]
            },
            {
                featureType: 'transit',
                elementType: 'geometry',
                stylers: [{ color: '#2f3948' }]
            },
            {
                featureType: 'transit.station',
                elementType: 'labels.text.fill',
                stylers: [{ color: '#d59563' }]
            },
            {
                featureType: 'water',
                elementType: 'geometry',
                stylers: [{ color: '#17263c' }]
            },
            {
                featureType: 'water',
                elementType: 'labels.text.fill',
                stylers: [{ color: '#515c6d' }]
            },
            {
                featureType: 'water',
                elementType: 'labels.text.stroke',
                stylers: [{ color: '#17263c' }]
            }
        ];
    }


}
