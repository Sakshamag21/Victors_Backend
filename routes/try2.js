const Sib = require('sib-api-v3-sdk')

require('dotenv').config()

const client = Sib.ApiClient.instance

const apiKey = client.authentications['api-key']
apiKey.apiKey = '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'

const sender = {
	email: 'sakshamag21@iitk.ac.in',
	// name: 'Anjan Shomodder',
}

const recivers = [
	{
		email: 'sakshamag277@gmail.com',
	},
]

const transactionalEmailApi = new Sib.TransactionalEmailsApi()

transactionalEmailApi
	.sendTransacEmail({
		subject: 'Subscribe to Cules Coding to become a developer',
		sender,
		to: recivers,
		// textContent: `Cules Coding will teach you how to become a {{params.role}} developer.`,
		htmlContent: `
			<h1>Become a {{params.role}} developer</h1>
			<a href='https://cules-coding.vercel.app/'>Cules Coding</a>
		`,
		params: {
			role: 'frontend',
		},
	})
	.then(console.log)
	.catch(console.log)
