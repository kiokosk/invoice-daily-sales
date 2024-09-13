# # Use an official Node.js image as the base image
# FROM node:18-alpine

# # Set the working directory
# WORKDIR /usr/src/app

# # Copy package.json and package-lock.json files
# COPY ../../package.json ./
# COPY ../../package-lock.json ./

# # Install dependencies
# RUN npm install

# # Copy the entire app directory into the container
# COPY . .

# # Build the application
# RUN npm run build

# # Expose the application's port
# EXPOSE 3000

# # Command to run the app
# CMD ["node", "dist/main.js"]

FROM node:alpine As development

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build email-sender

FROM node:alpine as production

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install --only=production

COPY . .

COPY --from=development /usr/src/app/dist ./dist

CMD ["node", "dist/apps/email-sender/main"]