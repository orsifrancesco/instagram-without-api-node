const request = require('request');
const base64 = require('./base64');
var fs = require("fs");

function iwa({
    id,
    maxImages,
    file,
    pretty,
    time,
    base64images,
    headers
}) {

    if (!id) id = 'orsifrancesco';
    if (!maxImages || Number.isNaN(maxImages)) maxImages = 12;
    if (!file) file = 'instagram-cache.json'
    if (!pretty) pretty = false;
    if (Number.isNaN(time)) time = 3600;
    if (!base64images) base64images = false;
    if (!headers) headers = {};

    const options = {
        url: `https://i.instagram.com/api/v1/users/web_profile_info/?username=${id}`,
        headers
    };

    function requestAsyncImage(url) {
        return new Promise(function (resolve, reject) {
            request(url, function (error, res, body) {
                if (!error && res.statusCode == 200) {
                    resolve(body);
                } else {
                    reject(error);
                }
            });
        });
    }

    function requestAsync(options) {
        let result = []
        return new Promise(function (resolve) {
            request(options, async (error, res, body) => {
                if (!error && res.statusCode == 200) {
                    let json = false
                    try { json = JSON.parse(body); } catch (e) { }
                    const items = json?.data?.user?.edge_owner_to_timeline_media?.edges || [];
                    const filteredItems = items.filter((el, index) => { return !maxImages ? el : index < maxImages });
                    const mappedItems = await Promise.all(filteredItems.map(async (el) => {
                        const imageBody = base64images ? await requestAsyncImage(el['node']['display_url']) : false;
                        const image = imageBody ? base64.encode(imageBody) : false;
                        let obj = {
                            id: el['node']['id'],
                            time: el['node']['taken_at_timestamp'],
                            imageUrl: el['node']['display_url'],
                            likes: el['node']['edge_liked_by']['count'],
                            comments: el['node']['edge_media_to_comment']['count'],
                            link: 'https://www.instagram.com/p/' + el['node']['shortcode'] + '/',
                            text: el['node']['edge_media_to_caption']['edges'][0]['node']['text']
                        }
                        if (image) obj.image = image;
                        return obj
                    }));
                    result = mappedItems;
                }
                fs.writeFileSync(file, JSON.stringify(result, null, pretty ? 2 : null));
                resolve(result);
            });
        });
    }

    function init() {
        return new Promise(function (resolve) {
            let result = [];
            try {
                fs.stat(file, async (err, stats) => {
                    if (err) {
                        result = await requestAsync(options)
                        resolve(result);
                        return;
                    }
                    const date = new Date();
                    const unixTimestampNow = Math.floor(date.getTime() / 1000)
                    const unixTimestamp = Math.floor(stats.mtime.getTime() / 1000)
                    // console.log(unixTimestampNow - unixTimestamp >= time);
                    if (unixTimestampNow - unixTimestamp >= time) result = await requestAsync(options)
                    else result = JSON.parse(fs.readFileSync(file, 'utf8') || [])
                    resolve(result);
                });
            } catch (err) { resolve(result); }
        });
    }

    return init();

}

module.exports = iwa;