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

enum MarkerStatus {
    New_Draggable,
    New_Fixed,
    Configured
}

@Component({
    selector: 'app-control-room',
    templateUrl: './control-room.component.html',
    styleUrls: ['./control-room.component.scss']
})
export class ControlRoomComponent implements OnInit {

    @ViewChild('map') mapRef: ElementRef;
    @ViewChild('centerControl') centerControl: ElementRef;
    @ViewChild('bottomRightControl') bottomRightControl: ElementRef;


    map: any; // google map
    newJunctionInfo: JunctionInfo; // contains the form input values of new junction being added
    newMarker: any; // marker to reflect new junction
    // newInfoWindow: any; // info window attached to new junction

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
            {
                zoom: 14, center: ipsaa, mapTypeControl: false, streetViewControl: false, styles: this.giveStyledMap(),
                zoomControlOptions: {
                    position: google.maps.ControlPosition.LEFT_BOTTOM
                },
            }
        );
        this.addControlsOnMap();
    }

    addControlsOnMap() {
        // add custom form controls on map
        this.map.controls[google.maps.ControlPosition.BOTTOM_CENTER].push(this.centerControl.nativeElement);
        this.map.controls[google.maps.ControlPosition.RIGHT_BOTTOM].push(this.bottomRightControl.nativeElement);
    }

    removeControlsFromMap() {
        // remove custom form controls on map
        this.map.controls[google.maps.ControlPosition.BOTTOM_CENTER].pop();
        this.map.controls[google.maps.ControlPosition.RIGHT_BOTTOM].pop();
    }

    onAddJunctionClick() {

    }

    dropPinOnMap(formValue: any) {
        // console.log(formValue);
        this.newJunctionInfo = formValue;
        this.closeAddJunctionModal();
        const mapCenter = this.map.getCenter();
        this.newMarker = this.addMarker(mapCenter, true);

        this.setMarkerStatus(this.newMarker, MarkerStatus.New_Draggable);
        this.setMarkerTooltip(this.newMarker);
        this.attachClickEventToMarker(this.newMarker);
        this.removeControlsFromMap();
        // setTimeout used in order to atach window after marker drop animation is complete
        setTimeout(() => {
            this.setMarkerInfoWindow(this.newMarker, {
                name: this.newJunctionInfo.name,
                lat: mapCenter.lat().toFixed(4),
                lng: mapCenter.lng().toFixed(4)
            });
            this.attachDragEventToMarker(this.newMarker);
        }, 500);

    }


    onAddJunctionFormSave(formValue: any) {
        // console.log(formValue);
        this.newJunctionInfo = formValue;
        this.closeAddJunctionModal();
        const pos = { lat: formValue.pos.lat, lng: formValue.pos.lng };
        this.newMarker = this.addMarker(pos);
        this.map.setCenter(pos);
        this.setMarkerStatus(this.newMarker, MarkerStatus.New_Fixed);
        this.setMarkerTooltip(this.newMarker);
        this.attachClickEventToMarker(this.newMarker);
        this.removeControlsFromMap();
        // setTimeout used in order to atach window after marker drop animation is complete
        setTimeout(() => {
            this.setMarkerInfoWindow(this.newMarker, {
                name: this.newJunctionInfo.name,
                lat: pos.lat,
                lng: pos.lng
            });
        }, 500);
    }

    setMarkerStatus(marker: any, status: number) {
        // add new property status to markera and initialize it with given status
        marker.status = status;
    }

    setMarkerInfoWindow(marker: any, info: any) {
        const content = this.getInfoWindowContent(marker, info);
        this.attachInfoWindowToMarker(marker, content);
    }

    setMarkerTooltip(marker: any) {
        switch (marker.status) {
            case MarkerStatus.New_Draggable:
                marker.setTitle('Click to fix position of marker');
                break;
            case MarkerStatus.New_Fixed:
                marker.setTitle('Click to configure');
                break;
            case MarkerStatus.Configured:
                marker.setTitle('Click to fix position of marker');
                break;
            default:
                marker.setTitle('');
        }
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

        // add new property infoWindow to marker which stores reference of the attached infoWindow
        marker.infoWindow = new google.maps.InfoWindow({
            content: content
        });

        marker.infoWindow.open(this.map, marker);
    }

    detachInfoWindowFromMarker(marker: any) {
        marker.infoWindow.close();
        marker.infoWindow = null;
    }

    getInfoWindowContent(marker: any, info: any) {


        const div = document.createElement('div');
        div.id = 'newJuncInfoWindow';
        const p1 = document.createElement('p');
        p1.innerHTML = `<b>Name: </b>${info.name}`;
        div.appendChild(p1);

        const p2 = document.createElement('p');
        p2.innerHTML = `<b>Lat: </b>${info.lat}<b>Long: </b>${info.lng}`;
        div.appendChild(p2);

        if (marker.status === MarkerStatus.New_Draggable) {

            const msg = document.createElement('small');
            msg.innerText = 'Move the marker to required position.';
            const btn = document.createElement('button');
            btn.innerText = 'Fix Here';
            btn.addEventListener('click', this.onFixhereBtn.bind(this, marker));

            div.appendChild(msg);
            div.appendChild(btn);
        } else if (marker.status === MarkerStatus.New_Fixed) {
            const btn = document.createElement('button');
            btn.innerText = 'Configure';
            btn.addEventListener('click', this.onConfigureBtn.bind(this));
            div.appendChild(btn);
        }
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

    onFixhereBtn(marker: any) {

        this.fixMarkerPosition(marker);
        marker.status = MarkerStatus.New_Fixed;
        this.setMarkerTooltip(marker);
        this.detachInfoWindowFromMarker(marker);
        const pos = marker.getPosition();
        const content = this.getInfoWindowContent(marker, {
            name: this.newJunctionInfo.name,
            lat: pos.lat().toFixed(4),
            lng: pos.lng().toFixed(4)
        });
        this.attachInfoWindowToMarker(marker, content);
    }

    fixMarkerPosition(marker: any) {
        marker.set('draggable', false);
    }

    onConfigureBtn() {
        console.log('aaaaaa');
        this.addControlsOnMap();


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

    attachClickEventToMarker(marker: any) {
        marker.addListener('click', (e) => {

            // add only in case there is not any already opened window with this marker
            if (!marker.infoWindow.getMap()) { // returns null when there is no opened window
                const pos = marker.getPosition();
                this.setMarkerInfoWindow(marker, {
                    name: this.newJunctionInfo.name,
                    lat: pos.lat().toFixed(4),
                    lng: pos.lng().toFixed(4)
                });
            }
        });
    }

    updateInfoWindowContent(info: any) {

        const div = document.getElementById('newJuncInfoWindow');
        if (!div) { return; }
        const children = div.childNodes;
        (<HTMLElement>children.item(1)).innerHTML = `<b>Lat: </b> ${info.lat}<b>Long: </b>${info.lng}`;
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
