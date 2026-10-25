# Backend monitoring

The Express backend exposes:

- `GET /health/live`: liveness probe; returns `200` while the process can answer.
- `GET /health/ready`: readiness probe; returns `200` only when the existing
  Mongoose connection is connected and the existing Redis client responds to
  `PING`. Otherwise it returns `503`.
- `GET /metrics`: Prometheus text exposition, protected by a bearer token.

Set a long, random `METRICS_TOKEN` in the backend environment before scraping.
The endpoint returns `503` until the token is configured and `401` when a
request does not present the configured token. Do not put the token in a URL,
logs, or source control.

For a local Docker Compose deployment, place the token in the root `.env` file:

```env
METRICS_TOKEN=replace-with-a-long-random-secret
```

Then configure Prometheus to scrape the backend from a trusted network and send
the token as an HTTP bearer credential:

```yaml
scrape_configs:
  - job_name: university-management-backend
    metrics_path: /metrics
    static_configs:
      - targets: ["backend:5000"]
    authorization:
      type: Bearer
      credentials_file: /etc/prometheus/secrets/metrics-token
```

The credentials file should contain only the token and be mounted into the
Prometheus container with restrictive permissions. Do not expose this HTTP
endpoint to an untrusted network; use private networking or terminate HTTPS at
a trusted reverse proxy.

Metrics include default Node.js process/runtime collectors and the following
request series:

- `http_requests_total{method,route,status_code}`
- `http_request_duration_seconds{method,route,status_code}`

Labels use HTTP methods from a fixed allowlist (other methods become `OTHER`),
Express route templates (unmatched paths become `unmatched`), and status
classes such as `2xx` and `5xx`. The `/metrics` scrape itself is excluded from
request metrics. Request and error logs use the same route templates and do
not include raw URLs, query strings, IP addresses, user agents, user IDs,
request bodies, or exception messages/stacks.
