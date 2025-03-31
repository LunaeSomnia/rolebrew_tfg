FROM node:22-alpine AS builder
ENV PUBLIC_BACKEND_URL="http://backend:8080/api/"
ENV JWT_SECRET="aed39e8a562a418bc3dae0f2ad9b9ae26b6bb3041179bb0c19a9a281d07b209ea83bcab15c974aef26eb1b77c56c366f1fc99c9e38ded43df92495ebad68109fecc36ed29116fa6c90d0c21d7a87d61a426f5e54bbf00aedd796253d87dd1fcaa3712d6945f4dd564e5870fe936d5cc9f8fea71fb39eac8fd0c37118d0568f5dc5841c344377458b1ddaac4426dbb51bd4b4b4a397d837fa70d204fc640c5f148d56f8db121c0c7813e7ca933f7fc57029e073eae5a07305d9739b1da4a089bced176fa51c0cb950af43f8f93631398346b4c7e3cd85058e1b1e16dcf50c658a9905bcff54b6fc392b8439c1b054edf0dd744b751f18ad9b2319b0420a8fdd73"
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build
RUN npm prune --production

FROM node:22-alpine
WORKDIR /app
COPY --from=builder /app/build build/
COPY --from=builder /app/node_modules node_modules/
COPY package.json .
EXPOSE 3000
ENV NODE_ENV=production
CMD [ "node", "build" ]
