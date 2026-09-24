# Car Rental Booking & Payment System — Step-by-Step Implementation Plan

## الهدف

إضافة نظام كامل ومنظم لحجز السيارات، حفظ بيانات العملاء، الدفع الإلكتروني، التحقق من الدفع، وتحديث لوحة تحكم الإدارة داخل المشروع الحالي.

### طبيعة المشروع

- المشروع لشركة سيارات صغيرة مملوكة لشخص واحد.
- الشركة هي المالكة/المؤجرة لجميع السيارات.
- لا يوجد Marketplace.
- لا يوجد Sellers أو Dealers متعددون.
- لا يوجد Split Payment.
- لا توجد Commission بين بائعين.
- جميع المدفوعات تذهب مباشرة إلى حساب الشركة.
- Payment Gateway المستهدف حالياً هو **Fiuu / Razer Merchant Services**.
- يجب بناء النظام بطريقة بسيطة ونظيفة وقابلة للتوسع لاحقاً.

---

# قواعد تنفيذ عامة

1. لا تبدأ بتنفيذ كل شيء دفعة واحدة.
2. نفذ المراحل بالترتيب من 1 إلى 12.
3. قبل كل مرحلة، افحص نتيجة المرحلة السابقة.
4. لا تنتقل للمرحلة التالية إذا كانت المرحلة الحالية تحتوي على أخطاء.
5. لا تعيد بناء المشروع من الصفر.
6. لا تحذف بيانات أو Models موجودة بدون سبب واضح.
7. لا تنشئ جداول أو Models مكررة إذا كانت موجودة.
8. حافظ على التصميم الحالي والـ architecture الحالية قدر الإمكان.
9. استخدم التقنيات والـ conventions الموجودة في المشروع.
10. لا تضف Marketplace/Seller/Dealer/Commission/Split Payment.
11. لا تضع Payment Secret Keys في Frontend.
12. لا تعتبر Return URL دليلاً على نجاح الدفع.
13. لا يتم وضع Payment = `PAID` إلا بعد التحقق الحقيقي من Payment Gateway.
14. كل الأسعار النهائية يجب حسابها والتحقق منها في Backend.
15. يجب أن يكون Webhook Idempotent لمنع تكرار معالجة العملية.
16. في نهاية كل مرحلة، قدم ملخصاً قصيراً:
   - ماذا تم تنفيذه؟
   - الملفات التي تم تعديلها.
   - الملفات التي تم إنشاؤها.
   - الاختبارات التي تم تنفيذها.
   - هل توجد أخطاء؟
   - هل المرحلة جاهزة للانتقال؟

---

# المرحلة 1 — تحليل المشروع الحالي

## Prompt 1 — Project Audit

قبل كتابة أي كود، قم بفحص المشروع بالكامل.

حدد:

- Frontend framework.
- Backend framework.
- Database.
- ORM.
- Authentication.
- Authorization/Roles.
- Admin Dashboard.
- Vehicle model/table.
- User/Customer model/table.
- Existing Booking/Reservation system.
- Existing Payment system.
- Existing API structure.
- Existing validation library.
- Existing email system.
- Existing file/document storage.
- Environment variable structure.
- Existing tests.

### المطلوب

أنشئ تقريراً واضحاً يتضمن:

1. Architecture الحالية.
2. Database schema الحالية.
3. Models الموجودة.
4. Routes/API الموجودة.
5. Admin structure.
6. ما الذي يمكن إعادة استخدامه.
7. ما الذي يحتاج إلى تعديل.
8. ما الذي يحتاج إلى إنشاء جديد.

### مهم

لا تعدل الكود في هذه المرحلة.

لا تنشئ أي Migration.

لا تنشئ أي Database Table.

فقط افحص وحلل المشروع.

بعد الانتهاء توقف وانتظر الانتقال للمرحلة التالية.

---

# المرحلة 2 — تصميم Database

## Prompt 2 — Database Design

بناءً على تحليل المرحلة السابقة، صمم Database architecture لنظام:

- Customer
- Vehicle
- Booking
- Payment
- PaymentEvent

إذا كانت بعض الجداول موجودة، قم بتوسيعها بدلاً من إنشاء duplicate tables.

## Customer

البيانات المطلوبة:

- id
- firstName
- lastName
- fullName
- email
- phone
- dateOfBirth
- nationality
- passportOrIdNumber
- drivingLicenseNumber
- drivingLicenseExpiry
- address
- city
- state
- postcode
- country
- createdAt
- updatedAt

لا تخزن:

