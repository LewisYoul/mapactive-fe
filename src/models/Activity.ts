import polyline from "@mapbox/polyline";
import * as turf from '@turf/turf'

export default class Activity {
  activity: any;
  map: any;
  color: any;
  constructor(activity: any, map: any) {
    this.activity = activity;
    this.map = map;
    this.color = this.getRandomColor()
  }

  boundingBox() {
    return turf.bbox(this.asGeoJSON() as any)
  }

  coordinates() {
    return polyline.decode(this.activity.map.summary_polyline)
  }

  icon() {
    return `${this.activity.type.toLowerCase()}.svg`
  }

  startDate() {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }
    let date = new Date(this.activity.start_date)

    return date.toLocaleDateString("en-GB", options as any)
  }

  flyTo() {
    this.map.fitBounds(this.boundingBox(), { padding: 80 })
  }

  hide() {
    this.map.setPaintProperty(`route-${this.activity.id}`, 'line-opacity', 0.2);
  }

  mouseover() {
    this.map.moveLayer(`route-${this.activity.id}`);
    this.map.setPaintProperty(`route-${this.activity.id}`, 'line-opacity', 1);
    this.map.setPaintProperty(`route-${this.activity.id}`, 'line-color', '#E34A01');
  }

  mouseleave() {
    this.map.setPaintProperty(`route-${this.activity.id}`, 'line-color', this.color);
    this.map.setPaintProperty(`route-${this.activity.id}`, 'line-opacity', 1);
  }

  name() {
    return this.activity.name
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
    return polyline.toGeoJSON(this.activity.map.summary_polyline)
  }

  googlePolyline() {
    return this.activity.map.summary_polyline
  }

  addToMap() {
    this.map.addSource(`route-${this.activity.id}`, {
      'type': 'geojson',
      'data': {
        'type': 'Feature',
        'properties': {},
        'geometry': this.asGeoJSON()
      }
    });

    this.map.addLayer(
      {
        'id': `route-${this.activity.id}`,
        'type': 'line',
        'source': `route-${this.activity.id}`,
        'layout': {
        'line-join': 'round',
        'line-cap': 'round'
      },
        'paint': {
        'line-color': this.color,
        'line-width': 3
      }
    });
  }

  removeFromMap() {
    this.map.removeLayer(`route-${this.activity.id}`)
    this.map.removeSource(`route-${this.activity.id}`)
  }

  getRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
  
    return color;
  }
}