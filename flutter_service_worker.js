'use strict';
const MANIFEST = 'flutter-app-manifest';
const TEMP = 'flutter-temp-cache';
const CACHE_NAME = 'flutter-app-cache';
const RESOURCES = {
  "assets/AssetManifest.json": "42868adb1c400a41cb7a6013e4aeab83",
"assets/assets/DKB_CV.pdf": "d41d8cd98f00b204e9800998ecf8427e",
"assets/assets/fonts/MySocialIcons.ttf": "345787fe6cbe5bf827f3a84436278f6f",
"assets/assets/fonts/Ubuntu-Bold.ttf": "e00e2a77dd88a8fe75573a5d993af76a",
"assets/assets/fonts/Ubuntu-Medium.ttf": "8e22c2a6e3a3c679787e763a97fa11f7",
"assets/assets/fonts/Ubuntu-Regular.ttf": "2505bfbd9bde14a7829cc8c242a0d25c",
"assets/assets/images/ER-MainLogo2-block.png": "35c6e4f1442f917c3dbeba6fb53e96a9",
"assets/assets/images/logo.png": "9114748921837ff639a09a09d5d202de",
"assets/assets/images/man.png": "6459a78b8d655079c08d4249cbcc0db5",
"assets/assets/images/me.png": "b7f39ada59a3ed565db9cc55f6a58002",
"assets/assets/images/skills.png": "04ad928c30fb6b731c3ef7cae30af9ed",
"assets/FontManifest.json": "927f2f13a2d04e1dbe1ab15efbdb72fa",
"assets/fonts/MaterialIcons-Regular.otf": "1288c9e28052e028aba623321f7826ac",
"assets/NOTICES": "02d9536f2486f01d7fe958fdaa0b891a",
"assets/packages/cupertino_icons/assets/CupertinoIcons.ttf": "b14fcf3ee94e3ace300b192e9e7c8c5d",
"icons/android-icon-144x144.png": "a50e73f1c6fbcac5b0ee3e4d9fd166fb",
"icons/android-icon-192x192.png": "f1d660ca0a914ed7b9001ae61e1df469",
"icons/android-icon-36x36.png": "4a5ad81a0ac3bfd91825a9433181801f",
"icons/android-icon-48x48.png": "12c192cc2e5d64dbd406ad3bc32b1a48",
"icons/android-icon-72x72.png": "b30f1f918aaeb0806ba06bf2163853d7",
"icons/android-icon-96x96.png": "0d1a77e29e502427b6e70de4c2b4e569",
"icons/apple-icon-114x114.png": "4f726cbce2ba3797c9e4a346437564c9",
"icons/apple-icon-120x120.png": "8023372c3ddce30d9195f1fa4f277e5b",
"icons/apple-icon-144x144.png": "a50e73f1c6fbcac5b0ee3e4d9fd166fb",
"icons/apple-icon-152x152.png": "0ae70c2d15c4af91d13c2e044e54d445",
"icons/apple-icon-180x180.png": "c2f78fd90e4cbdab876237deecda19e9",
"icons/apple-icon-57x57.png": "03a4204f5f13215192be1da2f0e6fb55",
"icons/apple-icon-60x60.png": "3ab64cef435045bce8df61ab4d80a34d",
"icons/apple-icon-72x72.png": "b30f1f918aaeb0806ba06bf2163853d7",
"icons/apple-icon-76x76.png": "8af1f0a16f984884c5042ecf3f39e1cc",
"icons/apple-icon-precomposed.png": "f1d660ca0a914ed7b9001ae61e1df469",
"icons/apple-icon.png": "f1d660ca0a914ed7b9001ae61e1df469",
"icons/browserconfig.xml": "97775b1fd3b6e6c13fc719c2c7dd0ffe",
"icons/favicon-16x16.png": "9114748921837ff639a09a09d5d202de",
"icons/favicon-32x32.png": "be6046bfa69b45a126d5fcbe701f9c7a",
"icons/favicon-96x96.png": "0d1a77e29e502427b6e70de4c2b4e569",
"icons/ms-icon-144x144.png": "a50e73f1c6fbcac5b0ee3e4d9fd166fb",
"icons/ms-icon-150x150.png": "690fe6ba7f71e2f1c312dab176f96f9c",
"icons/ms-icon-310x310.png": "39f239636b38fb1a6e32d99b24bf2898",
"icons/ms-icon-70x70.png": "c3760db7c1accf4e36c1cacb3cbdac14",
"index.html": "1ce718ad5c49106740e42a51f001fb0a",
"/": "1ce718ad5c49106740e42a51f001fb0a",
"main.dart.js": "692ae4b5dcded523f102d2cbf159f310",
"manifest.json": "c0b3b9843cac3c5c921c7980bc39a6cd",
"version.json": "ae6ec7e100fa218a70c1a7006c2c1b64"
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
        CORE.map((value) => new Request(value + '?revision=' + RESOURCES[value], {'cache': 'reload'})));
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
