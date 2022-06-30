const APIKEYS = require('../../models/apikeys')
const Urls = require('../../models/url-shortner')

const { uuid } = require('../Utilities/functions')

exports.login = async (req, res, next) => {
   if (req.session.loggedin) return res.redirect("/@me/dash")
    res.render("login");
}

exports.dash = async (req, res, next) => {
  let user = req.session.email
  let key = req.session.apikey
    if (req.session.loggedin) {
        // Output username
      let usr = await APIKEYS.find({
            apikey: key
        })
      let url = await Urls.find({
            owner: key
        })
      console.log(url)
      if (usr) res.render("shorten", { req: req, current: user, user: usr, urls: url || []})
    } else {
        // Not logged in
      res.redirect("/@me")
    }
    res.end();
}
exports.home = async (req, res, next) => {
    if (req.session.loggedin) {
        // Output username
        res.send('Welcome back, ' + req.session.email + '!');
    } else {
        // Not logged in
        res.redirect('/@me');
    }
    res.end();
}
exports.auth = async (req, res, next) => {
    // Capture the input fields
    let username = req.body.username;
    let password = req.body.password;
    // Ensure the input fields exists and are not empty
    if (username && password) {
        let usr = await APIKEYS.find({
            apikey: password
        });
        let url = await APIKEYS.findOne({
            owner: password
        })
        try {
            if (usr !==  null && usr.length > 0) {
                req.session.loggedin = true;
                req.session.email = username;
                req.session.apikey = password;
                if (usr) res.redirect("/@me/dash")
            } else {
              console.log(usr)
                res.send('Incorrect Email and/or Password!');
            }


        } catch (error) {
            throw error
        }
    } else {
        res.send('Please enter Email and Password!');
        res.end();

    }
}