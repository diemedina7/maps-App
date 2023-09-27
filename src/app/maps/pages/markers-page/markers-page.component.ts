import { Component, ElementRef, ViewChild } from '@angular/core';
import { LngLat, Map, Marker } from 'mapbox-gl';

interface MarkerAndColor {
  color:  string,
  marker: Marker
}

interface PlainMarker {
  color:  string,
  lngLat: number[]
}

@Component({
  templateUrl: './markers-page.component.html',
  styleUrls: ['./markers-page.component.css']
})
export class MarkersPageComponent {

  @ViewChild('map')
  public divMap?: ElementRef;

  public markers: MarkerAndColor[] = [];
  public zoom: number = 10;
  public map?: Map;
  public currentLngLat: LngLat = new LngLat(-64.11026450502766, -31.354763290465172);

  ngAfterViewInit(): void {
    if (!this.divMap)
      throw "El elemento html no fue encontrado";

    this.map = new Map({
      container: this.divMap.nativeElement, // container ID
      style: 'mapbox://styles/mapbox/streets-v12', // style URL
      center: this.currentLngLat, // starting position [lng, lat]
      zoom: 13, // starting zoom
    });

    this.readFromLocalStorage();

    /* FORMA DE CREAR UN MARKER EN MAPBOXS */
    //const markerHtml = document.createElement('div');
    //markerHtml.innerHTML = 'Diego';

    //const marker = new Marker({
    //  //color: 'red'
    //  element: markerHtml
    //})
    //.setLngLat( this.currentLngLat ).addTo( this.map );
  }

  public createMarker() {
    if (!this.map)
      return;

    const color = '#xxxxxx'.replace(/x/g, y=>(Math.random()*16|0).toString(16));
    const lngLat = this.map!.getCenter();
    this.addMarker( lngLat, color );
  }

  public addMarker( lngLat: LngLat, color: string ) {
    if (!this.map)
      return;

    const marker = new Marker({
      color: color,
      draggable: true
    })
    .setLngLat( lngLat ).addTo( this.map );

    this.markers.push({
      color: color,
      marker: marker
    });

    marker.on('dragend', () => {
      this.saveToLocalStorage();
    })
  }

  public deleteMarker( index: number ) {
    this.markers[index].marker.remove();
    this.markers.splice(index, 1);
    this.saveToLocalStorage();
  }

  public flyTo( marker: Marker ) {
    this.map?.flyTo({
      zoom: 14,
      center: marker.getLngLat()
    })
  }

  public saveToLocalStorage() {
    const plainMarkers: PlainMarker[] = this.markers.map( ({ color, marker }) => {
      return {
        color: color,
        lngLat: marker.getLngLat().toArray()
      }
    });

    localStorage.setItem('plainMarkers', JSON.stringify( plainMarkers ));
  }

  public readFromLocalStorage() {
    const plainMarkersString = localStorage.getItem('plainMarkers') ?? '[]';
    const plainMarkers: PlainMarker[] = JSON.parse( plainMarkersString );//! parse return ANY !!

    plainMarkers.forEach( ({ color, lngLat}) => {
      const [lng, lat] = lngLat;
      const coords = new LngLat(lng, lat);

      this.addMarker(coords, color);
    });
  }
}
