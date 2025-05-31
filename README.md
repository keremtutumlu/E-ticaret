# E-Ticaret Projesi

Bu proje, React ve Node.js kullanılarak geliştirilmiş bir e-ticaret uygulamasıdır.

## Teknolojiler

- Frontend: React.js
- Backend: Node.js, Express.js
- Veritabanı: MongoDB Atlas
- Container: Docker

## Kurulum

1. Projeyi klonlayın:
```bash
git clone [repo-url]
cd eticaret
```

2. Docker ile çalıştırın:
```bash
docker-compose up --build
```

## Ortam Değişkenleri

Projeyi çalıştırmak için aşağıdaki ortam değişkenlerini ayarlamanız gerekmektedir:

### Server (.env)
```
MONGODB_CONNECTION=mongodb+srv://[username]:[password]@[cluster].mongodb.net/[database]
PORT=3002
NODE_ENV=production
```

### Client (.env)
```
REACT_APP_API_URL=http://localhost:3002
NODE_ENV=production
```

## API Endpoints

- `POST /api/auth/register` - Kullanıcı kaydı
- `POST /api/auth/login` - Kullanıcı girişi
- `GET /api/products` - Ürünleri listele
- `POST /api/products` - Yeni ürün ekle
- `GET /api/products/:id` - Ürün detayı
- `PUT /api/products/:id` - Ürün güncelle
- `DELETE /api/products/:id` - Ürün sil

## Lisans

MIT 