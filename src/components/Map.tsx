import { useEffect, useState } from 'react'
import Activity from '../models/Activity';
import ActivityList from './ActivityList';
import Strava from '../clients/Strava';
import Panel from './Panel';
import L from 'leaflet'

function Map() {
  const [map, setMap] = useState<any>();
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [activities, setActivities] = useState<Activity[]>([]);
  const [filteredActivities, setFilteredActivities] = useState<Activity[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>();
  const [selectedActivity, setSelectedActivity] = useState<Activity>();

  useEffect(() => {
    const newMap = L.map('map').setView([51.505, -0.09], 13);
    const accessToken = 'pk.eyJ1IjoibGV3aXN5b3VsIiwiYSI6ImNqYzM3a3lndjBhOXQyd24zZnVleGh3c2kifQ.qVH2-BA02t3p62tG72-DZA';

    L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 18,
      tileSize: 512,
      id: 'mapbox/streets-v11',
      zoomOffset: -1,
      accessToken: accessToken
    }).addTo(newMap);

    setMap(newMap)

    const searchParams = new URLSearchParams(window.location.search)

    if (searchParams.has('code')) {
      Strava.oauth(searchParams.get('code') as string)
        .then(token => setIsLoggedIn(true))
        .catch(console.error)
    }
  }, [])

  useEffect(() => { plotActivities() }, [isLoggedIn])

  useEffect(() => {
    if (!selectedActivity) {
      map?.invalidateSize()
      return
    }

    const nonSelectedActivities = activities.filter((activity) => {
      return activity !== selectedActivity      
    })

    nonSelectedActivities.forEach((activity) => { activity.sendToBackground() })

    selectedActivity.flyTo()
    map.invalidateSize()
  }, [selectedActivity])

  useEffect(() => {
    activities.forEach(activity => activity.removeFromMap())
    filteredActivities.forEach(activity => activity.addToMap())
    const fg = L.featureGroup(filteredActivities.map(activity => activity.layer))
    map?.flyToBounds(fg.getBounds(), { duration: 2 })

  }, [filteredActivities])

  const getActivities = async () => {
    setIsLoading(true)

    let page = 1;
    let perPage = 200;
    
    try {
      let hasMoreActivities = true;
      let basicActivities: any[] = [];
      
      while(hasMoreActivities) {
        const params = { page: page, per_page: perPage }
        const res = await Strava.activities(params)

        basicActivities = basicActivities.concat(res.data)

        if (res.data.length < perPage) {
          hasMoreActivities = false
        } else {
          page++
        }
      }

      basicActivities = basicActivities.filter((activity) => {
        return activity.map?.summary_polyline
      })

      return basicActivities
    } catch (err) {
      console.error('opp', err)
      return [];
    }
  }

  const plotActivities = async () => {
    if (!isLoggedIn) { return };

    getActivities()
      .then((activities) => {
        const activityInstances = activities.map((activity) => { return new Activity(activity, map, selectActivity) })
        setActivities(activityInstances)
        setFilteredActivities(activityInstances)
        setIsLoading(false)
      })
      .catch(console.error)

  }

  const search = (event: { preventDefault: () => void; }) => {
    event.preventDefault();

    if (!searchTerm) {
      setFilteredActivities(activities)
    } else {
      const activitiesFilteredBySearchTerm = activities.filter(activity => {
        return activity.name().toLowerCase().includes(searchTerm)
      })
  
      setFilteredActivities(activitiesFilteredBySearchTerm)
    }
  }

  const selectActivity = (activity: Activity) => {
    if (selectedActivity) {
      if (selectedActivity === activity) {
        setSelectedActivity(undefined)
      } else {
        setSelectedActivity(activity)
      }
    } else {
      setSelectedActivity(activity)
    }
  }

  const closePanel = () => {
    setSelectedActivity(undefined)
  }

  const activityList = () => {
    if (!isLoggedIn) { return <></> }

    return (
      <div id="listContainer" className="h-96 overflow-auto relative">
        <ActivityList
          isLoading={isLoading}
          activities={filteredActivities}
          selectActivity={selectActivity}
          selectedActivity={selectedActivity}
        />
      </div>
    )
  }

  const authButton = () => {
    let button;

    if (!isLoggedIn) {
      button = <button onClick={Strava.logIn} className="absolute m-4 z-1000 top-0 right-0 whitespace-nowrap inline-flex items-center justify-center px-3 py-1 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-indigo-600 hover:bg-indigo-700"> Log in with Strava</button>
    }

    return button
  }

  const searchForm = () => {
    if (isLoading) { return <></> }

    return (
      <form onSubmit={search} className="w-full text-base">
        <input onChange={(event) => { setSearchTerm(event.target.value) }} type="text" name="email" id="email" className="outline-none px-3 py-2 w-full" placeholder="Search by name" />
      </form>
    )
  }

  return (
    // <div className="flex w-full h-full">
    //   {activityList()}
    //   <div className="relative w-full h-full">
        // <div id="map">
        //   {authButton()}
        // </div>
    //   </div>
    //   <div className="bg-green-200 flex-none w-96"></div>
    // </div>
    <div className="flex w-full h-full">
      <div className="w-full flex flex-col">
        <div className="bg-red-200 w-full h-full flex">
          <div className="w-full h-full">
            <div className="relative h-full w-full" id="map">
              {authButton()}
            </div>
          </div>
          {selectedActivity ? 
            <Panel activity={selectedActivity} closePanel={closePanel}/>
          : null}
        </div>
        {activityList()}
      </div>
    </div>
  )
}

export default Map
