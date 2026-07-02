# B2B Procurement Platform

منصة متكاملة لإدارة المشتريات بين العملاء والموردين (B2B)

## المميزات الرئيسية

- **إدارة الطلبات**: إنشاء ومتابعة الطلبات مع عروض أسعار
- **المحفظة الإلكترونية**: شحن وسحب وإدارة الرصيد
- **الفواتير الإلكترونية**: ربط مع هيئة الزكاة والضريبة (ZATCA)
- **الخرائط التفاعلية**: تحديد مواقع الموردين وتتبع التوصيل
- **الذكاء الاصطناعي**: اقتراح المورد الأنسب وتحليل الأسعار
- **التقارير**: تقارير مالية ومبيعات وأداء
- **الإشعارات**: Push, SMS, Email, In-App

## التقنيات المستخدمة

| الطبقة | التقنية |
|--------|---------|
| Frontend Web | Next.js, React, TypeScript |
| Backend | NestJS, TypeScript |
| Database | PostgreSQL |
| Cache | Redis |
| Queue | RabbitMQ |
| Mobile | Flutter (Android & iOS) |
| Cloud | AWS / Azure |
| CI/CD | GitHub Actions |
| Monitoring | Grafana + Prometheus |
| Search | Elasticsearch |

## هيكل المشروع

```
B2B/
├── backend/         # NestJS API
├── frontend/        # Next.js Web App
├── mobile/          # Flutter Mobile App
├── database/        # Migrations & Seeds
├── docker/          # Docker Compose
└── docs/            # Documentation
```

## التشغيل

```bash
# Docker (مستحسن)
cd docker && docker-compose up -d

# يدوياً
cd backend && npm install && npm run start:dev
cd frontend && npm install && npm run dev
```

## API Documentation
`http://localhost:3000/api/docs` (Swagger UI)
