FROM node:alpine as mybuild
WORKDIR /opt/app
COPY ./task_3_docker_frontend/package.json .
RUN yarn install
COPY ./task_3_docker_frontend .
RUN yarn build

FROM nginx
COPY --from=mybuild /opt/app/build /usr/share/nginx/html
