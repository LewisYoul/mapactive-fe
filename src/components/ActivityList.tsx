import { useEffect, useState } from 'react';
import ActivityItem from './ActivityItem';
import Activity from '../models/Activity';
import bbox from '@turf/bbox'
import LoaderWithText from './LoaderWithText';

type ActivityProps = {
  isLoading: boolean;
  activities: object[];
  selectActivity: Function;
  selectedActivity: Activity | undefined;
}

export default function ActivityList(props: ActivityProps) {
  const { isLoading, activities, selectActivity, selectedActivity } = props;
  const [focussedActivity, setFocussedActivity] = useState<Activity>();
  const [hoveredActivity, setHoveredActivity] = useState<Activity>();

  // useEffect(() => {
  //   let featureCollection = {
  //     "type": 'FeatureCollection',
  //     "features": activities.map(activity => {
  //       return {
  //         type: "Feature",
  //         geometry: activity.asGeoJSON()
  //       }
  //     })
  //   }

  //   const boundingBox = bbox(featureCollection as any)
  //   // Should probably pass the map around
  //   activities[0]?.map.fitBounds(boundingBox, { padding: 80 })
  // }, [activities])

  // useEffect(() => {
  //   if (!focussedActivity) { return };

  //   focussedActivity.flyTo();    
  // }, [focussedActivity])

  // useEffect(() => {
  //   if (!hoveredActivity) {
  //     activities.forEach(activity => activity.mouseleave())
  //   } else {
  //     activities.forEach(activity => activity.hide())
  //     hoveredActivity.mouseover()
  //   }  
  // }, [hoveredActivity])

  const content = () => {
    if (isLoading) { return <LoaderWithText width={50} height={50} text={'Fetching your activities'} /> }

    return (
      <div className="relative shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
        <table className="relative min-w-full">
          <thead className="sticky top-0 bg-gray-50">
            <tr>
              <th scope="col" className="sticky top-0 whitespace-nowrap py-2 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">Name</th>
              <th scope="col" className="sticky top-0 whitespace-nowrap px-2 py-2 text-left text-sm font-semibold text-gray-900">Date</th>
              <th scope="col" className="sticky top-0 whitespace-nowrap px-2 py-2 text-left text-sm font-semibold text-gray-900">Type</th>
              <th scope="col" className="sticky top-0 whitespace-nowrap px-2 py-2 text-left text-sm font-semibold text-gray-900">Dist (km)</th>
              <th scope="col" className="sticky top-0 whitespace-nowrap px-2 py-2 text-left text-sm font-semibold text-gray-900">Elev (m)</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {activities.map((activity: any) => {
              return (
                <ActivityItem
                  key={Math.random()}
                  onMouseOver={() => { }}
                  onMouseLeave={() => { }}
                  selectActivity={() => { selectActivity(activity) } }
                  activity={activity}
                  isSelected={selectedActivity === activity}
                />
              )
            })}
          </tbody>
        </table>
      </div>
    )
  }

  return(
    <div className="h-full overflow-auto">
      {content()}
    </div>
  )
}
