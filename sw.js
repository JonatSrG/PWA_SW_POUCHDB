importScripts('js/sw-utils.js');

const STATIC_CACHE = 'static-v1';
const DYNAMIC_CACHE = 'dynamic-v1';
const INMUTABLE_CACHE = 'inmutable-v1'; 

const APP_SHELL = [
    '/',
    'index.html',
    'style/base.css',
    'js/base.js',
    'js/app.js',
    'js/sw-utils.js',
    'style/bg.png',
    'style/plain_sign_in_blue.png',
    'pouchdb-nightly.js'
];

const APP_INMUTABLE = [
    '//cdn.jsdelivr.net/npm/pouchdb@7.3.0/dist/pouchdb.min.js',
    'pouchdb-nightly.js'
];

self.addEventListener('install', e => {
    
    const cacheStatic = caches.open( STATIC_CACHE ).then(cache => 
        cache.addAll( APP_SHELL ));

        const cacheInmutable = caches.open( INMUTABLE_CACHE ).then(cache => 
            cache.addAll( APP_INMUTABLE ));
    
    e.waitUntil( Promise.all([ cacheStatic, cacheInmutable ]) );

});

self.addEventListener('activate', e => {

    const respuesta = caches.keys().then( keys => {

        keys.forEach( key => {

            if (  key !== STATIC_CACHE && key.includes('static') ) {
                return caches.delete(key);
            }

        });

    });

    e.waitUntil( respuesta );

});

self.addEventListener('fecth', e => {

    const respuesta = caches.match( e.request ).then( res => {

        if( res ) {
            return res;
        } else {
            return fetch( e.request ).then( newRes => {

                return actualizaCacheDinamico( DYNAMIC_CACHE, e.request, newRes );

            });

            //console.log( e.request.url );
        }
        
        /* console.log( res ); */
    });

    e.respondWith( respuesta );
});
