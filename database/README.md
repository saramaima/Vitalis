# Database

The final project uses MySQL.

1. Run `database_setup.sql` or create a database named `vitalis` in phpMyAdmin.
2. Configure `backend/.env` with that database name.
3. Run `php artisan migrate` inside `backend/`.

The Laravel migrations are the authoritative database schema and are included in the backend source.
