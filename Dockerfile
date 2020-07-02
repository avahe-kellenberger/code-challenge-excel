FROM mysql AS whitebox
COPY ./data.sql.gz /docker-entrypoint-initdb.d/data.sql.gz

