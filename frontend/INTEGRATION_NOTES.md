# Vitalis Frontend ↔ Laravel API integration

The frontend is configured to use the Laravel REST API at:

`http://127.0.0.1:8000/api`

You can override it with a frontend `.env` file:

```env
VITE_API_URL=http://127.0.0.1:8000/api
```

## Local run order

1. Start XAMPP MySQL.
2. In the Laravel backend run `php artisan serve`.
3. In the frontend run `npm install` (first time only), then `npm run dev`.
4. Open the Vite URL (normally `http://localhost:5173`).

## Connected flows

- Register → Laravel `/auth/register` → token saved → onboarding.
- Login → Laravel `/auth/login` → token saved → dashboard/onboarding routing.
- Logout → `/auth/logout` and local token cleared.
- Onboarding → `/users/onboarding` plus `/users/me` for macro/water targets.
- Dashboard → `/dashboard`.
- Foods/Meals → `/foods`, `/meals`, and meal-food endpoints.
- Exercise → `/exercises`.
- Water → `/water`.
- Weight → `/weight`.
- Progress → `/progress`.
- Settings/Goals → `/user` and `/users/me`.

Protected requests automatically include `Authorization: Bearer <token>` via `src/lib/api.ts`.

## Development note

The frontend currently stores the Sanctum bearer token in `localStorage` for this local/demo integration. For production, review the authentication storage strategy and deploy over HTTPS.
