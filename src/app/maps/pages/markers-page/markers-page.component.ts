import { Component, ElementRef, ViewChild } from '@angular/core';
import { LngLat, Map, Marker } from 'mapbox-gl';

@Component({
  templateUrl: './markers-page.component.html',
  styleUrls: ['./markers-page.component.css']
})
export class MarkersPageComponent {

  @ViewChild('map')
  public divMap?: ElementRef;

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
  }
}
