import { pool } from '../db.js'; 
import { redisClient } from '../index.js';

const validateCarData = (data) => {
    if (!data.name || typeof data.name !== 'string') {
        return { valid: false, message: "Invalid or missing 'name'" };
    }
    if (!data.brand || typeof data.brand !== 'string') {
        return { valid: false, message: "Invalid or missing 'brand'" };
    }
    if (!data.model || typeof data.model !== 'number') {
        return { valid: false, message: "Invalid or missing 'model'" };
    }
    if (!data.price || typeof data.price !== 'number') {
        return { valid: false, message: "Invalid or missing 'price'" };
    }
    return { valid: true };
};

export const getCars = async (req, res) => {
    try {
        const cachedCars = await redisClient.get('cars');

        if (cachedCars) {
            return res.status(200).json(JSON.parse(cachedCars));
        }

        const { rows } = await pool.query("SELECT * FROM cars");

   
        await redisClient.set('cars', JSON.stringify(rows), {
            EX: 600 // 10 minutos
        });

        res.status(200).json(rows);
    } catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
};

export const getCarById = async (req, res) => {
    const { id } = req.params;

    try {
        const cachedCar = await redisClient.get(`car:${id}`);

        if (cachedCar) {
            return res.status(200).json(JSON.parse(cachedCar));
        }

        const { rows } = await pool.query("SELECT * FROM cars WHERE id = $1", [id]);

        if (rows.length === 0) {
            return res.status(404).json({ alert: "Car not found" });
        }

        await redisClient.set(`car:${id}`, JSON.stringify(rows[0]), {
            EX: 600 //10 minutos
        });

        res.status(200).json(rows[0]);
    } catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
};

export const getCarByBrand = async (req, res) => {
    const { brand } = req.params;
    try {
      const cachedCars = await redisClient.get(`cars:brand:${brand}`);
      if (cachedCars) {
        return res.status(200).json(JSON.parse(cachedCars));
      }
      
      const { rows } = await pool.query("SELECT * FROM cars WHERE brand = $1", [brand]);
      if (rows.length === 0) {
        return res.status(404).json({ alert: "Cars not found for the specified brand" });
      }
  
      await redisClient.set(`cars:brand:${brand}`, JSON.stringify(rows), {
        EX: 600 // 10 minutos
      });
      
      res.status(200).json(rows);
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  };

  export const getCarByModel = async (req, res) => {
    const { model } = req.params;
    try {
      const cachedCars = await redisClient.get(`cars:model:${model}`);
      if (cachedCars) {
        return res.status(200).json(JSON.parse(cachedCars));
      }
      
      const { rows } = await pool.query("SELECT * FROM cars WHERE model = $1", [model]);
      if (rows.length === 0) {
        return res.status(404).json({ alert: "Cars not found for the specified model" });
      }
  
      await redisClient.set(`cars:model:${model}`, JSON.stringify(rows), {
        EX: 600 // 10 minutos
      });
      
      res.status(200).json(rows);
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  };
  

    
export const createCar = async (req, res) => {
    const data = req.body;
    const validation = validateCarData(data);

    if (!validation.valid) {
        return res.status(400).json({ error: validation.message });
    }

    try {
        const { rows } = await pool.query(
            "INSERT INTO cars (name, brand, model, price) VALUES ($1, $2, $3, $4) RETURNING *", 
            [data.name, data.brand, data.model, data.price]
        );

        await redisClient.del('cars');

        res.status(201).json(rows[0]);
    } catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
};


export const deleteCar = async (req, res) => {
    const { id } = req.params;

    try {
        const { rowCount } = await pool.query("DELETE FROM cars WHERE id = $1", [id]);

        if (rowCount === 0) {
            return res.status(404).json({ alert: "Car not found" });
        }

        await redisClient.del(`car:${id}`);
        await redisClient.del('cars');

        return res.sendStatus(204);
    } catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
};

export const updateCar = async (req, res) => {
    const { id } = req.params;
    const data = req.body;
    const validation = validateCarData(data);

    if (!validation.valid) {
        return res.status(400).json({ error: validation.message });
    }

    try {
        const { rows } = await pool.query(
            "UPDATE cars SET name = $1, brand = $2, model = $3, price = $4 WHERE id = $5 RETURNING *", 
            [data.name, data.brand, data.model, data.price, id]
        );

        if (rows.length === 0) {
            return res.status(404).json({ alert: "Car not found" });
        }

        await redisClient.del(`car:${id}`);
        await redisClient.del('cars');

        res.status(200).json(rows[0]);
    } catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
};