- Card Number
- CVV
- PIN
- Card Security Code

## Booking

الحقول:

- id
- bookingNumber
- customerId
- vehicleId
- pickupDate
- pickupTime
- returnDate
- returnTime
- pickupLocation
- returnLocation
- rentalAmount
- depositAmount
- taxAmount
- discountAmount
- totalAmount
- currency
- status
- customerNotes
- adminNotes
- createdAt
- updatedAt
- paidAt
- cancelledAt
- completedAt

Booking Status:

- `PENDING_PAYMENT`
- `PAYMENT_PROCESSING`
- `PAID`
- `CONFIRMED`
- `ACTIVE`
- `COMPLETED`
- `CANCELLED`
- `EXPIRED`
- `REFUNDED`

## Payment

الحقول:

- id
- bookingId
- customerId
- amount
- currency
- provider
- paymentMethod
- providerTransactionId
- providerReference
- status
- failureReason
- paidAt
- refundAmount
- refundedAt
- createdAt
- updatedAt

Payment Status:

- `PENDING`
- `PROCESSING`
- `PAID`
- `FAILED`
- `CANCELLED`
- `REFUNDED`
- `PARTIALLY_REFUNDED`

## PaymentEvent

الحقول:

- id
- paymentId
- eventType
- provider
- providerTransactionId
- verified
- processed
- payload
- createdAt

## العلاقات

يجب أن تكون:

```text
Customer 1 → Many Bookings
Vehicle 1 → Many Bookings
Booking 1 → Many Payments
Payment 1 → Many PaymentEvents
```

أضف indexes وunique constraints المناسبة، خصوصاً:

- bookingNumber
- providerTransactionId
- customerId
- vehicleId
- booking status
- payment status
- createdAt

في هذه المرحلة لا تنفذ Payment Gateway.

---

# المرحلة 3 — Database Migration

## Prompt 3 — Implement Database

قم الآن بتنفيذ تصميم Database من المرحلة 2.

المطلوب:

1. إنشاء/تحديث Models.
2. إنشاء migrations.
3. إضافة relations.
4. إضافة indexes.
5. إضافة unique constraints.
6. تشغيل migration.
7. التأكد أن Database تعمل.
8. التأكد أن المشروع يعمل بعد التغيير.

### قواعد

- لا تحذف البيانات الموجودة.
- لا تكسر الجداول الحالية.
- إذا كان هناك Migration strategy موجودة، استخدمها.
- لا تنشئ duplicate tables.
- لا تغير أسماء الحقول الحالية إلا إذا كان ذلك ضرورياً.

### اختبار

قم بفحص Database بعد migration.

إذا ظهرت مشكلة، أصلحها قبل الانتقال.

---

# المرحلة 4 — Customer & Booking Backend

## Prompt 4 — Customer and Booking API

أنشئ Backend logic لإدارة العملاء والحجوزات.

### Customer

إنشاء أو تحديث Customer.

Endpoints حسب architecture الحالية، مثل:

```text
POST /api/customers
GET /api/customers/:id
```

### Booking

أنشئ:

```text
POST /api/bookings
GET /api/bookings/:id
GET /api/bookings/:id/status
POST /api/bookings/:id/cancel
```

### عند إنشاء Booking

Backend يجب أن:

1. يتحقق من Customer data.
2. يتحقق من Vehicle.
3. يتحقق من Availability.
4. يتحقق من Pickup/Return dates.
5. يحسب السعر في Backend.
6. ينشئ Booking.
7. يجعل:

```text
Booking = PENDING_PAYMENT
```

### مهم

لا تثق بالسعر القادم من Frontend.

Frontend يرسل البيانات المطلوبة فقط، بينما Backend يعيد حساب:

```text
Rental Amount
+ Deposit
+ Tax
- Discount
= Total Amount
```

---

# المرحلة 5 — منع Double Booking

## Prompt 5 — Vehicle Availability

نفذ نظام Availability آمن.

قبل إنشاء Booking:

1. تحقق من السيارة.
2. تحقق من التاريخ.
3. تحقق من الوقت إذا كان المشروع يستخدم الوقت.
4. ابحث عن الحجوزات المتعارضة.
5. امنع الحجز إذا كانت السيارة غير متاحة.

الحجوزات التي يجب اعتبارها حاجزة للسيارة حسب business rules:

- `PAID`
- `CONFIRMED`
- `ACTIVE`

ويجب التعامل مع:

`PENDING_PAYMENT`

بطريقة قابلة للانتهاء.

