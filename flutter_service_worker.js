'use strict';
const MANIFEST = 'flutter-app-manifest';
const TEMP = 'flutter-temp-cache';
const CACHE_NAME = 'flutter-app-cache';
const RESOURCES = {
  "assets/AssetManifest.json": "2467925edc9c1b494155021cd16fc11e",
"assets/assets/icons/a_1.png": "d49034f7a550a7493c7727552be4563c",
"assets/assets/icons/a_2.png": "7965aeb6db89dd722ce08e9872790977",
"assets/assets/icons/a_3.png": "f6985ac548f91faf943fb78004d2796d",
"assets/assets/icons/a_4.png": "4167b60bfb5a539c0e161a00b9e00927",
"assets/assets/icons/a_5.png": "72027eb759bb29c18834c19541f85e3d",
"assets/assets/icons/a_6.png": "e95f2e1966ceb28e500a071b7801d56a",
"assets/assets/icons/c_1.png": "99bd1e98e493dde7a3f01fd70ef5d89c",
"assets/assets/icons/c_2.png": "2996a497950c73add5d3ff34d5117e2e",
"assets/assets/icons/c_3.png": "c5ce33a043932a39f8d5e89e33e3f81a",
"assets/assets/icons/c_4.png": "14b0027eb61ec454d6774730f7e47bab",
"assets/assets/icons/c_5.png": "ca35435110c1a99b1c8cedb51d0045a3",
"assets/assets/icons/c_6.png": "efdabf9294f1772435fbbdd0a1054a8b",
"assets/assets/icons/f_1.png": "fb1e2deecffcc449a12ce9be17ecb0ac",
"assets/assets/icons/f_2.png": "8b99b09734edc4ba57e2e421852bb0ef",
"assets/assets/icons/f_3.png": "aa6b2cb7495a44f41b3c390779262386",
"assets/assets/icons/f_4.png": "69fca48c03c923e18d230db128df4a3a",
"assets/assets/icons/f_5.png": "f1f0be128213441a587325b3112066ba",
"assets/assets/icons/f_6.png": "54835c467f60a1168fe57da87db3ce4b",
"assets/assets/icons/p_1.png": "4a444a9a9a13523a59463d14c7ead7e9",
"assets/assets/icons/p_2.png": "c2d6e812abb298295aa2875064f54fa2",
"assets/assets/icons/p_3.png": "1805b416fc62a8c6557eca8d4d4ffde6",
"assets/assets/icons/p_4.png": "80d68be03e06e9a60db8e58f208137d9",
"assets/assets/icons/p_5.png": "5477124fc6532ac58f64a6509d89d7ae",
"assets/assets/icons/p_6.png": "c8c5ab2ebd05abc56b8ab54106724733",
"assets/assets/icons/t_1.png": "0c0195b73b6921c72a7bce079513fbe8",
"assets/assets/icons/t_2.png": "19c51a9b73261a29f73fe6ef054ccf0c",
"assets/assets/icons/t_3.png": "d5e0d4368d5f766f41bbee881e2b952d",
"assets/assets/icons/t_4.png": "4fc049d6344c463df613c16bc96bb444",
"assets/assets/icons/t_5.png": "10bb158ca66a33bf99034caec61c525e",
"assets/assets/icons/t_6.png": "3831ef1eb019d2e0da0d485ceee841ee",
"assets/FontManifest.json": "9e0649c90f16a7be3d51ab27d6089604",
"assets/fonts/MaterialIcons-Regular.otf": "4e6447691c9509f7acdbf8a931a85ca1",
"assets/NOTICES": "2b00f6944194b8f59e0af0f7cc017869",
"assets/packages/cupertino_icons/assets/CupertinoIcons.ttf": "6d342eb68f170c97609e9da345464e5e",
"assets/packages/flutter_neumorphic/fonts/NeumorphicIcons.ttf": "32be0c4c86773ba5c9f7791e69964585",
"assets/src/abis/payment.json": "d9309f9387383650ddf5cea41787b876",
"favicon.png": "5dcef449791fa27946b3d35ad8803796",
"icons/Icon-192.png": "ac9a721a12bbc803b44f645561ecb1e1",
"icons/Icon-512.png": "96e752610906ba2a93c65f8abe1645f1",
"index.html": "e60d51f481598faf5912225f618807a9",
"/": "e60d51f481598faf5912225f618807a9",
"main.dart.js": "8a8104e7eca38a55edb9ee77d63da0ec",
"manifest.json": "0ceccd831badde5b973e7af798d27ec1",
"version.json": "fb800d37cb51ce25f91a8114a375508b"
};

