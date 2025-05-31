FROM node:18

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# Set environment variables
ENV NODE_ENV=production
ENV MONGODB_CONNECTION=mongodb://mongodb:27017/eticaret
ENV PORT=3002

EXPOSE 3002

# Use node directly instead of nodemon in production
CMD ["node", "index.js"] 