# Etapa de build
FROM node:20-alpine as build
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Etapa de dev
FROM node:20-alpine
WORKDIR /usr/src/app
COPY --from=build /usr/src/app ./
EXPOSE 5173
CMD ["npm", "run", "dev", "--", "--host"]
