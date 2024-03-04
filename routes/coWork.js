const express = require('express');
const {
	getCoWorks,
	getCoWork,
	createCoWork,
	updateCoWork,
	deleteCoWork,
} = require('../controllers/coWorks');

//Include other resource routers
const reservationRouter = require('./reservations');

const router = express.Router();

const {protect, authorize} = require('../middleware/auth');

//Re-route into other resource routers
router.use('/:coWorkId/reservations/', reservationRouter);

router
	.route('/')
	.get(getCoWorks)
	.post(protect, authorize('admin'), createCoWork);
router
	.route('/:id')
	.get(getCoWork)
	.put(protect, authorize('admin'), updateCoWork)
	.delete(protect, authorize('admin'), deleteCoWork);

module.exports = router;

/**
 * @swagger
 * components:
 *  schemas:
 *    CoWork:
 *      type: object
 *      required:
 *      - name
 *      - address
 *      properties:
 *        id:
 *          type: string
 *          format: uuid
 *          description: The auto-generated id of the coWork
 *          example: 65d329cf1e100dca68e70016
 *        ลำดับ:
 *          type: string
 *          description: Ordinal number
 *        name:
 *          type: string
 *          description: CoWork name
 *        address:
 *          type: string
 *          description: House No., Street, Road
 *        district:
 *          type: string
 *          description: District
 *        province:
 *          type: string
 *          description: Province
 *        postalcode:
 *          type: string
 *          description: 5-digit postal code
 *        tel:
 *          type: string
 *          description: Telephone number
 *        region:
 *          type: string
 *          description: Region
 *      example:
 *        id: 65d329cf1e100dca68e70016
 *        ลำดับ: 5
 *        name: เจ้าพระยา
 *        address: 113/44 ถ.พระบรมราชชนนี บางบำหรุ
 *        district: บางพลัด
 *        province: กรุงเทพมหานคร
 *        postalcode: 10700
 *        tel: 02-4340117
 *        region: กรุงเทพมหานคร (Bangkok)
 */

/**
 * @swagger
 * tags:
 *  name: CoWorks
 *  description: The coWorks managing API
 */

/**
 * @swagger
 * /coWorks:
 *  get:
 *    summary: Returns the list of all the coWorks
 *    tags: [CoWorks]
 *    responses:
 *      200:
 *        description: The list of the coWorks
 *        content:
 *          application/json:
 *            schema:
 *              type: array
 *              items:
 *                $ref: '#/components/schemas/CoWork'
 *  post :
 *    summary : Create a new coWork
 *    tags : [CoWorks]
 *    requestBody :
 *      required : true
 *      content :
 *        application/json :
 *          schema :
 *            $ref : '#/components/schemas/CoWork'
 *    responses :
 *      201 :
 *        description : The coWork was successfully creadted
 *        content :
 *          application/json :
 *            schema :
 *              $ref : '#/components/schemas/CoWork'
 *      500 :
 *        description : Some server error
 *
 * /coWorks/{id}:
 *  get:
 *    summary: Get the coWork by id
 *    tags: [CoWorks]
 *    parameters:
 *      - in: path
 *        name: id
 *        schema:
 *          type: string
 *        require: true
 *        description: The coWork id
 *    responses:
 *      200:
 *        description: The coWork description by id
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/CoWork'
 *      404:
 *        description: The coWork was not found
 *  put:
 *    summary: Update the coWork by the id
 *    tags: [CoWorks]
 *    parameters:
 *      - in: path
 *        name: id
 *        schema:
 *          type: string
 *        require: true
 *        description: The coWork id
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/CoWork'
 *    responses:
 *      200:
 *        description: The coWork was updated
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/CoWork'
 *      404:
 *        description: The coWork was not found
 *      500:
 *        description: Some error happened
 *  delete:
 *    summary: Remove the coWork by id
 *    tags: [CoWorks]
 *    parameters:
 *      - in: path
 *        name: id
 *        schema:
 *          type: string
 *        require: true
 *        description: The coWork id
 *    responses:
 *      200:
 *        description: The coWork was deleted
 *      404:
 *        description: The coWork was not found
 *
 */
