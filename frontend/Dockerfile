FROM node:14.15-alpine as builder
WORKDIR /app
COPY . /app
RUN npm ci
ARG ENV
RUN if [ "$ENV" = "prod" ] ; then npm run buildProd ; else npm run buildTest ; fi

FROM nginx:alpine
COPY --from=builder /app/nginx-default.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/dist/sign2mint-website /usr/share/nginx/html