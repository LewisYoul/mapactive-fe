import { MouseEventHandler } from 'react';
import Activity from '../models/Activity';

type ActivityProps = {
  onClick: MouseEventHandler<any>;
  onMouseOver: MouseEventHandler<any>;
  onMouseLeave: MouseEventHandler<any>;
  activity: Activity;
}

export default function ActivityItem(props: ActivityProps) {
  const { activity, onClick, onMouseLeave, onMouseOver } = props;

  return(
    <div className="py-2 px-3 cursor-pointer hover:bg-gray-100" onClick={onClick} onMouseOver={onMouseOver} onMouseLeave={onMouseLeave}>
      <div className="flex justify-between">
        <span className="block text-base" key={Math.random()}>{activity.name()}</span>
        <div>
          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-purple-100 text-purple-800">{activity.type()}</span>
        </div>
      </div>
      <span className="block text-xs text-gray-500">{activity.startDate()}</span>
    </div>
  )
}
