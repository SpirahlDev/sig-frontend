FROM node:20-alpine AS build

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npx ng build --output-path=dist/sig-frontend

FROM nginx:alpine

COPY --from=build /app/dist/sig-frontend/browser /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
