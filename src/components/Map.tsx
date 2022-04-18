import { useEffect, useState } from 'react'
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import Activity from '../models/Activity';
import ActivityList from './ActivityList';
import Strava from '../clients/Strava';

function Map() {
  const [map, setMap] = useState<any>();
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [activities, setActivities] = useState<Activity[]>([]);
  const [filteredActivities, setFilteredActivities] = useState<Activity[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>();

  useEffect(() => {
    mapboxgl.accessToken = 'pk.eyJ1IjoibGV3aXN5b3VsIiwiYSI6ImNqYzM3a3lndjBhOXQyd24zZnVleGh3c2kifQ.qVH2-BA02t3p62tG72-DZA';

    const newMap = new mapboxgl.Map({
      container: 'map',
      style: 'mapbox://styles/mapbox/streets-v11'
    });

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
    activities.forEach(activity => activity.removeFromMap())
    filteredActivities.forEach(activity => activity.addToMap())
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

      return basicActivities.map((activity) => new Activity(activity, map))
    } catch (err) {
      console.error('opp', err)
      return [];
    }
  }

  const plotActivities = async () => {
    if (!isLoggedIn) { return };

    getActivities()
      .then((activities) => {
        setActivities(activities)
        setFilteredActivities(activities)
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

  const activityList = () => {
    if (!isLoggedIn) { return <></> }

    return (
      <div className="relative w-96">
        {searchForm()}
        <ActivityList isLoading={isLoading} activities={filteredActivities} />
      </div>
    )
  }

  const authButton = () => {
    let button;

    if (!isLoggedIn) {
      button = <button onClick={Strava.logIn} className="absolute m-4 z-40 top-0 right-0 whitespace-nowrap inline-flex items-center justify-center px-3 py-1 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-indigo-600 hover:bg-indigo-700"> Log in with Strava</button>
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
    <div className="w-full h-full">
      <div className="flex w-full h-full">
        {activityList()}
        <div className="relative w-full h-full">
          <div id="map">
            {authButton()}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Map