### Expiration

إذا بدأ العميل الحجز ولم يكمل الدفع خلال المدة المحددة:

```text
PENDING_PAYMENT
→ EXPIRED
```

وتعود السيارة متاحة.

اجعل مدة expiration قابلة للتعديل من configuration.

استخدم Database transaction/locking المناسب لمنع race conditions.

---

# المرحلة 6 — Customer Booking UI

## Prompt 6 — Booking Form

أنشئ أو حدّث واجهة الحجز.

Flow:

```text
Vehicle Details
↓
Customer Information
↓
Rental Information
↓
Booking Summary
↓
Continue to Payment
```

## Customer Information

Required:

- First Name
- Last Name
- Email
- Phone
- Date of Birth
- Nationality
- Passport/ID Number
- Driving License Number
- Driving License Expiry

## Address

- Address
- City
- State
- Postcode
- Country

## Rental

- Pickup Date
- Pickup Time
- Return Date
- Return Time
- Pickup Location
- Return Location

## Validation

يجب التحقق من:

- Required fields.
- Email.
- Phone.
- Dates.
- Return date > Pickup date.
- Driving license expiry.
- Vehicle availability.

لكن:

**يجب تكرار جميع validations في Backend.**

---

# المرحلة 7 — Booking Summary

## Prompt 7 — Checkout Summary

أنشئ صفحة Summary واضحة قبل الدفع.

اعرض:

```text
Vehicle
Vehicle Image

Pickup
Date
Time
Location

Return
Date
Time
Location

Rental Amount
Deposit
Tax
Discount

Total Amount
Currency
```

ثم:

```text
Continue to Payment
```

### Security

لا تسمح للعميل بتغيير:

- Total Amount
- Rental Amount
- Tax
- Deposit

من Frontend.

القيم النهائية تأتي من Backend.

---

# المرحلة 8 — Payment Service Architecture

## Prompt 8 — Payment Abstraction

أنشئ Payment Service منفصل.

لا تربط كل المشروع مباشرة بـ Fiuu.

استخدم abstraction مثل:

```text
PaymentService
```

ويحتوي على:

```text
createPayment()
verifyPayment()
getPaymentStatus()
handleWebhook()
refundPayment()
```

إذا كان المشروع TypeScript، استخدم interface/type مناسب.

مثلاً:

```text
PaymentProvider
```

والـ Fiuu يكون implementation له.

الهدف:

```text
Application
   ↓
PaymentService
   ↓
FiuuProvider
   ↓
Fiuu
```

وليس:

```text
Application
   ↓
Fiuu code everywhere
```

---

# المرحلة 9 — Fiuu Integration

## Prompt 9 — Fiuu Integration

قم الآن بدمج Fiuu حسب الـ API documentation الرسمية والـ credentials التي سيتم توفيرها.

### Environment Variables

استخدم Server-side variables فقط، حسب المتطلبات الفعلية لـ Fiuu، مثل:

```text
FIUU_MERCHANT_ID
FIUU_SECRET_KEY
FIUU_API_URL
```

لا تستخدم:

```text
NEXT_PUBLIC_FIUU_SECRET_KEY
```

ولا تضع Secret Keys في Frontend.

### Payment Flow

عند الضغط على:

```text
Pay Now
```

Backend:

1. يأخذ Booking.
2. يتحقق أن Booking موجود.
3. يتحقق أن Booking ما زال صالحاً.
4. يتحقق من Amount.
5. ينشئ Payment.
6. Payment = `PENDING`.
7. ينشئ Payment Session مع Fiuu.
8. يعيد بيانات/رابط الدفع الآمن للFrontend.
9. يحول المستخدم إلى Fiuu Payment Page.

استخدم Hosted Payment Page إذا كان ذلك هو الأنسب والأبسط في تكامل Fiuu.

---

# المرحلة 10 — Payment Verification & Webhook

## Prompt 10 — Secure Payment Verification

هذه أهم مرحلة.

أنشئ:

```text
POST /api/payments/webhook
```

حسب متطلبات Fiuu الفعلية.

### لا تعتمد على Return URL

عند رجوع العميل إلى:

```text
/payment/success
```

لا تعتبر العملية PAID.

Return URL فقط لعرض حالة العملية.

### Webhook

عند وصول Webhook:

1. استقبل البيانات.
2. تحقق من signature/hash حسب Fiuu.
3. تحقق من Merchant ID.
4. تحقق من Transaction ID.
5. تحقق من Booking.
6. تحقق من Amount.
7. تحقق من Currency.
8. تحقق من Payment Status.
9. تحقق من أن العملية لم تتم معالجتها سابقاً.
10. خزّن PaymentEvent.
11. حدّث Payment.
12. حدّث Booking.

