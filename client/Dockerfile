FROM node:18

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# Set environment variables
ENV NODE_ENV=production
ENV REACT_APP_API_URL=http://localhost:3002

# Build the app
RUN npm run build

# Install serve to run the built app
RUN npm install -g serve

EXPOSE 3000

# Use serve to run the built app
CMD ["serve", "-s", "build", "-l", "3000"] 