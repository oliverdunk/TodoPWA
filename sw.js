self.addEventListener('install', function (event) {
  //Install now, rather than when all tabs with TodoMVC open are closed
  self.skipWaiting();
});

//Netlify doesn't expose the bundled URLs, so we have to cache by intercepting fetch requests
//We'll assume the application is never updated and simple cache each request
//Modified version of the code given on MDN
self.addEventListener('fetch', function (event) {
  event.respondWith(
    caches.match(event.request).then(function (resp) {
      //Either respond from the cache, or fetch it, cache it and then serve it
      return resp  || fetch(event.request).then(function (response) {
        return caches.open('v1').then(function (cache) {
          //We have to clone the request as it can only be read once
          cache.put(event.request, response.clone());
          return response;
        });
      });
    })
  )
});