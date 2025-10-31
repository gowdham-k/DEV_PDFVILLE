# Backend Tests README

This document explains how to run the backend unit tests and what they validate.

## Overview
- Tests are scoped to `backend/tests` via the root `pytest.ini`.
- Tests run against an isolated in-memory SQLite database; they do not read or write `backend/pdfville.db`.
- Network-dependent integration checks (like `backend/test_conversion.py`) are excluded from unit test runs.

## Prerequisites
- Ensure the project virtual environment exists with dependencies installed.
  - Dependencies are listed in `backend/requirements.txt`.
  - The virtual environment is expected at `.venv/` in the repo root.

## Run Tests
- Recommended command (uses the project virtualenv):
  - `.\.venv\Scripts\python.exe -m pytest`
- What happens:
  - Discovers tests only under `backend/tests/`.
  - Runs quietly with warnings disabled (configured in `pytest.ini`).
  - Writes a JUnit XML report to `backend/test_results.xml`.

## What These Tests Do
- Import and call `db_utils` functions directly against a fresh in-memory database created for each test.
- Validations include:
  - Creating and retrieving a `User` by email.
  - Toggling premium status with `set_user_premium_by_email` (updates `is_pro` and `subscription_status`).
  - Updating subscription status by user ID.
  - Applying payment info with `update_user_payment_info` (sets payment fields and upgrades to `pro`).
  - File CRUD: create, list, and delete `File` records for a user.
  - Compression usage tracking: increment usage and compute monthly counts for free-tier enforcement.

## Test Reports
- After a run, the JUnit XML report is available at:
  - `backend/test_results.xml`
- CI or external tooling can consume this file for test analytics.

## Run a Single Test
- Target a specific test or test function:
  - `.\.venv\Scripts\python.exe -m pytest backend\tests\test_db_utils.py -k set_user_premium_by_email_true_false`
  - Or by node ID:
  - `.\.venv\Scripts\python.exe -m pytest backend\tests\test_db_utils.py::test_create_and_get_user_by_email`

## Integration Conversion Tests (Optional)
- The file `backend/test_conversion.py` sends HTTP requests to `http://localhost:5000`.
- To run it, start the backend server first:
  - `.\.venv\Scripts\python.exe backend\app.py`
- Then, execute that test module separately:
  - `.\.venv\Scripts\python.exe -m pytest backend\test_conversion.py`
- Note: This is not included in the default unit test run and may require local files referenced in the script.

## Troubleshooting
- If `pytest` is not found in the shell, use the virtualenv Python:
  - `.\.venv\Scripts\python.exe -m pytest`
- If tests unexpectedly attempt network calls, verify `pytest.ini` exists at the repo root and includes:
  - `testpaths = backend/tests`