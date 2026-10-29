# --- build: static single page app + nginx config from the robot configs ---
# Vite 8 / SvelteKit 3 need Node >= 20.19; pin a digest for reproducible builds
FROM node:22-alpine AS build
WORKDIR /app
COPY ./svelte-ui/package.json ./svelte-ui/package-lock.json ./
RUN npm i -D && npm ci
COPY ./svelte-ui/. .
# replace the data symlink with the configs the UI is built for
RUN rm -rf src/lib/data && mkdir src/lib/data
COPY ./controller-web/data/*.yaml src/lib/data/
RUN npm run build && node deploy/nginx-config.js > default.conf.template

# --- runtime ---
# 1.27+ for the current config syntax; pin a digest for reproducible builds
FROM nginx:1.28-alpine
COPY --from=build /app/build /usr/share/nginx/html
# rendered to /etc/nginx/conf.d/default.conf at start, filling in ${VITE_BACKEND_URI}
COPY --from=build /app/default.conf.template /etc/nginx/templates/default.conf.template
COPY ./svelte-ui/deploy/backend_command.inc ./svelte-ui/deploy/backend_telemetry.inc /etc/nginx/conf.d/
# controller-web on the same host; set to its service name in a compose network
ENV VITE_BACKEND_URI=127.0.0.1
EXPOSE 9090
HEALTHCHECK --interval=10s --timeout=3s --retries=3 \
    CMD wget -q -O /dev/null http://127.0.0.1:9090/healthz || exit 1
