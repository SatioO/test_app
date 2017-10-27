const libArray = [
	"workbox-sw.js",
	"workbox-routing.js",
	"workbox-runtime-caching.js",
	"workbox-background-sync.js",
	"workbox-broadcast-cache-update.js",
	"workbox-cache-expiration.js",
	"workbox-cacheable-response.js",
	"workbox-google-analytics.js"
]
importScripts(...libArray)

const workboxSW = new self.WorkboxSW({ debug: true })

workboxSW.precache([])
console.log(self)
/**
 * workbox-background-sync 
 * library syncs queues specified requests if they fail over network
 * (internally uses indexedDB to save failed requests)
 * Later replays these requests using BackgroundSync API
 * 
 */
//Instantiate a backgroundSync queue plugin instance to handle api requests.

let bgQueue = new self.workbox.backgroundSync.QueuePlugin()
console.log(bgQueue)
//Instantiate a request wrapper to handle api requests
//Add backgroundSync plugin for this request wrapper
const apiRequestWrapper = new self.workbox.runtimeCaching.RequestWrapper({
	plugins: [bgQueue]
})

const imageRequestWrapper = new self.workbox.runtimeCaching.RequestWrapper({
	plugins: [bgQueue]
})
console.log("Request wrapper: ", apiRequestWrapper)
console.log(imageRequestWrapper)
/**
 * Create a route for handling api request and set a NetworkOnly handler
 * pass the requestWrapper instance
 */

const route = new self.workbox.routing.RegExpRoute({
	regExp: new RegExp("^https://api.themoviedb.org/3/movie"),
	handler: new self.workbox.runtimeCaching.NetworkFirst({
		requestWrapper: apiRequestWrapper
	})
})

const imageRoute = new self.workbox.routing.RegExpRoute({
	regExp: new RegExp("http://image.tmdb.org"),
	handler: new self.workbox.runtimeCaching.NetworkFirst({
		requestWrapper: imageRequestWrapper
	})
})
console.log("API Route: ", route)
console.log(imageRoute)
//Instantiate a router and register the api route
const router = new self.workbox.routing.Router()
router.registerRoute({ route })
router.registerRoute({ route: imageRoute })
