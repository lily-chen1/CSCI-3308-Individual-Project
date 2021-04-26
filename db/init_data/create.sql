DROP TABLE IF EXISTS reviews CASCADE;
CREATE TABLE IF NOT EXISTS reviews (
    id SERIAL PRIMARY KEY,
    meal character varying,
    review character varying,
    review_date character varying
);