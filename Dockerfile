# use stable LTS version of alpine
FROM node:lts-alpine

WORKDIR /app/

COPY ./svelte-ui/. .
# remove link and copy data
RUN rm /app/src/lib/data && mkdir /app/src/lib/data
COPY ./controller-web/data/* /app/src/lib/data/
RUN npm i -D
RUN npm run build
EXPOSE 9090

CMD ["npm", "run", "preview", "--", "--host", "--port", "9090"]
