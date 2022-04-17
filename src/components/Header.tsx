export default function Header() {
  const obtainStravaAuth = () => {
    // Really all of these requests should be made server side to prevent secrets from being visible
    const clientId = 57045;
    const redirectUri = 'http://localhost:3000';
    const authUri = `https://www.strava.com/oauth/authorize?client_id=${clientId}&response_type=code&redirect_uri=${redirectUri}&approval_prompt=force&scope=activity:read`

    window.location = authUri
  }
  return(
    <div className="relative bg-white">
      <div className="flex justify-between items-center px-4 py-2 md:justify-start md:space-x-10">
        <div className="hidden md:flex items-center justify-end md:flex-1 lg:w-0">
          <button onClick={obtainStravaAuth} className="ml-8 whitespace-nowrap inline-flex items-center justify-center px-3 py-1 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-indigo-600 hover:bg-indigo-700"> Log in with Strava</button>
        </div>
      </div>
    </div>
  )
}
