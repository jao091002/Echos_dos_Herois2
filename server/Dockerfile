# Servidor de salas do multijogador (serve em qualquer hospedagem com Docker: Fly.io, Railway, Koyeb, VPS…)
FROM node:22-alpine
WORKDIR /app
COPY package.json ./
RUN npm install --omit=dev && npm cache clean --force
COPY relay.mjs ./
ENV PORT=3210
EXPOSE 3210
USER node
CMD ["node", "relay.mjs"]
