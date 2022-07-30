const iwa = require('instagram-without-api-node');

const _cookie = 'mid=Ywj....hFLUdjNT55f0"'      // <!-- required!! please get your cookie from your browser console (6)
const _userAgent = 'Mozilla/5.0.../537.36'      // <!-- required!! please get your user-agent from your browser console (7)
const _xIgAppId = '93661974...'                 // <!-- required!! please get your x-ig-app-id from your browser console (8)

async function fetch() {

    const response = await iwa({

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

    console.log({ response });

}
fetch()