FROM node:24
WORKDIR /myapp
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
EXPOSE 8000
CMD ["npm", "run", "start"]