### نجاح الدفع

فقط إذا كانت كل التحققات صحيحة:

```text
Payment = PAID
Booking = PAID
Booking = CONFIRMED
paidAt = current time
```

### فشل الدفع

```text
Payment = FAILED
Booking = PENDING_PAYMENT
```

### Idempotency

إذا وصل نفس Webhook عدة مرات:

لا تنشئ Payment جديداً.

لا تؤكد Booking عدة مرات.

يجب أن تكون العملية Idempotent.

---

# المرحلة 11 — Payment Result Pages

## Prompt 11 — Payment Result UI

أنشئ:

```text
/payment/success
/payment/failed
/payment/pending
```

## Success

اعرض:

- Payment Successful
- Booking Number
- Customer Name
- Vehicle
- Pickup
- Return
- Amount
- Payment Method
- Transaction Reference
- Payment Status

## Failed

اعرض:

- Payment Failed
- Booking Number
- سبب عام للفشل إن توفر
- Try Again

## Pending

اعرض:

- Payment Processing
- Booking Number
- لا تؤكد الحجز حتى يتم التحقق.

### مهم

صفحة Success يجب أن تجلب حالة الدفع من Backend.

لا تعتمد على query parameter مثل:

```text
?status=paid
```

---

# المرحلة 12 — Admin Dashboard

## Prompt 12 — Admin Customers, Bookings & Payments

أضف إلى Admin Dashboard:

```text
Customers
Bookings
Payments
```

---

## Admin Customers

Route:

```text
/admin/customers
```

اعرض:

| Customer | Email | Phone | Bookings | Created |
|---|---|---|---|---|

أضف:

- Search
- Pagination
- Filters

عند فتح Customer:

### Customer Information

- Full Name
- Email
- Phone
- Date of Birth
- Nationality
- Passport/ID
- Driving License
- Driving License Expiry
- Address

### Booking History

اعرض:

- Booking Number
- Vehicle
- Pickup
- Return
- Amount
- Payment Status
- Booking Status

### Payment History

اعرض:

- Amount
- Method
- Transaction ID
- Status
- Date

---

# المرحلة 13 — Admin Bookings

## Prompt 13 — Admin Booking Management

أنشئ:

```text
/admin/bookings
```

اعرض:

| Booking | Customer | Vehicle | Dates | Amount | Payment | Status |
|---|---|---|---|---|---|---|

أضف:

- Search
- Pagination
- Date Filter
- Payment Status Filter
- Booking Status Filter
- Vehicle Filter

### Booking Details

اعرض:

#### Customer

بيانات العميل.

#### Vehicle

بيانات السيارة.

#### Rental

- Pickup
- Return
- Dates
- Locations

#### Financial

- Rental Amount
- Deposit
- Tax
- Discount
- Total

#### Payment

- Payment Status
- Payment Method
- Transaction ID
- Provider Reference
- Paid At

#### Timeline

مثلاً:

```text
Booking Created
↓
Payment Started
↓
Payment Received
↓
Payment Verified
↓
Booking Confirmed
```

---

# المرحلة 14 — Admin Payments

## Prompt 14 — Payment Management

أنشئ:

```text
/admin/payments
```

اعرض:

| Transaction | Booking | Customer | Amount | Method | Status | Date |
|---|---|---|---|---|---|---|

Filters:

- PAID
- PENDING
- FAILED
- REFUNDED
- PARTIALLY_REFUNDED

### Payment Details

اعرض:

- Payment ID
- Booking Number
- Customer
- Amount
- Currency
- Payment Provider
- Payment Method
- Provider Transaction ID
- Provider Reference
- Status
- Created At
- Paid At
- Refund Amount
- Refunded At
- Failure Reason

وأظهر:

```text
Payment Events / Audit Trail
```

---

# المرحلة 15 — Refund

## Prompt 15 — Refund System

إذا كان Fiuu integration المعتمد يدعم Refund API:

أضف Admin action:

```text
Refund Payment
```

مع:

```text
Refund Amount
```

ثم Confirmation.

### Backend

لا تنفذ Refund من Frontend مباشرة.

Flow:

```text
Admin
↓
Backend
↓
Authorization
↓
Fiuu
↓
Refund
↓
Verification/Webhook
↓
Database
```

بعد التأكيد:

```text
Payment = REFUNDED
```

