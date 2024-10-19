import {Router} from 'express'
import { getCars, getCarById , createCar, deleteCar, updateCar, getCarByBrand, getCarByModel} from '../controllers/cars.controlles.js';

const router = Router();

/**
 * @swagger
 * /cars:
 *   get:
 *     summary: Obtener todos los coches
 *     tags: [Cars]
 *     responses:
 *       200:
 *         description: Lista de coches
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   name:
 *                     type: string
 *                   brand:
 *                     type: string
 *                   model:
 *                     type: integer
 *                   price:
 *                     type: number
 *                     format: float
 */
router.get('/cars', getCars);

/**
 * @swagger
 * /cars/{id}:
 *   get:
 *     summary: Obtener un coche por ID
 *     tags: [Cars]
 *     parameters:
 *       - name: id
 *         in: path
 *         description: ID del coche
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Un coche encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 name:
 *                   type: string
 *                 brand:
 *                   type: string
 *                 model:
 *                   type: integer
 *                 price:
 *                   type: number
 *                   format: float
 *       404:
 *         description: Coche no encontrado
 */
router.get('/cars/id/:id', getCarById);

/**
 * @swagger
 * /cars/brand/{brand}:
 *   get:
 *     summary: Obtener coches por marca
 *     tags: [Cars]
 *     parameters:
 *       - name: brand
 *         in: path
 *         description: Marca del coche
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Coches encontrados por la marca especificada
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   name:
 *                     type: string
 *                   brand:
 *                     type: string
 *                   model:
 *                     type: integer
 *                   price:
 *                     type: number
 *                     format: float
 *       404:
 *         description: Coches no encontrados para la marca especificada
 */
router.get('/cars/brand/:brand', getCarByBrand);

/**
 * @swagger
 * /cars/model/{model}:
 *   get:
 *     summary: Obtener coches por modelo
 *     tags: [Cars]
 *     parameters:
 *       - name: model
 *         in: path
 *         description: Modelo del coche
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Coches encontrados por el modelo especificado
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   name:
 *                     type: string
 *                   brand:
 *                     type: string
 *                   model:
 *                     type: integer
 *                   price:
 *                     type: number
 *                     format: float
 *       404:
 *         description: Coches no encontrados para el modelo especificado
 */
router.get('/cars/model/:model', getCarByModel);

router.post('/cars', createCar);

router.delete('/cars/:id', deleteCar)

router.put('/cars/:id', updateCar);

export default router;