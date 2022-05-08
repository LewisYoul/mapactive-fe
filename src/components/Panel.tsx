import { MouseEventHandler, useEffect, useState } from "react";
import Strava from "../clients/Strava";
import Activity from "../models/Activity";
import Badge from "./Badge";

type PanelProps = {
  activity: Activity;
  closePanel: MouseEventHandler;
}

export default function Panel(props: PanelProps) {
  const { activity, closePanel } = props;
  const [photos, setPhotos] = useState<[]>([]);

  useEffect(() => {
    // Strava.activity(activity.id)
    // .then(res => {
    //   console.log('full activity', res)
    //   setPhotos(res.data)
    // })
    // .catch(console.error)

    Strava.activityPhotos(activity.id)
      .then(res => {
        setPhotos(res.data)
      })
      .catch(console.error)
  }, [activity])

  // useEffect(() => {
  //   if (!hasPhotos()) { return }

  //   // console.log('photos', photos)

  //   // Strava.photo(photos[0].unique_id)
  //   //   .then(res => {console.log('pres', res)})
  //   //   .catch(console.error)
  // }, [photos])

  const hasPhotos = () => {
    return photos.length > 0
  }

  const photosEl = () => {
    if (!hasPhotos()) { return }

    return (
      <div className="divide-x-4 divide-white mr-4 bg-green-300 w-full h-40 overflow-x-auto flex bg-black">
        {photos.map((photo: any) => {
          return (
            <img className="flex-none object-cover w-40 h-40 hover:opacity-90" src={photo.urls[0].replace('-48x64.', '-576x768.').replace('-64x48.', '-768x576.')}></img>
          )
        })}
      </div>
    )
  }

  return(
    <div className="flex-none hidden md:block w-96 px-6 py-6 bg-white overflow-auto">
      <div className="flex items-start justify-between">
        <div>
          <Badge className={`${activity.bgColorClass()} ${activity.textColorClass()}`}>{activity.type()}</Badge>
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
      <div className="mt-3">
        {photosEl()}
      </div>
    </div>
  )
}
