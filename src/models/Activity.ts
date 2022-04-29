import polyline from "@mapbox/polyline";
import bbox from '@turf/bbox'
import mapboxgl from "mapbox-gl";
import axios from 'axios'
import L from "leaflet";

export default class Activity {
  activity: any;
  color: any;
  map: any;
  layer: any;
  constructor(activity: any, map: any) {
    this.activity = activity;
    this.map = map;
    this.color = this.getRandomColor()
    this.layer = L.geoJSON(this.asGeoJSON())
  }

  boundingBox() {
    return bbox(this.asGeoJSON() as any)
  }

  coordinates() {
    return polyline.decode(this.activity.map.summary_polyline)
  }

  icon() {
    return `${this.activity.type.toLowerCase()}.svg`
  }

  startDateShort() {
    const options = { year: 'numeric', month: '2-digit', day: 'numeric' }
    let date = new Date(this.activity.start_date)

    return date.toLocaleDateString("en-GB", options as any)
  }

  startDateLong() {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }
    let date = new Date(this.activity.start_date)

    return date.toLocaleDateString("en-GB", options as any)
  }

  totalElevationGain() {
    return this.activity.total_elevation_gain
  }

  // colorForDisplay () {
  //   switch(this.activity.type) {
  //     case 'Ride':
  //       return 'orange'
  //     default:
  //       return 'purple'
  //   }
  // }

  flyTo() {
    this.map.flyToBounds(this.layer.getBounds());
    this.bringToForeground()
    // this.map.fitBounds(this.boundingBox(), { padding: 80 })
  }

  // hide() {
  //   this.map.setPaintProperty(`route-${this.activity.id}`, 'line-opacity', 0.2);
  // }

  // mouseover() {
  //   if (this.map.getLayer(`route-${this.activity.id}`)) {
  //     this.map.moveLayer(`route-${this.activity.id}`);
  //     this.map.setPaintProperty(`route-${this.activity.id}`, 'line-opacity', 1);
  //     this.map.setPaintProperty(`route-${this.activity.id}`, 'line-color', '#E34A01');
  //   }
  // }

  // mouseleave() {
  //   if (this.map.getLayer(`route-${this.activity.id}`)) {
  //     this.map.setPaintProperty(`route-${this.activity.id}`, 'line-color', this.color);
  //     this.map.setPaintProperty(`route-${this.activity.id}`, 'line-opacity', 1);
  //   }
  // }

  name() {
    return this.activity.name
  }

  distance() {
    return (this.activity.distance / 1000).toFixed(1)
  }

  type() {
    switch(this.activity.type) {
      case 'StandUpPaddling':
        return 'SUP'
      default:
        return this.activity.type
    }

  }

  asGeoJSON() {
    console.log('this act', this.activity)
    return polyline.toGeoJSON(this.activity.map.summary_polyline)
  }

  googlePolyline() {
    return this.activity.map.summary_polyline
  }

  addToMap() {
    this.layer.addTo(this.map)
    this.sendToBackground()
  }

  removeFromMap() {
    this.map.removeLayer(this.layer)
  }

  sendToBackground() {
    this.layer.setStyle({
      weight: 3,
      color: '#6B20A8',
      opacity: 0.5
    })
  }

  bringToForeground() {
    this.layer.bringToFront()
    this.layer.setStyle({
      weight: 3,
      color: '#FC4C01',
      opacity: 1.0
    })
  }

  popupHTML() {
    return (
      `
      <div class="w-full">
        <div class="flex justify-between">
          <span class="block text-base">${this.name()}</span>
          <div class="ml-4">
            <span class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-purple-100 text-purple-800">${this.type()}</span>
          </div>
        </div>
        <div class="flex justify-between">
          <span class="block text-xs text-gray-500">${this.startDate()}</span>
          <span class="block text-xs">${this.distance()}km</span>
        </div>
      </div>
      `
    )
  }

  // removeFromMap() {
  //   const id = `route-${this.activity.id}`

  //   if (this.map.getLayer(id)) { this.map.removeLayer(id) }
  //   if (this.map.getSource(id)) { this.map.removeSource(id) }
  // }

  getRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
  
    return color;
  }
}