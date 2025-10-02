FROM node:20-alpine

WORKDIR /app

COPY package*.json ./

RUN npm ci --ignore-scripts

COPY . .

RUN if [ -f prisma/schema.prisma ]; then npx prisma generate; fi

RUN npm run build

ENV NODE_ENV=production

EXPOSE 4000

CMD ["npm", "start"]