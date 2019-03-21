# base image
FROM node:11.11

# set working directory
RUN mkdir -p /code/ace_frontend
WORKDIR /code/ace_frontend

# add `/code/ace_frontend/node_modules/.bin` to $PATH
ENV PATH /code/ace_frontend/node_modules/.bin:$PATH

# install and cache app dependencies
COPY package.json /code/ace_frontend/package.json
RUN npm install
RUN npm install react-scripts@1.1.1