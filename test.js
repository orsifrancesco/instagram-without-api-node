const { iwaTag, iwa, iwaId, iwaIdUrl } = require('instagram-without-api-node');

const _cookie = 'mid=ZDQvkQALAAFaW...a865efce"';
const _userAgent = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/112.0.0.0 Safari/537.36';
const _xIgAppId = '93661...459';

async function fetch() {

    // get the latest 12 feeds from a tag (example https://instagram.com/explore/tags/love)

    const responseIwaTag = await iwaTag({

        group: 'recent',                        // <!-- "recent" images or "top" images; "recent" is by default 
        base64images: false,                    // <!-- optional, but without you will be not able to save images.. it increases the size of the json file
        base64imagesCarousel: false,            // <!-- optional but not recommended, it increases the size of the json file
        base64videos: false,                    // <!-- optional but not recommended, it increases the size of the json file

        headers: {
            'cookie': _cookie,
            'user-agent': _userAgent,
            'x-ig-app-id': _xIgAppId
        },

        maxImages: 2,                           // <!-- optional, 12 is the max number
        file: "instagram-cache-bytag.json",     // <!-- optional, instagram-cache.json is by default
        pretty: true,                           // <!-- optional, prettyfy json true/false
        time: 3600,                             // <!-- optional, reload contents after 3600 seconds by default

        id: "love"                              // <!-- id is required

    })

    console.log({ responseIwaTag });



    // get the latest 12 feeds from an account (example https://www.instagram.com/orsifrancesco/)

    const responseIwa = await iwa({

        base64images: false,                    // <!-- optional, but without you will be not able to save images.. it increases the size of the json file
        base64imagesCarousel: false,            // <!-- optional but not recommended, it increases the size of the json file
        base64videos: false,                    // <!-- optional but not recommended, it increases the size of the json file

        headers: {
            'cookie': _cookie,
            'user-agent': _userAgent,
            'x-ig-app-id': _xIgAppId
        },

        maxImages: 2,                           // <!-- optional, 12 is the max number
        file: "instagram-cache.json",           // <!-- optional, instagram-cache.json is by default
        pretty: true,                           // <!-- optional, prettyfy json true/false
        time: 3600,                             // <!-- optional, reload contents after 3600 seconds by default

        id: "orsifrancesco"                     // <!-- id is required

    })

    console.log({ responseIwa });



    // get picture and info from instagram id url (example https://www.instagram.com/p/Cgczi6qMuh1/)

    const responseIwaIdUrl = await iwaIdUrl({

        base64images: false,                    // <!-- optional, but without you will be not able to save images.. it increases the size of the json file
        base64videos: false,                    // <!-- optional but not recommended, it increases the size of the json file

        headers: {
            'cookie': _cookie,
            'user-agent': _userAgent,
            'x-ig-app-id': _xIgAppId
        },

        file: "instagram-cache-byidurl.json",   // <!-- optional, instagram-cache.json is by default
        pretty: true,                           // <!-- optional, prettyfy json true/false
        time: 3600,                             // <!-- optional, reload contents after 3600 seconds by default

        id: "Cgczi6qMuh1"                       // <!-- id is required

    })

    console.log({ responseIwaIdUrl });



    // get picture and info from instagram id (2890411760684296309 is the id of https://www.instagram.com/p/Cgczi6qMuh1/)

    const responseIwaId = await iwaId({

        base64images: false,                    // <!-- optional, but without you will be not able to save images.. it increases the size of the json file
        base64videos: false,                    // <!-- optional but not recommended, it increases the size of the json file

        headers: {
            'cookie': _cookie,
            'user-agent': _userAgent,
            'x-ig-app-id': _xIgAppId
        },

        file: "instagram-cache-byid.json",      // <!-- optional, instagram-cache.json is by default
        pretty: true,                           // <!-- optional, prettyfy json true/false
        time: 3600,                             // <!-- optional, reload contents after 3600 seconds by default

        id: "2890411760684296309"               // <!-- id is required

    })

    console.log({ responseIwaId });

}
fetch()