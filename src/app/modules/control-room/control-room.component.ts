import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
declare const google: any;

@Component({
    selector: 'app-control-room',
    templateUrl: './control-room.component.html',
    styleUrls: ['./control-room.component.scss']
})
export class ControlRoomComponent implements OnInit {

    @ViewChild('map') map: ElementRef;
    @ViewChild('infowindow') infoWindow: ElementRef;
    @ViewChild('centerControl') centerControl: ElementRef;

    constructor() { }

    ngOnInit() {
        this.initMap();
    }
    
    initMap() {
        // The location of IPSAA DAY CARE
        const ipsaa = { lat: 28.4221193, lng: 77.0634805 };
        // The map, centered at IPSAA DAY CARE,GURGAON
        const map = new google.maps.Map(this.map.nativeElement, { zoom: 18, center: ipsaa, mapTypeControl: false });
        // The marker, positioned at IPSAA DAY CARE,GURGAON

        map.addListener('click', this.addMarkerOnClick.bind(this, map));

        map.controls[google.maps.ControlPosition.BOTTOM_CENTER].push(this.centerControl.nativeElement);
    }

    addMarkerOnClick(map: any, e: any) {

        // console.log(map, e);
        const marker = new google.maps.Marker({ position: e.latLng, map: map, title: 'Click to configure', label: 'A', draggable: true, animation: google.maps.Animation.DROP });
        // shift map's center to newly created marker
        map.panTo(e.latLng);

        this.attachInfoWindowToMarker(map, marker);
        this.attachDragEventToMarker(marker);
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


}
