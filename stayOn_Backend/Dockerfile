FROM dhi.io/node:22-alpine3.23-dev

RUN addgroup stayon && adduser -S -G stayon stayon

WORKDIR /app/

COPY --chown=stayon package*.json .

RUN npm install
COPY --chown=stayon . .

ENV NODE_ENV=development

EXPOSE 3000

USER stayon

CMD ["sh", "-c", "npm run sync && npm run dev"]

