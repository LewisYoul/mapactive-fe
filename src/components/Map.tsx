import { useEffect, useState } from 'react'
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import axios from 'axios';
import Activity from '../models/Activity';
import ActivityList from './ActivityList';

function Map() {
  const [map, setMap] = useState<any>();
  const [bearerToken, setBearerToken] = useState<string>();
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
      obtainBearerToken(searchParams.get('code') as string)
    }
  }, [])

  useEffect(() => { plotActivities() }, [bearerToken])

  const obtainBearerToken = (code: string) => {
    const params = {
      client_id: "57045",
      client_secret: "05a3f29d756923b9bec7648f41f5e3ff997ed60c",
      code: code,
      grant_type: "authorization_code"
    }

    axios.post('https://www.strava.com/oauth/token', null, { params })
      .then(res => {
        setBearerToken(res.data.access_token)
      })
      .catch(err => {
        console.error(err)
      })
  }

  const getActivities = async () => {
    const activitiesUrl = "https://www.strava.com/api/v3/athlete/activities";
    const headers = { 'Authorization': `Bearer ${bearerToken}` }
    let page = 1;
    let perPage = 200;
    
    try {
      let hasMoreActivities = true;
      let basicActivities: any[] = [];
      
      while(hasMoreActivities) {
        const params = { page: page, per_page: perPage }
        const res = await axios.get(activitiesUrl, { headers, params })

        basicActivities = basicActivities.concat(res.data)

        if (res.data.length < perPage) {
          hasMoreActivities = false
        } else {
          page++
        }
      }
      console.log('ba', basicActivities)

      basicActivities = basicActivities.filter((activity) => {
        return activity.map?.summary_polyline
      })

      return basicActivities.map((activity) => new Activity(activity, map))
    } catch (err) {
      console.log('opp', err)
      return [];
    }
  }

  const plotActivities = async () => {
    if (!bearerToken) { return };

    getActivities()
      .then((activities) => {
        console.log('activities', activities)

        setActivities(activities)
        setFilteredActivities(activities)
      })
      .catch(console.error)

  }

  const obtainStravaAuth = () => {
    // Really all of these requests should be made server side to prevent secrets from being visible
    const clientId = 57045;
    const redirectUri = 'https://main--delicate-kitsune-469180.netlify.app/';
    const authUri = `https://www.strava.com/oauth/authorize?client_id=${clientId}&response_type=code&redirect_uri=${redirectUri}&approval_prompt=force&scope=activity:read`

    window.location.href = authUri
  }

  const search = (event: { preventDefault: () => void; }) => {
    event.preventDefault();

    filteredActivities.forEach(activity => activity.removeFromMap())

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
    return activities.length > 0 ? <ActivityList activities={filteredActivities} /> : <></>
  }

  const authButton = () => {
    let button;

    if (!bearerToken) {
      button = <button onClick={obtainStravaAuth} className="absolute m-4 z-40 top-0 right-0 whitespace-nowrap inline-flex items-center justify-center px-3 py-1 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-indigo-600 hover:bg-indigo-700"> Log in with Strava</button>
    }

    return button
  }

  const searchForm = () => {
    let form;

    if (bearerToken) {
      form = (
        <form onSubmit={search} className="absolute m-auto top-0 inset-x-0 z-50 w-80 text-base">
          <input onChange={(event) => { setSearchTerm(event.target.value) }} type="text" name="email" id="email" className="px-4 py-2 shadow-sm w-full rounded-b-md" placeholder="Find activity by name" />
        </form>
      )
    }

    return form
  }

  return (
    <div className="w-full h-full">
      <div className="flex w-full h-full">
        {activityList()}
        <div className="relative w-full h-full">
          <div id="map">
            {searchForm()}
            {authButton()}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Map
