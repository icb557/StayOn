FROM node:22.21.0-alpine3.22

RUN addgroup stayon && adduser -S -G stayon stayon

WORKDIR /app/

COPY --chown=stayon package*.json .

RUN npm install
COPY --chown=stayon . .

ENV NODE_ENV=development

EXPOSE 4000

USER stayon

CMD ["npm", "run", "start", "--", "--host", "0.0.0.0", "--port", "4000"]

