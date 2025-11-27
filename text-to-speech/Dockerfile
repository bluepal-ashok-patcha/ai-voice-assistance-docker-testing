# ---- build stage ----
FROM node:18-alpine AS build

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# ---- nginx stage ----
FROM nginx:alpine

# remove default nginx static content
RUN rm -rf /usr/share/nginx/html/*

# copy React build output
COPY --from=build /app/build /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
