const { iwa, iwaId, iwaIdUrl } = require('instagram-without-api-node');

const _cookie = 'mid=Ywj....hFLUdjNT55f0"'      // <!-- required!! please get your cookie from your browser console (6)
const _userAgent = 'Mozilla/5.0.../537.36'      // <!-- required!! please get your user-agent from your browser console (7)
const _xIgAppId = '93661974...'                 // <!-- required!! please get your x-ig-app-id from your browser console (8)

async function fetch() {

    // get the latest 12 feeds from an account (example https://www.instagram.com/orsifrancesco/)

    const responseIwa = await iwa({

        headers: {
            'cookie': _cookie,
            'user-agent': _userAgent,
            'x-ig-app-id': _xIgAppId
        },

        base64images: false,                    // <!-- optional, but without it, you will be not able to store/show images
        maxImages: 2,                           // <!-- optional, 12 is the max number
        file: "instagram-cache.json",           // <!-- optional, instagram-cache.json is by default
        pretty: true,                           // <!-- optional, prettyfy json true/false
        time: 3600,                             // <!-- optional, reload contents after 3600 seconds by default

        id: "orsifrancesco"                     // <!-- id is required

    })

    console.log({ responseIwa });



    // get picture and info from instagram id url (example https://www.instagram.com/p/Cgczi6qMuh1/)

    const responseIwaIdUrl = await iwaIdUrl({

        headers: {
            'cookie': _cookie,
            'user-agent': _userAgent,
            'x-ig-app-id': _xIgAppId
        },

        base64images: false,                    // <!-- optional, but without it, you will be not able to store/show images
        file: "instagram-cache-byidurl.json",   // <!-- optional, instagram-cache.json is by default
        pretty: true,                           // <!-- optional, prettyfy json true/false
        time: 3600,                             // <!-- optional, reload contents after 3600 seconds by default

        id: "Cgczi6qMuh1"                       // <!-- id is required

    })

    console.log({ responseIwaIdUrl });



    // get picture and info from instagram id (2890411760684296309 is the id of https://www.instagram.com/p/Cgczi6qMuh1/)

    const responseIwaId = await iwaId({

        headers: {
            'cookie': _cookie,
            'user-agent': _userAgent,
            'x-ig-app-id': _xIgAppId
        },

        base64images: false,                    // <!-- optional, but without it, you will be not able to store/show images
        file: "instagram-cache-byid.json",      // <!-- optional, instagram-cache.json is by default
        pretty: true,                           // <!-- optional, prettyfy json true/false
        time: 3600,                             // <!-- optional, reload contents after 3600 seconds by default

        id: "2890411760684296309"               // <!-- id is required

    })

    console.log({ responseIwaId });

}
fetch()