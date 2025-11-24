# 1. Adım: Uygulamayı oluştur (Build)
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# 2. Adım: Uygulamayı sun (Serve)
# Vite preview komutu ile 8080 portundan yayın yapıyoruz
ENV PORT=8080
EXPOSE 8080
CMD ["npm", "run", "preview", "--", "--host", "0.0.0.0", "--port", "8080"]