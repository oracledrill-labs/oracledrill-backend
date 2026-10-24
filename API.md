# Local API

- GET /health: service identity; signing disabled.
- GET /sample: synthetic failure corpus.
- POST /review: corpus JSON; 201 with bounded scenario results and input digest.
- GET /runs: up to 100 in-memory run summaries.
- GET /runs/:id: review readback.

Expected JSON fields are demonstrated by ../oracledrill-fixtures/index.mjs. Invalid corpus 400, missing run 404, wrong content type 415, body over 1 MiB 413, rejected Host/Origin 403. Prices use decimal strings, not floating point. The server has no signing/submission endpoint.
