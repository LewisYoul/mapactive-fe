import { MouseEventHandler } from "react";
import Activity from "../models/Activity";

type PanelProps = {
  activity: Activity;
  closePanel: MouseEventHandler;
}

export default function Panel(props: PanelProps) {
  const { activity, closePanel } = props;

  return(
    <div className="flex-none w-96 px-4 py-6 bg-white">
      <div className="flex items-start justify-between">
        <div>
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">{activity.type()}</span>
          <span className="ml-2 text-sm text-gray-700">{activity.startDateLong()}</span>
        </div>
        <div className="ml-3 flex h-7 items-center">
          <button onClick={closePanel} type="button" className="rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
            <span className="sr-only">Close panel</span>
            <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
      <h2 className="text-lg font-medium text-gray-900" id="slide-over-title">{activity.name()}</h2>
    </div>
  )
}
