import { Component, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { Map } from 'mapbox-gl';

@Component({
  templateUrl: './zoom-range-page.component.html',
  styleUrls: ['./zoom-range-page.component.css']
})
export class ZoomRangePageComponent implements AfterViewInit {

  @ViewChild('map')
  public divMap?: ElementRef;

  public zoom: number = 10;
  public map?: Map;

  ngAfterViewInit(): void {
    if (!this.divMap)
      throw "El elemento html no fue encontrado";

    this.map = new Map({
      container: this.divMap.nativeElement, // container ID
      style: 'mapbox://styles/mapbox/streets-v12', // style URL
      center: [-74.5, 40], // starting position [lng, lat]
      zoom: this.zoom, // starting zoom
      });

    this.mapListeners();
  }

  public mapListeners() {
    if (!this.map)
      throw "Mapa no inicializado";

    this.map.on('zoom', (ev) => {
      this.zoom = this.map!.getZoom();
    });

    this.map.on('zoomend', (ev) => {
      if (this.map!.getZoom() < 18)
        return;

      this.map!.zoomTo(18);
    });
  }

  public zoomIn() {
    this.map?.zoomIn();
  }

  public zoomOut() {
    this.map?.zoomOut();
  }

  public zoomChanged( value: string ) {
    this.zoom = Number(value);
    this.map?.zoomTo( this.zoom );
  }
}
