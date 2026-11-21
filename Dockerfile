FROM node:22-alpine AS frontend-build
WORKDIR /build/frontend
COPY frontend/package*.json ./
RUN npm ci
COPY frontend/ ./
RUN npm run build

FROM node:22-alpine
WORKDIR /app
ENV NODE_ENV=production
# mongodb-memory-server is only a dev/test fallback; skip its mongod download
ENV MONGOMS_DISABLE_POSTINSTALL=1
COPY package*.json ./
RUN npm ci --omit=dev
COPY app.js index.js ./
COPY controllers ./controllers
COPY middleware ./middleware
COPY models ./models
COPY utils ./utils
COPY --from=frontend-build /build/frontend/dist ./frontend/dist
USER node
EXPOSE 3003
CMD ["node", "index.js"]
