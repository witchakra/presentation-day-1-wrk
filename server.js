const express = require('express');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const connectDB = require('./config/db');
const mongoSanitize = require('express-mongo-sanitize');
const helmet = require('helmet');
const {xss} = require('express-xss-sanitizer');
const rateLimit = require('express-rate-limit');
const hpp = require('hpp');
const cors = require('cors');
const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUI = require('swagger-ui-express');
// Load env var
dotenv.config({path: './config/config.env'});

// Connect DB
connectDB();

// Route
const coWorks = require('./routes/coWork');
const app = express();
const auth = require('./routes/auth');
const reservations = require('./routes/reservations');

// Body parser
app.use(express.json());

//Sanitize data
app.use(mongoSanitize());

//Set security headers
app.use(helmet());

//Prevent XSS attacks
app.use(xss());

//Cookie parser
app.use(cookieParser());

//Rate Limiting
const limiter = rateLimit({
	windowsMs: 10 * 60 * 1000, //10 mins
	max: 100,
});
app.use(limiter);

//Prevent http param pollutions
app.use(hpp());

//Enable CORS
app.use(cors());

app.use('/api/v1/coWorks', coWorks);
app.use('/api/v1/auth', auth);
app.use('/api/v1/reservations', reservations);

const PORT = process.env.PORT;

const server = app.listen(
	PORT,
	console.log(
		'Server running in ',
		process.env.NODE_ENV,
		' mode on port ',
		PORT
	)
);

const swaggerOptions = {
	swaggerDefinition: {
		openapi: '3.0.0',
		info: {
			title: 'Library API',
			version: '1.0.0',
			description: 'A simple Express VacQ API',
		},
		servers: [
			{
				url: 'http://localhost:5000/api/v1',
			},
		],
	},
	apis: ['./routes/*.js'],
};
const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerDocs));

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
	console.log(`Error: ${err.message}`);

	// Close server & Exit process
	server.close(() => process.exit(1));
});
