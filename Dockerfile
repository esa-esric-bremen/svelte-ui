# use stable LTS version of alpine
FROM node:lts-alpine@sha256:d2166de198f26e17e5a442f537754dd616ab069c47cc57b889310a717e0abbf9

WORKDIR /app/

COPY ./svelte-ui/. .
# remove link and copy data
RUN rm /app/src/lib/data && mkdir /app/src/lib/data
COPY ./controller-web/data/* /app/src/lib/data/
RUN npm i -D
RUN npm run smui
RUN npm run build
EXPOSE 9090

CMD ["npm", "run", "preview", "--", "--host", "--port", "9090"]