# ===== Stage 1: Development =====
FROM dhi.io/node:22-alpine3.23-dev AS dev

RUN addgroup stayon && adduser -S -G stayon stayon
WORKDIR /app/
COPY --chown=stayon package*.json ./
RUN npm install
COPY --chown=stayon . .
ENV NODE_ENV=development
EXPOSE 4000
USER stayon
CMD ["npm", "run", "start", "--", "--host", "0.0.0.0", "--port", "4000"]

# ===== Stage 2: Build =====
FROM dhi.io/node:22-alpine3.23-dev AS build

WORKDIR /app/
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# ===== Stage 3: Production =====
FROM dhi.io/nginx:1.28-alpine3.23 AS prod

COPY --from=build /app/dist/stay-on-frontend/browser /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["-g", "daemon off;"]
