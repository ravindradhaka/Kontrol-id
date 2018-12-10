let nodemailer = require('nodemailer');
let ses = require('nodemailer-ses-transport');
let transporter = nodemailer.createTransport(ses({
    accessKeyId: 'AKIAIOPHUPBWAKKANBHA',
    secretAccessKey: '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'
}));
module.exports = transporter;
