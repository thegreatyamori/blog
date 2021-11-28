FROM node:16
RUN yarn global add gatsby-cli
EXPOSE 8000
WORKDIR /myapp
COPY ./package.json /myapp
RUN yarn install && yarn cache clean
COPY . /myapp
CMD ["gatsby", "develop", "-H", "0.0.0.0" ]