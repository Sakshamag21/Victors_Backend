const express = require('express');
const router = express.Router();
const Sib = require('sib-api-v3-sdk')

require('dotenv').config()

const client = Sib.ApiClient.instance

const apiKey = client.authentications['api-key']
apiKey.apiKey = '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'




// Route to handle POST requests
router.post('/otp-verification', (req, res) => {
    console.log("otp sended")
    const {otp,email} = req.body;
    const sender = {
        email: 'sakshamag21@iitk.ac.in',
        name: 'Saksham Agarwal',
    }
    const recivers = [{email: email,},]

    const transactionalEmailApi = new Sib.TransactionalEmailsApi()

    transactionalEmailApi
        .sendTransacEmail({
            subject: 'OTP for verification',
            sender,
            to: recivers,
            textContent: `OTP for verification is {{params.otp}}`,
            params: {
                otp: otp,
            },
        })
        .then(response => {
            if (response.messageId) {
                res.status(200).json({ message: 'Data sended successfully' });
            } else {
                res.status(500).json({ error: 'Unexpected response from email service' });
            }
        })
        .catch(error => {
            console.error('Error sending email:', error);
            res.status(500).json({ error: 'Internal server error' });
        });
});

router.post('/query-mail', (req, res) => {
    const {name,email,message} = req.body;
    
    const recivers = [{email: 'sakshamag277@gmail.com',},]
    const sender = {
        email: email,
        name: name,
    }
    const transactionalEmailApi = new Sib.TransactionalEmailsApi()

    transactionalEmailApi
        .sendTransacEmail({
            subject: 'Query Related to Victors',
            sender,
            to: recivers,
            textContent: `Message:- {{params.message}}`,
            params: {
                message: message,
            },
        })
        .then(response => {
            if (response.messageId) {
                res.status(200).json({ message: 'Data sended successfully' });
            } else {
                res.status(500).json({ error: 'Unexpected response from email service' });
            }
        })
        .catch(error => {
            console.error('Error sending email:', error);
            res.status(500).json({ error: 'Internal server error' });
        });
});

router.post('/password-mail', (req, res) => {
    const {password,email,name} = req.body;
    const sender = {
        email: 'sakshanag277@gamil.com',
        name: 'Saksham Agarwal',
    }
    const recivers = [{email: email,},]

    const transactionalEmailApi = new Sib.TransactionalEmailsApi()

    transactionalEmailApi
        .sendTransacEmail({
            subject: 'Password for Victors',
            sender,
            to: recivers,
            textContent: `Your Password is {{params.password}} and your name is {{params.name}}`,
            params: {
                password: password,
                name:name,
            },
        })
        .then(response => {
            if (response.messageId) {
                res.status(200).json({ message: 'Data sended successfully' });
            } else {
                res.status(500).json({ error: 'Unexpected response from email service' });
            }
        })
        .catch(error => {
            console.error('Error sending email:', error);
            res.status(500).json({ error: 'Internal server error' });
        });
});




module.exports = router;
