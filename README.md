# Vitalis Health & Fitness Tracker — Final Submission

Vitalis is a full-stack health and fitness tracking web application.

## Project structure

- `backend/` — Laravel 10 REST API + MySQL
- `frontend/` — React + TypeScript + Vite/TanStack frontend
- `database/` — database setup helper
- `docs/` — system analysis and API documentation

## Main features

- User registration, login, logout and Laravel Sanctum token authentication
- Strong password validation
- Forgot/reset password flow
- Onboarding with age, gender, height, current/target weight, activity level and fitness goal
- Automatic daily calorie target calculation
- Food library, manual food creation and food search
- Breakfast/lunch/dinner/snacks meal tracking with automatic calorie and macro totals
- Exercise CRUD
- Water CRUD and daily water progress
- Weight CRUD and weight history
- Dashboard summary
- Progress charts for 7 days, 30 days and 3 months
- Nutrition targets (protein, carbs, fat, calories, water)
- Notification preferences
- Light/dark theme preference

## Requirements

Install the following on the machine running the project:

- PHP 8.1+
- Composer
- MySQL / XAMPP
- Node.js + npm

## 1. Database setup

Start MySQL in XAMPP, then create an empty database called `vitalis`.

You can execute:

```sql
CREATE DATABASE IF NOT EXISTS vitalis CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

## 2. Backend setup

Open a terminal in `backend/`:

```bash
composer install
```

Copy `.env.example` to `.env`.

On Windows Command Prompt:

```cmd
copy .env.example .env
```

Update the database section in `.env`:

```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=vitalis
DB_USERNAME=root
DB_PASSWORD=
```

Then run:

```bash
php artisan key:generate
php artisan migrate
php artisan optimize:clear
php artisan serve
```

Backend URL:

`http://127.0.0.1:8000`

For development, password reset emails are configured to use Laravel logs if `MAIL_MAILER=log` is set in `.env`.

## 3. Frontend setup

Open another terminal in `frontend/`:

```bash
npm install
npm run dev
```

If PowerShell blocks `npm.ps1`, use:

```powershell
npm.cmd install
npm.cmd run dev
```

The current Vite configuration may run on:

`http://localhost:8080`

The Laravel CORS configuration included in this submission permits both ports `8080` and `5173` for local development.

The frontend API URL defaults to:

`http://127.0.0.1:8000/api`

You can override it by copying `frontend/.env.example` to `frontend/.env` and editing `VITE_API_URL`.

## 4. Recommended test flow

1. Register a new account.
2. Complete onboarding.
3. Open the Dashboard.
4. Create a food from Meals if the food list is empty.
5. Add the food to a meal.
6. Log water, weight and exercise.
7. Open Progress to view the tracked data.
8. Update goals/settings.
9. Test logout/login.

## Important submission notes

- `.env` is intentionally not included because it may contain secrets.
- `vendor/` and `node_modules/` are intentionally not included to reduce submission size.
- Install dependencies using `composer install` and `npm install` before running.
- Database tables are created through Laravel migrations, so a full SQL dump is not required.