// The application shell files that are downloaded before a service worker can
// start.
const CORE = [
  "/",
"main.dart.js",
"index.html",
"assets/NOTICES",
"assets/AssetManifest.json",
"assets/FontManifest.json"];
// During install, the TEMP cache is populated with the application shell files.
self.addEventListener("install", (event) => {
  self.skipWaiting();
  return event.waitUntil(
    caches.open(TEMP).then((cache) => {
      return cache.addAll(
        CORE.map((value) => new Request(value, {'cache': 'reload'})));
    })
  );
});

// During activate, the cache is populated with the temp files downloaded in
// install. If this service worker is upgrading from one with a saved
// MANIFEST, then use this to retain unchanged resource files.
self.addEventListener("activate", function(event) {
  return event.waitUntil(async function() {
    try {
      var contentCache = await caches.open(CACHE_NAME);
      var tempCache = await caches.open(TEMP);
      var manifestCache = await caches.open(MANIFEST);
      var manifest = await manifestCache.match('manifest');
      // When there is no prior manifest, clear the entire cache.
      if (!manifest) {
        await caches.delete(CACHE_NAME);
        contentCache = await caches.open(CACHE_NAME);
        for (var request of await tempCache.keys()) {
          var response = await tempCache.match(request);
          await contentCache.put(request, response);
        }
        await caches.delete(TEMP);
        // Save the manifest to make future upgrades efficient.
        await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
        return;
      }
      var oldManifest = await manifest.json();
      var origin = self.location.origin;
      for (var request of await contentCache.keys()) {
        var key = request.url.substring(origin.length + 1);
        if (key == "") {
          key = "/";
        }
        // If a resource from the old manifest is not in the new cache, or if
        // the MD5 sum has changed, delete it. Otherwise the resource is left
        // in the cache and can be reused by the new service worker.
        if (!RESOURCES[key] || RESOURCES[key] != oldManifest[key]) {
          await contentCache.delete(request);
        }
      }
      // Populate the cache with the app shell TEMP files, potentially overwriting
      // cache files preserved above.
      for (var request of await tempCache.keys()) {
        var response = await tempCache.match(request);
        await contentCache.put(request, response);
      }
      await caches.delete(TEMP);
      // Save the manifest to make future upgrades efficient.
      await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
      return;
    } catch (err) {
      // On an unhandled exception the state of the cache cannot be guaranteed.
      console.error('Failed to upgrade service worker: ' + err);
      await caches.delete(CACHE_NAME);
      await caches.delete(TEMP);
      await caches.delete(MANIFEST);
    }
  }());
});

// The fetch handler redirects requests for RESOURCE files to the service
// worker cache.
self.addEventListener("fetch", (event) => {
  if (event.request.method !== 'GET') {
    return;
  }
  var origin = self.location.origin;
  var key = event.request.url.substring(origin.length + 1);
  // Redirect URLs to the index.html
  if (key.indexOf('?v=') != -1) {
    key = key.split('?v=')[0];
  }
  if (event.request.url == origin || event.request.url.startsWith(origin + '/#') || key == '') {
    key = '/';
  }
  // If the URL is not the RESOURCE list then return to signal that the
  // browser should take over.
  if (!RESOURCES[key]) {
    return;
  }
  // If the URL is the index.html, perform an online-first request.
  if (key == '/') {
    return onlineFirst(event);
  }
  event.respondWith(caches.open(CACHE_NAME)
    .then((cache) =>  {
      return cache.match(event.request).then((response) => {
        // Either respond with the cached resource, or perform a fetch and
        // lazily populate the cache.
        return response || fetch(event.request).then((response) => {
          cache.put(event.request, response.clone());
          return response;
        });
      })
    })
  );
});

self.addEventListener('message', (event) => {
  // SkipWaiting can be used to immediately activate a waiting service worker.
  // This will also require a page refresh triggered by the main worker.
  if (event.data === 'skipWaiting') {
    self.skipWaiting();
    return;
  }
  if (event.data === 'downloadOffline') {
    downloadOffline();
    return;
  }
});

// Download offline will check the RESOURCES for all files not in the cache
// and populate them.
async function downloadOffline() {
  var resources = [];
  var contentCache = await caches.open(CACHE_NAME);
  var currentContent = {};
  for (var request of await contentCache.keys()) {
    var key = request.url.substring(origin.length + 1);
    if (key == "") {
      key = "/";
    }
    currentContent[key] = true;
  }
  for (var resourceKey of Object.keys(RESOURCES)) {
    if (!currentContent[resourceKey]) {
      resources.push(resourceKey);
    }
  }
  return contentCache.addAll(resources);
}

// Attempt to download the resource online before falling back to
// the offline cache.
function onlineFirst(event) {
  return event.respondWith(
    fetch(event.request).then((response) => {
      return caches.open(CACHE_NAME).then((cache) => {
        cache.put(event.request, response.clone());
        return response;
      });
    }).catch((error) => {
      return caches.open(CACHE_NAME).then((cache) => {
        return cache.match(event.request).then((response) => {
          if (response != null) {
            return response;
          }
          throw error;
        });
      });
    })
  );
}
