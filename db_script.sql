CREATE TABLE reviews (
    id bigint,
    meal character varying,
    review character varying,
    review_date character varying
);

CREATE SEQUENCE reviews_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER SEQUENCE reviews_id_seq OWNED BY reviews.id;
ALTER TABLE reviews ALTER COLUMN id SET DEFAULT nextval('reviews_id_seq'::regclass);