const Url = require('../../models/url-shortner')
const express = require('express')
const validUrl = require('valid-url')
const shortid = require('shortid');
const fetch = require('node-fetch');
    async function safetyCheck(urlLong) {
        let scanresult = await fetch(`https://api.phisherman.gg/v1/domains/${urlLong}`, {
            headers: {
                'Content-Type': `application/json`,
            },
            method: "get"
        }).then(res => res.text()).then(
            text => {
                return text;
            }
        )
        return scanresult;
    }
exports.create = async (req, res, next) => {
    const baseUrl = `${req.protocol}://${req.hostname}`;
  console.log(res.hostname+"|"+req.hostname)
    if (!req.session.loggedin) return res.json({ error: "true", message: "Forbidden: Must be logged in." })
    const {
        longUrl,
        userId,
        customCode
    } = req.body;
    if (!validUrl.isUri(baseUrl)) {
        return res.status(401).json('Invalid base URL.')
    }
    const apikey = req.session.apikey;
    let url = await Url.find({
        apikey
    })
    console.log(url.length)
    if (url.length >= 7) return res.json({ error: "true", message: "You may only create up to 6 Shortened URLs!" })
    console.log(req.body)
    const urlCode = customCode || shortid.generate()
    if (validUrl.isUri(longUrl)) {
        safetyCheck(longUrl.replace("https://", "").replace("http://", "")).then(async check => {
            console.log(check)
            if (check == 'true') {
                return res.json({ error: "true", message: "Forbidden: unsafe link." });
            }

            try {
                let url = await Url.findOne({
                    longUrl
                });
                if (url) {
                    res.json({ ShortURL: (url).shortUrl, code: (url).urlCode, longUrl: longUrl })
                } else {
                    const shortUrl = baseUrl + '/v2/short/r?' + urlCode
                    url = new Url({
                        longUrl,
                        shortUrl,
                        urlCode,
                        date: new Date(),
                        owner: apikey
                    })
                    await url.save()
                    res.json({ ShortURL: shortUrl, code: url.urlCode, longUrl: longUrl })

                }
            }

            catch (err) {
                console.log(err)
                res.status(500).json('Server Error')
            }
        })
    } else {
        const urlCode = longUrl;
        let urlDel = await Url.findOne({
            urlCode
        })
        console.log(urlDel?.owner)
        if (urlDel) {
            if (longUrl == urlDel.urlCode && apikey == urlDel.owner) {
                urlDel.deleteOne()
                return res.json("Successfully Deleted the URL!")
            } else {
                res.status(401).json('You do not have permission to delete this code!');
            }
        } else {
            res.status(401).json('Invalid longUrl or urlCode');
        }
    }
}

exports.info = async (req, res, next) => {
    try {
        const id = req.query.id

        if (!id) {
            res.status(400).json({
                error: 'No Url Provided in the query parameter.'
            })
            return
        }

        const data = await Url.findOne({ urlCode: id })
        if (!data) {
            res.status(400).json({
                error: 'No Url was found with that id.'
            })
            return
        }

        res.status(200).json({
            status: 'successful',
            data: {
                createdAt: data.date,
                clicks: data.clicks,
                url: data.longUrl,
                shortId: data.urlCode
            }
        })
    } catch (error) {
        res.status(500).json({
            error: error
        })
    }
}

exports.codes = async (req, res, next) => {
    try {
      console.log(req.query.code)
        const url = await Url.findOne({
            code: req.params.code
        })
        if (url) {
            return res.redirect(url.longUrl)
        } else {
            return res.status(404).json('No URL Found')
        }

    }
    catch (err) {
        console.error(err)
        res.status(500).json('Server Error')
    }

}
exports.update = async (req, res, next) => {
    try {
        const id = req.query.id
        const data = {}

        if (req.body.title) {
            data.title = req.body.title
        }

        if (req.body.url) {
            data.url = req.body.url
        }

        if (req.body.description) {
            data.description = req.body.description
        }

        if (req.body.logo) {
            data.logo = req.body.logo
        }

        const finder = await Url.findOne({ shortId: id })

        if (!finder) {
            res.status(404).json({
                message: 'No Short Url Found With That Id.',
                code: 404
            })
            return
        }

        let Auth = req.headers.authorization
        if (!Auth) {
            Auth = req.query.apikey
        }

        const apikey = await apikeys.findOne({ apikey: Auth })

        if (finder.owner != apikey.apikey) {
            res.status(401).json({
                message: 'You are not owner of this short url.',
                code: 401
            })
            return
        }

        await Url.findOneAndUpdate({ shortId: finder.shortId }, data)

        const newData = await Url.findOne({ shortId: finder.shortId })
        res.status(200).json({
            status: 'successful',
            data: {
                createdAt: newData.createdAt,
                clicks: newData.clicks,
                title: newData.title,
                url: newData.url,
                logo: newData.logo,
                description: newData.description,
                shortId: newData.shortId
            }
        })
    } catch (error) {
        res.status(500).json({
            error: error
        })
    }
    }
