FROM ianwalter/puppeteer:v4.0.0

WORKDIR /app

RUN npm install
CMD npx wdio