أو:

```text
Payment = PARTIALLY_REFUNDED
```

حسب الحالة.

---

# المرحلة 16 — Admin Security

## Prompt 16 — Admin Authorization

احمِ جميع Admin pages وAdmin APIs.

لا تعتمد فقط على إخفاء الصفحة.

Backend يجب أن يتحقق من:

```text
role = ADMIN
```

مثلاً:

```text
/admin/customers
/admin/bookings
/admin/payments
```

وكذلك:

```text
GET /api/admin/customers
GET /api/admin/bookings
GET /api/admin/payments
```

يجب أن تكون محمية.

المستخدم العادي يجب أن يحصل على:

```text
403 Forbidden
```

---

# المرحلة 17 — Privacy & Security

## Prompt 17 — Security Review

راجع النظام بالكامل.

تأكد من:

- لا توجد Secret Keys في Frontend.
- لا توجد Card Numbers في Database.
- لا توجد CVV.
- لا توجد PINs.
- Customer data غير عامة.
- Passport/ID غير ظاهر للعامة.
- Driving License data غير عامة.
- HTTPS في Production.
- Backend validation.
- Authorization.
- Secure environment variables.
- Webhook signature verification.
- Amount verification.
- Transaction verification.
- Idempotency.
- Rate limiting حيثما كان مناسباً.
- SQL injection protection عبر ORM/parameterized queries.
- XSS protection.
- CSRF protection إذا كانت architecture تحتاجه.

---

# المرحلة 18 — Audit Log

## Prompt 18 — Audit Trail

إذا كان المشروع يحتوي Audit Log، استخدمه.

وإذا لم يكن موجوداً، أنشئ نظاماً بسيطاً.

سجل:

- Booking created
- Payment created
- Payment verified
- Booking confirmed
- Booking cancelled
- Refund requested
- Refund completed
- Admin changed booking status

احفظ:

- adminId
- action
- entity
- entityId
- timestamp
- metadata

---

# المرحلة 19 — Email Notifications

## Prompt 19 — Booking Confirmation Email

بعد نجاح الدفع والتحقق:

أرسل Email للعميل:

```text
Booking Confirmed
```

يتضمن:

- Customer Name
- Booking Number
- Vehicle
- Pickup Date
- Return Date
- Amount
- Payment Status

وأرسل إشعاراً للإدارة إذا كان البريد الحالي في المشروع يدعم ذلك.

### مهم

إذا فشل Email:

لا تفشل عملية Payment.

لا تغير:

```text
PAID
```

إلى:

```text
FAILED
```

بسبب مشكلة Email.

---

# المرحلة 20 — Database & API Testing

## Prompt 20 — Automated Tests

اكتب Tests للـ critical flows.

اختبر:

### Test 1 — Successful Payment

```text
Payment = PAID
Booking = CONFIRMED
```

### Test 2 — Failed Payment

```text
Payment = FAILED
Booking = PENDING_PAYMENT
```

### Test 3 — Customer closes payment

```text
Payment = PENDING
Booking = PENDING_PAYMENT
```

### Test 4 — Duplicate Webhook

يجب ألا يتم إنشاء Payment جديد.

### Test 5 — Fake Frontend Success

يجب رفضه.

### Test 6 — Wrong Amount

يجب رفضه.

### Test 7 — Wrong Transaction ID

يجب رفضه.

### Test 8 — Double Booking

يجب منع الحجز المتعارض.

### Test 9 — Refund

يجب تحديث Payment بشكل صحيح.

### Test 10 — Unauthorized Admin

يجب أن يرجع:

```text
403 Forbidden
```

---

# المرحلة 21 — Full End-to-End Test

## Prompt 21 — Complete Booking Flow

اختبر السيناريو الكامل:

```text
Customer
↓
Vehicle
↓
Book Now
↓
Customer Information
↓
Rental Information
↓
Availability Check
↓
Price Calculation
↓
Create Booking
↓
PENDING_PAYMENT
↓
Create Payment
↓
Fiuu
↓
Customer Payment
↓
Webhook
↓
Verify Transaction
↓
Payment = PAID
↓
Booking = CONFIRMED
↓
Success Page
↓
Admin Dashboard
```

تحقق من أن البيانات نفسها تظهر بشكل صحيح في:

- Customer
- Booking
- Payment
- PaymentEvent
- Admin Dashboard

---

# المرحلة 22 — Production Readiness

## Prompt 22 — Final Production Review

قم بمراجعة المشروع قبل Production.

تحقق من:

