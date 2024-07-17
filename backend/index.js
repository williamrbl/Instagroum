/*
dependencies
*/

const express = require("express")
const cors = require("cors")

const admin = require("firebase-admin")
let inspect = require("util").inspect
let busboy = require("busboy")
let path = require("path")
let os = require("os")
let fs = require("fs")
let UUID = require("uuid-v4")
const nodemailer = require("nodemailer")
const bodyParser = require("body-parser")
require("dotenv").config({path: "./.env"})

/*
config express
*/

const app = express()
app.use(bodyParser.json())
app.use(cors())
app.use(express.json())

/*
config firebase
*/

const serviceAccount = JSON.parse(process.env.VUE_APP_serviceAccountKey)

admin.initializeApp({
	credential: admin.credential.cert(serviceAccount),
	storageBucket: process.env.VUE_APP_STORAGE_BUCKET,
})

const db = admin.firestore()
let bucket = admin.storage().bucket()

/*
endpoint - posts
*/

app.get("/posts", (request, response) => {
	response.set("Access-Control-Allow-Origin", "*")
	let posts = []
	db.collection("posts")
		.orderBy("date", "desc")
		.get()
		.then((snapshot) => {
			snapshot.forEach((doc) => {
				posts.push(doc.data())
			})
			response.send(posts)
		})
})

/*
endpoint - create posts
*/

// Define route handler for handling POST requests to "/createpost"
app.post("/createpost", (req, res) => {
	// Set CORS headers to allow requests from any origin
	res.set("Access-Control-Allow-Origin", "*")

	// Generate a UUID for use in Firebase Storage
	let uuid = UUID()

	// Initialize a 'busboy' instance to handle file uploads from the request
	var bb = busboy({headers: req.headers})

	// Initialize objects to store field data and file data
	let fields = {}
	let fileData = {}

	// Event listener for handling files parsed by 'busboy'
	bb.on("file", (name, file, info) => {
		// Extract file information and log it
		const {filename, encoding, mimeType} = info
		console.log(
			`File [${name}]: filename: %j, encoding: %j, mimeType: %j`,
			filename,
			encoding,
			mimeType
		)

		// Generate a filepath for temporary storage of the file
		let filepath = path.join(os.tmpdir(), filename)

		// Pipe the file stream to a write stream to save it to the temporary directory
		file.pipe(fs.createWriteStream(filepath))

		// Store file metadata and filepath
		fileData = {filepath, mimeType}
	})

	// Event listener for handling fields parsed by 'busboy'
	bb.on("field", (fieldname, val, info) => {
		// Store field data in the 'fields' object
		fields[fieldname] = val
	})

	// Event listener triggered when 'busboy' finishes parsing the request
	bb.on("close", () => {
		// Upload the file to Firebase Storage using Google Cloud Storage API
		bucket.upload(
			fileData.filepath,
			{
				uploadType: "media",
				metadata: {
					metadata: {
						contentType: fileData.mimeType,
						firebaseStorageDownloadTokens: uuid,
					},
				},
			},
			// Callback function executed after file upload
			(err, uploadedFile) => {
				if (!err) {
					// Call function to create a document in Firestore database
					createDocument(uploadedFile)
				}
			}
		)

		// Function to create a document in Firestore database
		function createDocument(uploadedFile) {
			db.collection("posts")
				.doc(fields.id)
				.set({
					id: fields.id,
					caption: fields.caption,
					location: fields.location,
					date: parseInt(fields.date),
					// Construct image URL using Firebase Storage URL and UUID
					imageUrl: `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${uploadedFile.name}?alt=media&token=${uuid}`,
				})
				// Send response after document creation
				.then(() => {
					res.send("Post added : " + fields.id)
				})
		}
	})

	// Pipe the incoming request stream to 'busboy' for parsing
	req.pipe(bb)
})

/*
  endpoint - delete a post
*/

app.post("/deletepost", (req, res) => {
	const postId = req.body.id

	if (!postId) {
		return res.status(400).send("Post ID is required")
	}

	db.collection("posts")
		.doc(postId)
		.delete()
		.then(() => {
			const filePath = `${postId}.png`
			bucket
				.file(filePath)
				.delete()
				.then(() => {
					res.send(
						`Post ${postId} and corresponding image deleted successfully`
					)
				})
				.catch((error) => {
					console.error("Error deleting file from Firebase Storage:", error)
					res.status(501).send("Error deleting file from Firebase Storage")
				})
		})
		.catch((error) => {
			console.error("Error deleting post from Firestore:", error)
			res.status(500).send("Error deleting post from Firestore")
		})
})

