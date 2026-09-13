# Locally served UI dependencies

These browser assets are checked in so application startup does not depend on a third-party script CDN.

- Leaflet 1.9.4: leaflet.js and leaflet.css from cdnjs; license from the leaflet npm package.
- Lucide 1.45.0: dist/umd/lucide.js from the lucide npm package on unpkg; ISC license retained.

Map tiles and Google Fonts still use their existing providers. They do not control whether station loading completes.
