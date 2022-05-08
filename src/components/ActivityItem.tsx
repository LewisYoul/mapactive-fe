import { MouseEventHandler, useEffect } from 'react';
import Activity from '../models/Activity';
import Badge from './Badge';

type ActivityProps = {
  selectActivity: MouseEventHandler<any>;
  onMouseOver: MouseEventHandler<any>;
  onMouseLeave: MouseEventHandler<any>;
  activity: Activity;
  isSelected: boolean;
}

export default function ActivityItem(props: ActivityProps) {
  const { activity, selectActivity, isSelected } = props;

  const classes = () => {
    let classString = "cursor-pointer "

    if (isSelected) {
      return classString + "bg-purple-200"
    } else {
      return classString + "hover:bg-purple-100"
    }
  }

  return(
    <tr id={activity.id} className={classes()} onClick={selectActivity}>
      <td className="whitespace-nowrap py-1.5 pl-4 pr-3 text-sm text-gray-900 sm:pl-6">{activity.name()}</td>
      <td className="whitespace-nowrap px-2 py-1.5 text-sm text-gray-900">{activity.startDateShort()}</td>
      <td className="whitespace-nowrap px-2 py-1.5 text-sm text-gray-900">
        <Badge className={`${activity.bgColorClass()} ${activity.textColorClass()}`}>{activity.type()}</Badge>
      </td>
      <td className="whitespace-nowrap px-2 py-1.5 text-sm text-gray-900">{activity.distance()}</td>
      <td className="whitespace-nowrap px-2 py-1.5 text-sm text-gray-900">{activity.totalElevationGain()}</td>
    </tr>
  )
}
