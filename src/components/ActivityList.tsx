import { useEffect, useState } from 'react';
import ActivityItem from './ActivityItem';
import Activity from '../models/Activity';
import bbox from '@turf/bbox'
import LoaderWithText from './LoaderWithText';

type ActivityProps = {
  isLoading: boolean;
  activities: Activity[];
}

export default function ActivityList(props: ActivityProps) {
  const { isLoading, activities } = props;
  const [focussedActivity, setFocussedActivity] = useState<Activity>();
  const [hoveredActivity, setHoveredActivity] = useState<Activity>();

  useEffect(() => {
    let featureCollection = {
      "type": 'FeatureCollection',
      "features": activities.map(activity => {
        return {
          type: "Feature",
          geometry: activity.asGeoJSON()
        }
      })
    }

    const boundingBox = bbox(featureCollection as any)
    // Should probably pass the map around
    activities[0]?.map.fitBounds(boundingBox, { padding: 80 })
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

  const content = () => {
    if (isLoading) { return <LoaderWithText width={50} height={50} text={'Fetching your activities'} /> }

    return (
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
    )
  }

  return(
    <div className="relative w-96 overflow-auto">
      {content()}
    </div>
  )
}
