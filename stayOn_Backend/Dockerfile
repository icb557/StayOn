FROM node:22.21.0-alpine3.22

RUN addgroup stayon && adduser -S -G stayon stayon

USER stayon

WORKDIR /app/

COPY --chown=stayon package*.json .

RUN npm install
COPY --chown=stayon . .

ENV NODE_ENV=development

EXPOSE 3000

CMD ["sh", "-c", "npm run sync && npm run dev"]

