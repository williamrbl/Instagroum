/* eslint-env serviceworker */

/*
 * This file (which will be your service worker)
 * is picked up by the build system ONLY if
 * quasar.config.js > pwa > workboxMode is set to "injectManifest"
 */

//dependencies

import { precacheAndRoute } from "workbox-precaching";

//config
precacheAndRoute(self.__WB_MANIFEST);
