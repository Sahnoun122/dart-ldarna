# 1. Base image
FROM node:20-alpine

# 2. Working directory
WORKDIR /usr/src/app

# 3. Copy package.json
COPY package*.json ./

# 4. Install dependencies
RUN npm install

# 5. Copy source code
COPY . .

# 6. Expose port
EXPOSE 3000

# 7. Start app
CMD ["npm", "start"]