### Database

- migrations
- indexes
- relations
- constraints

### Backend

- validation
- authentication
- authorization
- error handling
- payment verification
- webhook
- idempotency
- transactions

### Frontend

- loading states
- error states
- success states
- mobile responsive
- form validation

### Payment

- Fiuu credentials
- production API URL
- webhook URL
- HTTPS
- transaction verification

### Security

- environment variables
- secrets
- customer privacy
- admin authorization
- payment security

### Logging

تأكد من أن Logs لا تحتوي على:

- Secret Keys
- Card data
- CVV
- Passwords
- Sensitive personal information unnecessarily.

---

# المرحلة 23 — Final Report

## Prompt 23 — Final Implementation Report

بعد اكتمال جميع المراحل، قدم تقريراً نهائياً واضحاً يحتوي على:

### 1. Database

ما هي الجداول التي تم إنشاؤها/تعديلها؟

### 2. Backend

ما هي APIs التي تم إنشاؤها؟

### 3. Frontend

ما هي الصفحات التي تم إنشاؤها؟

### 4. Admin

ما هي أقسام Admin التي تمت إضافتها؟

### 5. Payment

كيف يتم إنشاء Payment؟

كيف يتم التحقق منه؟

كيف يعمل Webhook؟

### 6. Security

ما هي إجراءات الحماية التي تم تنفيذها؟

### 7. Testing

ما هي الاختبارات التي نجحت؟

### 8. Remaining Work

أي شيء ما زال يحتاج إلى:

- Fiuu credentials
- Production configuration
- Domain
- Webhook URL
- Merchant approval
- Business verification

اذكره بوضوح.

---

# النتيجة النهائية المطلوبة

يجب أن يصبح النظام النهائي بهذا الشكل:

```text
                    CUSTOMER
                       │
                       ▼
                  SELECT CAR
                       │
                       ▼
                    BOOK NOW
                       │
                       ▼
              CUSTOMER INFORMATION
                       │
                       ▼
               RENTAL INFORMATION
                       │
                       ▼
                BOOKING SUMMARY
                       │
                       ▼
                CREATE BOOKING
                       │
                       ▼
               PENDING_PAYMENT
                       │
                       ▼
                    FIUU
                       │
                       ▼
                CUSTOMER PAYS
                       │
                       ▼
                  WEBHOOK
                       │
                       ▼
              VERIFY TRANSACTION
                       │
                 ┌─────┴─────┐
                 │           │
              SUCCESS      FAILED
                 │           │
                 ▼           ▼
              PAID        FAILED
                 │
                 ▼
             CONFIRMED
                 │
                 ▼
          CUSTOMER CONFIRMATION
                 │
                 ▼
            ADMIN DASHBOARD
```

## Admin Dashboard

```text
ADMIN
 │
 ├── Dashboard
 │
 ├── Customers
 │      └── Customer Details
 │
 ├── Vehicles
 │
 ├── Bookings
 │      └── Booking Details
 │
 └── Payments
        └── Payment Details
```

## قاعدة العمل الأساسية

لا تجعل Frontend يقرر أن:

```text
Payment = PAID
```

الـ Backend فقط يستطيع تغيير Payment إلى:

```text
PAID
```

بعد:

```text
Verified Payment Gateway Response
+
Correct Transaction
+
Correct Booking
+
Correct Amount
+
Correct Currency
```

بعد ذلك فقط:

```text
Payment = PAID
Booking = CONFIRMED
```

---

# تعليمات أخيرة لـ Claude Code

نفذ هذه الخطة **مرحلة مرحلة وبالترتيب**.

لا تقفز إلى المرحلة التالية.

في كل مرحلة:

1. افحص الوضع الحالي.
2. نفذ المطلوب.
3. شغّل الاختبارات المناسبة.
4. أصلح الأخطاء.
5. اعرض ملخص التنفيذ.
6. انتقل للمرحلة التالية فقط بعد نجاح المرحلة الحالية.

إذا وجدت أن المشروع الحالي يحتوي بالفعل على functionality تؤدي جزءاً من المطلوب، **أعد استخدامها ولا تنشئ implementation مكرراً**.

إذا وجدت اختلافاً بين هذه الخطة والـ architecture الحالية للمشروع، اختر الحل الذي يحافظ على architecture الحالية ويحقق نفس المتطلبات، واشرح الاختلاف قبل إجراء تغيير كبير.

**لا تبدأ كل المراحل دفعة واحدة. ابدأ فقط بالمرحلة 1: Project Audit.**
