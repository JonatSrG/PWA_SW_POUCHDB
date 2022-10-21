
//GUardar en el cache dinamico
function actualizaCacheDinamico ( dynamciCache, req, res) {

    if( res.ok ) {

        return caches.open( dynamciCache ).then( cache => {

            cache.put( req, res.clone() );

            return res.clone();
        });
    } else {

        return res;
    }

}