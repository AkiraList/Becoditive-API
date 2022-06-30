const Animals = require('../../models/animals')
const fetch = require("node-fetch");
exports.Nsfw = async (req, res, next) => {
    if (!req.query.end) {
        res.status(400).json({
            error: true,
            code: 400,
            message: 'no image was provided.'
        })
        return res.end()
    }
    try {
       await fetch(`http://127.0.0.1:2000/nsfw/?${req.query.end}`, {
            method: 'GET',
            headers: {
                "Content-Type": "application/json"
            }
        }).then(res => res.json()).then(json => {
            return res.status(200).json({
                error: "False",
                result: json,
            });
        })
        res.end()

    } catch (error) {
        console.log(error)
        res.status(500).json({
            error: error.message,
            reason: "endpoint not found, please refer to the endpoint: /v2/nsfw"
        })
        return res.end()
    }
}

exports.Ends = async (req, res, next) => {
    try {
        res.status(200).json({
            ass: "/v2/nsfw/img?end=ass",
            assgif: "/v2/nsfw/img?end=assgif",
            bbw: "/v2/nsfw/img?end=bbw",
            bdsm: "/v2/nsfw/img?end=bdsm",
            blow: "/v2/nsfw/img?end=blow",
            boobs: "/v2/nsfw/img?end=boobs",
            feet: "/v2/nsfw/img?end=feet",
            furfuta: "/v2/nsfw/img?end=furfuta",
            athighs: "/v2/nsfw/img?end=athighs",
            furgif: "/v2/nsfw/img?end=furgif",
            futa: "/v2/nsfw/img?end=futa",
            gifs: "/v2/nsfw/img?end=gifs",
            hass: "/v2/nsfw/img?end=hass",
            hboobs: "/v2/nsfw/img?end=hboobs",
            hentai: "/v2/nsfw/img?end=hentai",
            kink: "/v2/nsfw/img?end=kink",
            latex: "/v2/nsfw/img?end=latex",
            milk: "/v2/nsfw/img?end=milk",
            pantsu: "/v2/nsfw/img?end=pantsu",
            random: "/v2/nsfw/img?end=random",
            sex: "/v2/nsfw/img?end=sex",
            slime: "/v2/nsfw/img?end=slime",
            thighs: "/v2/nsfw/img?end=thighs",
            trap: "/v2/nsfw/img?end=trap",
            yuri: "/v2/nsfw/img?end=yuri",
            irlfemb: "/v2/nsfw/img?end=irlfemb",

        });
        return next()
    } catch (error) {
        console.log(error)
        res.status(500).json({
            error: error
        })
        return next()
    }
}