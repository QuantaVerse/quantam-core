-- Table: public.stock_data

-- DROP TABLE public.stock_data;

CREATE TABLE public.stock_data
(
    uid character varying COLLATE pg_catalog."default" NOT NULL,
    symbol character varying COLLATE pg_catalog."default" NOT NULL,
    "interval" integer NOT NULL,
    "timestamp" timestamp without time zone NOT NULL,
    open double precision NOT NULL,
    close double precision NOT NULL,
    high double precision NOT NULL,
    low double precision NOT NULL,
    volume integer NOT NULL,
    source character varying COLLATE pg_catalog."default" NOT NULL,
    valid boolean NOT NULL,
    "createdTime" timestamp without time zone NOT NULL,
    CONSTRAINT "PK_eaffa7ac91c44124acfb262e3b3" PRIMARY KEY (symbol, "interval", "timestamp")
)
WITH (
    OIDS = FALSE
)
TABLESPACE pg_default;

ALTER TABLE public.stock_data
    OWNER to quantam_admin;

-- This creates a hypertable that is partitioned by time
-- using the values in the `timestamp` column.

SELECT create_hypertable('stock_data', 'timestamp', migrate_data := true);
