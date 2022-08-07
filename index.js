const request = require('request');
const imageToBase64 = require('image-to-base64');
const fs = require("fs");

function iwaIdUrl({
    id,
    file,
    pretty,
    time,
    base64images,
    headers
}) {

    if (!id) id = 'Cgczi6qMuh1';
    if (!file) file = `instagram-cache-byidurl-${id}.json`
    if (!pretty) pretty = false;
    if (Number.isNaN(time)) time = 3600;
    if (!base64images) base64images = false;
    if (!headers) headers = {};

    async function checkFile({ file, time }) {
        return new Promise(function (resolve, reject) {
            try {
                fs.stat(file, async (err, stats) => {
                    if (err) {
                        reject();
                        return;
                    }
                    const date = new Date();
                    const unixTimestampNow = Math.floor(date.getTime() / 1000)
                    const unixTimestamp = Math.floor(stats.mtime.getTime() / 1000)
                    if (unixTimestampNow - unixTimestamp >= time) {
                        reject();
                        return;
                    }
                    resolve(JSON.parse(fs.readFileSync(file, 'utf8') || {}));
                });
            } catch (err) { reject(); }
        });
    }

    async function requestAsync() {
        let result = {}
        return new Promise(function (resolve) {

            const options = {
                url: `https://www.instagram.com/p/${id}/`,
                headers: { ...headers, ...{ ['sec-fetch-site']: 'same-origin' } }
            };

            request(options, async (error, res, body) => {

                if (!error && res.statusCode == 200) {

                    const bodyArray = body?.split('instagram://media?id=')?.[1];
                    const realId = bodyArray?.split('"')?.[0];

                    if (realId) {

                        result = await iwaId({
                            id: realId,
                            file,
                            pretty,
                            time,
                            base64images,
                            headers
                        });

                    } else {

                        fs.writeFileSync(file, JSON.stringify(result, null, pretty ? 2 : null));

                    }

                }
                resolve(result);
            });
        })
    }

    function init({ file, time }) {
        return new Promise(async function (resolve) {
            try {
                const responseFile = await checkFile({ file, time })
                resolve(responseFile)
            } catch (err) {
                const reponseRequest = await requestAsync()
                resolve(reponseRequest)
            }
        });
    }

    return init({ file, time });

}

function iwaId({
    id,
    file,
    pretty,
    time,
    base64images,
    headers
}) {

    if (!id) id = '2890411760684296309';
    if (!file) file = `instagram-cache-byid-${id}.json`
    if (!pretty) pretty = false;
    if (Number.isNaN(time)) time = 3600;
    if (!base64images) base64images = false;
    if (!headers) headers = {};

    const options = {
        url: `https://i.instagram.com/api/v1/media/${id}/info/`,
        headers
    };

    function requestAsync(options) {
        let result = []
        return new Promise(function (resolve) {
            request(options, async (error, res, body) => {
                if (!error && res.statusCode == 200) {
                    let json = false
                    try { json = JSON.parse(body); } catch (e) { }

                    const item = json?.items?.[0] || false;
                    const image =
                        json?.['items']?.[0]?.['image_versions2']?.['candidates']?.[0]?.['url'] ?
                            json['items'][0]['image_versions2']['candidates'][0] :
                            json?.['items']?.[0]?.['carousel_media']?.[0]?.['image_versions2']?.['candidates']?.[0]?.['url'] ?
                                json['items'][0]['carousel_media'][0]['image_versions2']['candidates'][0] :
                                false;

                    let mappedItems = [];

                    if (item && image) {
                        let comments = [];
                        if (item['comments'] && item['comments'].length) {
                            for (let i = 0; i < item['comments'].length; i++) {
                                let value = item['comments']?.i;
                                if (value) {
                                    comments.push({
                                        time: value['created_at_utc'],
                                        text: value['text'],
                                        user: {
                                            username: value['user']['username'],
                                            fullName: value['user']['full_name'],
                                            imageUrl: value['user']['profile_pic_url']
                                        }
                                    });
                                }
                            }
                        }

                        mappedItems = await Promise.all([item].map(async (el) => {
                            const imageBody = base64images ? await imageToBase64(image['url']) : false;
                            let obj = {
                                id,
                                width: image['width'],
                                height: image['height'],
                                imageUrl: image['url'],
                                time: el['taken_at'],
                                topLikers: el['top_likers'],
                                likes: el['like_count'],
                                commentCount: el['comment_count'] || 0,
                                comments,
                                link: `https://www.instagram.com/p/${el['code']}/`,
                                text: el?.['caption']?.['text'],
                                user: {
                                    username: el?.['user']?.['username'],
                                    fullName: el?.['user']?.['full_name'],
                                    imageUrl: el?.['user']?.['profile_pic_url']
                                }
                            }
                            if (imageBody) obj.image = imageBody;
                            return obj
                        }));

                    }

                    result = mappedItems.length ? mappedItems[0] : {};

                }

                fs.writeFileSync(file, JSON.stringify(result, null, pretty ? 2 : null));
                resolve(result);

            });

        });

    }

    return init({ file, time, callback: requestAsync, options });

}

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
                        const imageBody = base64images ? await imageToBase64(el['node']['display_url']) : false;
                        const image = imageBody || false;
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

    return init({ file, time, callback: requestAsync, options });

}

function init({ file, time, callback, options }) {
    return new Promise(function (resolve) {
        let result = [];
        try {
            fs.stat(file, async (err, stats) => {
                if (err) {
                    result = await callback(options)
                    resolve(result);
                    return;
                }
                const date = new Date();
                const unixTimestampNow = Math.floor(date.getTime() / 1000)
                const unixTimestamp = Math.floor(stats.mtime.getTime() / 1000)
                // console.log(unixTimestampNow - unixTimestamp >= time);
                if (unixTimestampNow - unixTimestamp >= time) result = await callback(options)
                else result = JSON.parse(fs.readFileSync(file, 'utf8') || [])
                resolve(result);
            });
        } catch (err) { resolve(result); }
    });
}

module.exports = {
    iwa,
    iwaId,
    iwaIdUrl
};