/*
endpoint - get accounts
*/

app.get("/getaccounts", (request, response) => {
	response.set("Access-Control-Allow-Origin", "*")
	let accounts = []
	db.collection("accounts")
		.orderBy("username", "asc")
		.get()
		.then((snapshot) => {
			snapshot.forEach((doc) => {
				accounts.push(doc.data())
			})
			response.send(accounts)
		})
})

/*
endpoint - edit caption
*/

app.post("/editcaption", (req, res) => {
	const postId = req.body.id
	const newCaption = req.body.newcaption

	db.collection("posts")
		.doc(postId)
		.update({caption: newCaption})
		.then(() => {
			res.status(200).send({message: "Caption updated successfully"})
		})
		.catch((error) => {
			console.error("Error updating caption: ", error)
			res.status(500).send({error: "Failed to update caption"})
		})
})

/*
endpoint - createaccount
*/

app.post("/createaccount", (req, res) => {
	// Set CORS headers to allow requests from any origin
	res.set("Access-Control-Allow-Origin", "*")

	let uuid = UUID()

	// Initialize a 'busboy' instance to handle file uploads from the request
	var bb = busboy({headers: req.headers})

	// Initialize objects to store field data and file data
	let fields = {}
	let fileData = {}

	// Event listener for handling files parsed by 'busboy'
	bb.on("avatar", (name, file, info) => {
		// Extract file information and log it
		const {filename, encoding, mimeType} = info
		console.log(
			`File [${name}]: filename: %j, encoding: %j, mimeType: %j`,
			filename,
			encoding,
			mimeType
		)

		// Generate a filepath for temporary storage of the file
		let filepath = path.join(os.tmpdir(), filename)

		console.log(filepath)

		// Pipe the file stream to a write stream to save it to the temporary directory
		file.pipe(fs.createWriteStream(filepath))

		// Store file metadata and filepath
		fileData = {filepath, mimeType}
	})

	// Event listener for handling fields parsed by 'busboy'
	bb.on("field", (fieldname, val, info) => {
		// Store field data in the 'fields' object
		fields[fieldname] = val
	})

	// Event listener triggered when 'busboy' finishes parsing the request
	bb.on("close", () => {
		// Upload the file to Firebase Storage using Google Cloud Storage API

		bucket.upload(
			fileData.filepath,
			{
				uploadType: "media",
				metadata: {
					metadata: {
						contentType: fileData.mimeType,
						firebaseStorageDownloadTokens: uuid,
					},
				},
			},
			// Callback function executed after file upload
			(err, uploadedFile) => {
				if (!err) {
					// Call function to create a document in Firestore database
					createDocument(uploadedFile)
				}
			}
		)

		// Function to create a document in Firestore database
		function createDocument(uploadedFile) {
			db.collection("accounts")
				.doc(fields.username)
				.set({
					username: fields.username,
					email: fields.email,
					password: fields.password,
					// Construct image URL using Firebase Storage URL and UUID
					avatar: `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${uploadedFile.name}?alt=media&token=${uuid}`,
				})
				// Send response after document creation
				.then(() => {
					res.send("Account added : " + fields.username)
				})
		}
	})

	// Pipe the incoming request stream to 'busboy' for parsing
	req.pipe(bb)
})

/*
endpoint - send email
*/

const transporter = nodemailer.createTransport({
	service: process.env.VUE_APP_MAIL_SERVICE,
	host: `smtp.${process.env.VUE_APP_MAIL_SERVICE}.${process.env.VUE_APP_SERVICE_EXTENSION}`,
	port: 587,
	secure: false,
	auth: {
		user: process.env.VUE_APP_EMAIL_USER,
		pass: process.env.VUE_APP_EMAIL_PASS,
	},
})

app.post("/send-email", (req, res) => {
	console.log("transporter : ", transporter)
	const {recipient, subject, message, html} = req.body
	if (!recipient || !subject || !(message || html)) {
		console.log("error missing something")
	}
	const mailOptions = {
		from: process.env.VUE_APP_EMAIL_USER,
		to: recipient,
		subject: subject,
		text: message,
		html: html,
	}

	transporter.sendMail(mailOptions, (error, info) => {
		if (error) {
			return res.status(500).send(error.toString())
		}
		res.status(200).send("Email sent: " + info.response)
	})
})

/*
listen
*/

app.listen(3000)
