const APIKEYS = require('../../models/apikeys')
const { uuid } = require('../Utilities/functions')

exports.newAPIKEY = async (req, res, next) => {
    try {
        const { email } = req.body

        const blockedExtentions = require('../../blocked/extensions').extensions
        const blockedDomains = require('../../blocked/domains').domains
        var nodemailer = require('nodemailer');
        var sendinBlue = require('nodemailer-sendinblue-transport');
        const domain = email.split('@')[1]

        if (blockedDomains.includes(domain)) {
            return res.render('main', { message: 'domain' })
        }

        let extension = domain.split('.')
        extension = extension[extension.length - 1]

        if (blockedExtentions.includes(`.${extension}`)) {
            return res.render('main', { message: 'extension' })
        }

        const key = uuid()

        const data = await APIKEYS.create({
            email,
            apikey: key
        })
        const nodeMailer = require("nodemailer");
        let transporter = nodeMailer.createTransport({
            host: process.env.EMAIL_HOST_SMTP,
            secure: true,
            port: process.env.EMAIL_HOST_PORT,
            auth: {
                user: process.env.EMAIL_ADDRESS,
                pass: process.env.EMAIL_PASSWORD,
            },
        });
        if (process.env.SEND_EMAIL == 'true') {
          require("fs").readFile('views/email.ejs', async function (err, data) {
                const mailOptions = {
                    from: process.env.EMAIL_ADDRESS,
                    to: email,
                    subject: "Your API Key for: " + process.env.EMAIL_ADDRESS.split("@")[1], // Subject line
                    html: (data.toString().replace(/(?:ThisIsAHostNamePlaceHolder)/g, process.env.EMAIL_ADDRESS.split("@")[1]).replace("ThisIsAnAPIkeyPlaceHolder", key).replace(/(?:ThisIsAnEmailPlaceHolder)/g, email)),
                };
                await transporter.sendMail(mailOptions, function (err, info) {
                    if (err) {
                        console.log(err)
                    }
                })
            })
        }
        res.render('main', { message: 'success', key })
    } catch (error) {
        console.log(error)
        if (error.code === 11000) {
            res.render('main', { message: 'duplicate' });
        } else {
            res.status(500).json({
                error: error
            })
        }
    }
}