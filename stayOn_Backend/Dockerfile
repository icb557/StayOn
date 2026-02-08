# ===== Stage 1: Development =====
FROM dhi.io/node:22-alpine3.23-dev AS dev

RUN addgroup stayon && adduser -S -G stayon stayon
WORKDIR /app/
COPY --chown=stayon package*.json ./
RUN npm install
COPY --chown=stayon . .
ENV NODE_ENV=development
EXPOSE 3000
USER stayon
CMD ["sh", "-c", "npm run sync && npm run dev"]

# ===== Stage 2: Production dependencies =====
# Uses -dev image because bcrypt needs native compilation tools
FROM dhi.io/node:22-alpine3.23-dev AS deps

WORKDIR /app/
COPY package*.json ./
RUN npm ci --omit=dev

# ===== Stage 3: Production =====
# Hardened image: no shell, no package manager. Use built-in 'node' user.
FROM dhi.io/node:22-alpine3.23 AS prod

WORKDIR /app/
COPY --from=deps /app/node_modules ./node_modules
COPY --chown=node:node package.json ./
COPY --chown=node:node src/ ./src/
ENV NODE_ENV=production
EXPOSE 3000
USER node
CMD ["node", "src/index.js"]
