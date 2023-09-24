import { Component, ElementRef, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
import { LngLat, Map } from 'mapbox-gl';

@Component({
  templateUrl: './zoom-range-page.component.html',
  styleUrls: ['./zoom-range-page.component.css']
})
export class ZoomRangePageComponent implements AfterViewInit, OnDestroy {

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
      zoom: this.zoom, // starting zoom
    });

    this.mapListeners();
  }

  ngOnDestroy(): void {
    this.map?.remove();
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

    this.map.on('move', () => {
      this.currentLngLat = this.map!.getCenter();
      const { lng, lat } = this.currentLngLat;
    })
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
