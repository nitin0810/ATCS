import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
declare const google: any;
declare const $: any;

interface JunctionInfo {
    noOfJunctions: number;
    name: string;
    pos: {
        lat: number;
        lng: number;
    };
}

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
    newJunctionInfo: JunctionInfo; // contains the form input values of new junction being added
    newMarker: any;

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

    // ADDJUNCITON MODAL RELATED METHODS

    dropPinOnMap(formValue: any) {
        // console.log(formValue);
        this.newJunctionInfo = formValue;
        this.closeAddJunctionModal();
        const mapCenter = this.map.getCenter();
        this.newMarker = this.addMarker(mapCenter, true);
        const content = this.getInfoWindowContent({
            name: this.newJunctionInfo.name,
            lat: mapCenter.lat().toFixed(4),
            lng: mapCenter.lng().toFixed(4)
        });

        setTimeout(() => {
            // used in order to atach window after marker drop animation is complete
            this.attachInfoWindowToMarker(this.newMarker, content);
            this.attachDragEventToMarker(this.newMarker);
        }, 500);

    }

    onAddJunctionFormSave(formValue: any) {
        // console.log(formValue);
        this.newJunctionInfo = formValue;
        this.closeAddJunctionModal();
        const pos = { lat: formValue.pos.lat, lng: formValue.pos.lng };
        this.newMarker = this.addMarker(pos);

    }

    closeAddJunctionModal() { $('#addJunctionModal').modal('hide'); }

    addMarker(pos: any, draggable = false) {

        this.map.panTo(pos);
        return new google.maps.Marker({
            position: pos,
            map: this.map,
            // title: 'Click to configure',
            label: 'A',
            draggable: draggable,
            animation: google.maps.Animation.DROP,
        });

    }

    attachInfoWindowToMarker(marker: any, content: any) {
        console.log(content);

        const infowindow = new google.maps.InfoWindow({
            content: content
        });

        infowindow.open(this.map, marker);
        // marker.addListener('click', () => {
        // });

    }

    getInfoWindowContent(info?: any) {


        const div = document.createElement('div');
        div.id = 'newJuncInfoWindow';
        const p1 = document.createElement('p');
        p1.innerHTML = `<b>Name: </b>${info.name}`;
        const p2 = document.createElement('p');
        p2.innerHTML = `<b>Lat: </b>${info.lat}<b>Long: </b>${info.lng}`;
        const msg = document.createElement('small');
        msg.innerText = 'Move the marker to required position.';
        const btn = document.createElement('button');
        btn.innerText = 'Fix Here';
        btn.addEventListener('click', this.fixMarkerPosition.bind(this));

        div.appendChild(p1);
        div.appendChild(p2);
        div.appendChild(msg);
        div.appendChild(btn);
        return div;
        // return `
        //     <div>
        //         <p><b>Name: </b>${info.name}</p>
        //          <p><b>Lat: </b>${info.lat}
        //         <b>Long: </b>${info.lng}</p>
        //         <small>Move the marker to required position .</small>
        //         <button onclick="(${t})()">Fix Here</button>
        //     < /div>
        //         `;
    }

    fixMarkerPosition() {
        this.newMarker.set('draggable', false);
    }

    attachDragEventToMarker(marker: any) {
        marker.addListener('drag', (e) => {
            // UNCOMMENT FOLLOWING TO UPDATE LATLNG ON DRAG EVENT
            // NOT USED AS OF NOW FOR PERFORMANCE REASON

            // this.updateInfoWindowContent({
            //     name: this.newJunctionInfo.name,
            //     lat: e.latLng.lat().toFixed(4),
            //     lng: e.latLng.lng().toFixed(4)
            // }
            // );
        });
        marker.addListener('dragend', (e) => {
            this.updateInfoWindowContent({
                name: this.newJunctionInfo.name,
                lat: e.latLng.lat().toFixed(4),
                lng: e.latLng.lng().toFixed(4)
            }
            );
        });
    }

    updateInfoWindowContent(info: any) {
        const div = document.getElementById('newJuncInfoWindow');
        const children = div.childNodes;
        (<HTMLElement>children.item(1)).innerHTML = `<b>Lat: </b> ${info.lat}<b>Long: </b>${info.lng}`;
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
