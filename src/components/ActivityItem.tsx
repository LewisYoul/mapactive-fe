import { MouseEventHandler } from 'react';
import Activity from '../models/Activity';

type ActivityProps = {
  selectActivity: MouseEventHandler<any>;
  onMouseOver: MouseEventHandler<any>;
  onMouseLeave: MouseEventHandler<any>;
  activity: Activity;
  isSelected: boolean;
}

export default function ActivityItem(props: ActivityProps) {
  const { activity, selectActivity, onMouseLeave, onMouseOver, isSelected } = props;

  const classes = () => {
    let classString = "cursor-pointer "

    if (isSelected) {
      return classString + "bg-purple-200"
    } else {
      return classString + "hover:bg-purple-100"
    }
  }

  return(
    // <div className="py-2 px-3 cursor-pointer hover:bg-gray-100" onClick={onClick} onMouseOver={onMouseOver} onMouseLeave={onMouseLeave}>
    //   <div className="flex justify-between">
    //     <span className="block text-base" key={Math.random()}>{activity.name()}</span>
    //     <div>
    //       <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-purple-100 text-purple-800">{activity.type()}</span>
    //     </div>`
    //   </div>
    //   <span className="block text-xs text-gray-500">{activity.startDate()}</span>
    // </div>

    <tr className={classes()} onClick={selectActivity}>
      <td className="whitespace-nowrap py-1.5 pl-4 pr-3 text-sm text-gray-900 sm:pl-6">{activity.name()}</td>
      <td className="whitespace-nowrap px-2 py-1.5 text-sm text-gray-900">{activity.startDateShort()}</td>
      <td className="whitespace-nowrap px-2 py-1.5 text-sm text-gray-900">
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">{activity.type()}</span>
      </td>
      <td className="whitespace-nowrap px-2 py-1.5 text-sm text-gray-900">{activity.distance()}</td>
      <td className="whitespace-nowrap px-2 py-1.5 text-sm text-gray-900">{activity.totalElevationGain()}</td>
    </tr>
  )
}
