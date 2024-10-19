CREATE TABLE cars (
    id SERIAL PRIMARY KEY,
    name VARCHAR(20) NOT NULL,
    brand VARCHAR(20) NOT NULL,
    model SMALLINT NOT NULL,
    price INTEGER NOT NULL
);

select * FROM cars;

INSERT INTO cars (name, brand, model, price)
    VALUES ('Y',
            'Tesla',
             '2024',
             '1200000'
           );

