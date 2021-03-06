import axios from "axios";
import Cookies from 'js-cookie'

interface ActivitiesParams {
  page: number;
  per_page: number;
}

const clientId = "57045"
const clientSecret = "05a3f29d756923b9bec7648f41f5e3ff997ed60c";
const redirectUri = 'https://actviti.com/';
// const redirectUri = 'http://localhost:3000';

const Strava = {
  logIn: () => {
    const authUri = `https://www.strava.com/oauth/authorize?client_id=${clientId}&response_type=code&redirect_uri=${redirectUri}&approval_prompt=auto&scope=activity:read`

    window.location.href = authUri
  },

  oauth: (code: string) => {
    const params = {
      client_id: clientId,
      client_secret: clientSecret,
      code: code,
      grant_type: "authorization_code"
    }

    return axios.post('https://www.strava.com/oauth/token', null, { params })
      .then(res => {
        console.log('res', res)
        return new Promise<string>((resolve) => {
          Cookies.set('stravaBearerToken', res.data.access_token)

          return resolve(res.data.access_token)
        })
      })
  },

  activities: (params: ActivitiesParams) => {
    const bearerToken = Cookies.get('stravaBearerToken')
    const headers = { 'Authorization': `Bearer ${bearerToken}` }
    
    return axios.get("https://www.strava.com/api/v3/athlete/activities", { headers, params })
  },

  activity: (id: string) => {
    const bearerToken = Cookies.get('stravaBearerToken')
    const headers = { 'Authorization': `Bearer ${bearerToken}` }

    return axios.get(`https://www.strava.com/api/v3/activities/${id}`, { headers })
  },
  
  activityPhotos: (activityId: string) => {
    const bearerToken = Cookies.get('stravaBearerToken')
    const headers = { 'Authorization': `Bearer ${bearerToken}` }

    return axios.get(`https://www.strava.com/api/v3/activities/${activityId}/photos?photo_source=true`, { headers })
  },
  
  photo: (activityId: string, photoId: string) => {
    const bearerToken = Cookies.get('stravaBearerToken')
    const headers = { 'Authorization': `Bearer ${bearerToken}` }

    return axios.get(`https://www.strava.com/api/v3/activities/${activityId}/photos/${photoId}`, { headers })
  },
}

export default Strava;