import { useEffect, useState } from 'react';
import ActivityItem from './ActivityItem';
import Activity from '../models/Activity';
import * as turf from '@turf/turf'

type ActivityProps = {
  activities: Activity[];
}

export default function ActivityList(props: ActivityProps) {
  const { activities } = props;
  const [focussedActivity, setFocussedActivity] = useState<Activity>();
  const [hoveredActivity, setHoveredActivity] = useState<Activity>();

  useEffect(() => {
    activities.forEach(activity => activity.addToMap())

    let featureCollection = {
      "type": 'FeatureCollection',
      "features": activities.map(activity => {
        return {
          type: "Feature",
          geometry: activity.asGeoJSON()
        }
      })
    }

    const bbox = turf.bbox(featureCollection as any)
    // Should probably pass the map around
    activities[0]?.map.fitBounds(bbox, { padding: 80 })
  }, [activities])

  useEffect(() => {
    if (!focussedActivity) { return };

    focussedActivity.flyTo();    
  }, [focussedActivity])

  useEffect(() => {
    if (!hoveredActivity) {
      activities.forEach(activity => activity.mouseleave())
    } else {
      activities.forEach(activity => activity.hide())
      hoveredActivity.mouseover()
    }  
  }, [hoveredActivity])


  return(
    <div className="w-96 overflow-auto">
      {
        activities.map((activity: Activity) => {
          return (
            <ActivityItem
              key={Math.random()}
              onMouseOver={() => { setHoveredActivity(activity) }}
              onMouseLeave={() => { setHoveredActivity(undefined) }}
              onClick={() => { setFocussedActivity(activity); } }
              activity={activity}
            />
          )
        })
      }
    </div>
  )
}
