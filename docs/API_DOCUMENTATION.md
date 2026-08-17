# Vitalis API Documentation

Base URL during local development:

`http://127.0.0.1:8000/api`

Protected routes require:

```http
Authorization: Bearer <SANCTUM_TOKEN>
Accept: application/json
```

## Authentication

| Method | Endpoint | Authentication | Purpose |
|---|---|---|---|
| POST | `/auth/register` | No | Register account |
| POST | `/auth/login` | No | Login and return Sanctum token |
| POST | `/auth/logout` | Yes | Revoke current token |
| POST | `/auth/forgot-password` | No | Generate password reset link |
| POST | `/auth/reset-password` | No | Reset password with token |

### Register body

```json
{
  "name": "Sara",
  "email": "sara@example.com",
  "password": "Sara@12345",
  "password_confirmation": "Sara@12345"
}
```

### Login body

```json
{
  "email": "sara@example.com",
  "password": "Sara@12345"
}
```

## User / Onboarding / Settings

| Method | Endpoint | Auth | Purpose |
|---|---|---|---|
| GET | `/user` | Yes | Current authenticated user |
| POST | `/users/onboarding` | Yes | Complete onboarding and calculate calorie target |
| PUT | `/users/me` | Yes | Update profile, goals, reminders and theme |
| PUT | `/users/me/password` | Yes | Change password |

### Onboarding body

```json
{
  "age": 22,
  "gender": "female",
  "height": 165,
  "current_weight": 65.4,
  "target_weight": 58,
  "activity_level": "moderate",
  "fitness_goal": "lose_weight"
}
```

## Foods

| Method | Endpoint | Auth | Purpose |
|---|---|---|---|
| GET | `/foods` | Yes | List foods |
| GET | `/foods?search=Egg` | Yes | Search foods |
| POST | `/foods` | Yes | Create food manually |

### Create food body

```json
{
  "name": "Boiled Egg",
  "serving_size": "1 egg",
  "calories": 78,
  "protein": 6.3,
  "carbs": 0.6,
  "fat": 5.3
}
```

## Meals

| Method | Endpoint | Auth | Purpose |
|---|---|---|---|
| GET | `/meals?date=YYYY-MM-DD` | Yes | List meals for a date |
| POST | `/meals/{mealType}/foods` | Yes | Add food to breakfast/lunch/dinner/snacks |
| PUT | `/meals/{mealId}/foods/{foodId}` | Yes | Update food quantity |
| DELETE | `/meals/{mealId}/foods/{foodId}` | Yes | Remove food from meal |
| DELETE | `/meals/{mealId}` | Yes | Delete a meal |

### Add food to meal body

```json
{
  "food_id": 1,
  "quantity": 2,
  "date": "2026-08-15"
}
```

## Exercises

| Method | Endpoint | Auth | Purpose |
|---|---|---|---|
| GET | `/exercises` | Yes | List exercises |
| POST | `/exercises` | Yes | Add exercise |
| PUT | `/exercises/{id}` | Yes | Update exercise |
| DELETE | `/exercises/{id}` | Yes | Delete exercise |

## Water

| Method | Endpoint | Auth | Purpose |
|---|---|---|---|
| GET | `/water?date=YYYY-MM-DD` | Yes | Daily water total and records |
| POST | `/water` | Yes | Add water |
| PUT | `/water/{id}` | Yes | Update water record |
| DELETE | `/water/{id}` | Yes | Delete water record |

## Weight

| Method | Endpoint | Auth | Purpose |
|---|---|---|---|
| GET | `/weight` | Yes | Weight history |
| POST | `/weight` | Yes | Add weight record |
| PUT | `/weight/{id}` | Yes | Update weight record |
| DELETE | `/weight/{id}` | Yes | Delete weight record |

## Dashboard

| Method | Endpoint | Auth | Purpose |
|---|---|---|---|
| GET | `/dashboard` | Yes | Current dashboard summary |
| GET | `/dashboard?date=YYYY-MM-DD` | Yes | Dashboard for selected date |

The response includes calorie target/consumed/burned/net/remaining, macros, water, current/target weight and meals.

## Progress

| Method | Endpoint | Auth | Purpose |
|---|---|---|---|
| GET | `/progress?range=7d` | Yes | 7-day progress |
| GET | `/progress?range=30d` | Yes | 30-day progress |
| GET | `/progress?range=3m` | Yes | 3-month progress |

The response contains weight trend, daily/average calories and exercise summary.
