# Ridah – E-commerce Frontend

Multi-page frontend for the Ridah online shop, selling traditional Dawoodi Bohra women's attire.

## Project Structure

```
ridah/
├── index.html            # Homepage
├── products.html         # Product listing with filters
├── product-detail.html   # Single product view
├── custom-rida.html      # Custom rida builder (step-by-step)
├── login.html            # Sign in
├── signup.html           # Create account
├── profile.html          # User account & order history
├── cart.html             # Shopping cart
├── checkout.html         # Shipping & order summary
├── payment.html          # QR code payment & invoice
├── order-tracking.html   # Delivery status timeline
├── chat.html             # WhatsApp + live chat support
├── css/
│   └── style.css         # Design system & all page styles
├── js/
│   ├── api.js            # API wrappers + Auth helpers
│   └── main.js           # Shared utilities: cart, toast, header/footer
└── images/
    ├── placeholder.svg   # Product image fallback
    └── qr-placeholder.svg
```

## Configuration

### 1. API Base URL

Open `js/api.js` and set your backend URL:

```js
const API_BASE = 'https://api.yourdomain.com'; // ← change this
```

### 2. WhatsApp Number

In the same file, set your WhatsApp business number (include country code, no `+`):

```js
const WHATSAPP_NUMBER = '919999999999'; // ← e.g. India +91 99999 99999
```

## Running Locally

Any static file server works. Examples:

**Python (quickest):**
```bash
cd ridah
python3 -m http.server 8080
# Open http://localhost:8080
```

**Node.js (npx):**
```bash
npx serve ridah
```

**VS Code:**  
Install the *Live Server* extension, right-click `index.html` → *Open with Live Server*.

> **Note:** Opening HTML files directly via `file://` will cause CORS errors on API calls and font loading. Always use a local server.

## API Endpoints Expected

| Method | Endpoint                         | Used in           |
|--------|----------------------------------|-------------------|
| GET    | /api/products                    | Homepage, Shop    |
| GET    | /api/products/:id                | Product Detail    |
| GET    | /api/fabrics                     | Custom Rida       |
| GET    | /api/colors                      | Custom Rida       |
| POST   | /api/auth/login                  | Login             |
| POST   | /api/auth/register               | Signup            |
| GET    | /api/user/profile                | Profile           |
| PUT    | /api/user/profile                | Profile           |
| GET    | /api/orders/user                 | Profile           |
| POST   | /api/orders/custom               | Custom Rida       |
| POST   | /api/orders                      | Checkout          |
| POST   | /api/payment/generate-qr         | Payment           |
| GET    | /api/orders/:id/status           | Payment (polling) |
| GET    | /api/invoices/:id                | Payment           |
| GET    | /api/orders/:id/tracking         | Order Tracking    |
| POST   | /api/chat/send                   | Chat              |
| GET    | /api/chat/history                | Chat              |

## Authentication

- Token is stored in `localStorage` as `ridah_token`.
- Auth header sent automatically: `Authorization: Bearer <token>`.
- A 401 response from the API triggers automatic logout and redirect to login.
- Protected pages: `profile.html`, `checkout.html`, `custom-rida.html` (submit step).

## Key Design Decisions

- **No build step** – vanilla HTML, CSS, JS. Drop on any static host (Netlify, Vercel, GitHub Pages, S3).
- **Mock fallback** – every page gracefully falls back to demo data if the API is unreachable, so the UI is always reviewable.
- **Cart persistence** – stored in `localStorage` as `ridah_cart`. Syncs to server on checkout if user is logged in.
- **Polling** – payment status checked every 5 s; order tracking refreshed every 30 s. Both clear on page unload.

## Deployment

Upload the entire `ridah/` folder to any static host. No server-side code required.

**Netlify drag-and-drop:** Go to [app.netlify.com](https://app.netlify.com) → drag the `ridah/` folder onto the deploy zone.

## Customisation Tips

- **Colours:** All tokens are CSS custom properties in `:root` inside `css/style.css`. Change `--teal`, `--rose`, `--gold` to rebrand instantly.
- **Fonts:** Swap the Google Fonts `@import` at the top of `style.css`.
- **Currency:** `formatPrice()` in `main.js` uses `Intl.NumberFormat` with `INR`. Change the currency code to localise.
