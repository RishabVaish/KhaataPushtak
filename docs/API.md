# API Documentation

Base URL (local): `http://localhost:5000/api`
Base URL (production): `https://<your-app>.onrender.com/api`

All request/response bodies are JSON. Protected endpoints require a header:

```
Authorization: Bearer <token>
```

Every response follows one of two shapes:

```json
{ "success": true, "data": { ... }, "message": "..." }
{ "success": false, "message": "..." }
```

---

## Auth Endpoints

### Register

```
POST /api/auth/register
Authentication: Not required
```

**Request body**

```json
{ "name": "Ravi Kumar", "email": "ravi@example.com", "password": "secret123" }
```

**Success — 201**

```json
{
  "success": true,
  "data": {
    "_id": "...",
    "name": "Ravi Kumar",
    "email": "ravi@example.com",
    "avatar": "",
    "token": "eyJ..."
  },
  "message": "User registered successfully"
}
```

**Errors**
| Status | Cause |
|---|---|
| 400 | Missing fields, or email already registered |

---

### Login

```
POST /api/auth/login
Authentication: Not required
```

**Request body**

```json
{ "email": "ravi@example.com", "password": "secret123" }
```

**Success — 200** — same shape as Register.
**Errors**
| Status | Cause |
|---|---|
| 400 | Missing email or password |
| 401 | Invalid email or password (deliberately vague — doesn't reveal which) |

---

### Get Profile

```
GET /api/auth/profile
Authentication: Required
```

**Success — 200**

```json
{
  "success": true,
  "data": {
    "_id": "...",
    "name": "Ravi Kumar",
    "email": "ravi@example.com",
    "avatar": "",
    "createdAt": "..."
  }
}
```

**Errors**
| Status | Cause |
|---|---|
| 401 | Missing/invalid/expired token |
| 404 | User no longer exists |

---

## Hisaab Endpoints

All Hisaab endpoints require authentication and are automatically scoped to the logged-in user — you will only ever see, edit, or delete your own entries.

### Get All Hisaabs

```
GET /api/hisaab
Authentication: Required
```

**Query parameters** (all optional)
| Param | Type | Example | Description |
|---|---|---|---|
| `search` | string | `?search=milk` | Case-insensitive match on title or content |
| `category` | string | `?category=Grocery` | One of the fixed categories, or omitted for all |
| `sort` | string | `?sort=oldest` | `newest` (default) or `oldest` |

**Success — 200**

```json
{
  "success": true,
  "count": 2,
  "data": [
    {
      "_id": "...",
      "title": "Milk",
      "content": "Bought 1L milk",
      "category": "Grocery",
      "user": {
        "_id": "...",
        "name": "Ravi Kumar",
        "email": "ravi@example.com",
        "avatar": ""
      },
      "createdAt": "...",
      "updatedAt": "..."
    }
  ]
}
```

---

### Get Single Hisaab

```
GET /api/hisaab/:id
Authentication: Required
```

**Success — 200** — single object, same shape as above.
**Errors**
| Status | Cause |
|---|---|
| 404 | Not found, OR belongs to a different user (identical response — ownership is never leaked) |

---

### Create Hisaab

```
POST /api/hisaab
Authentication: Required
```

**Request body**

```json
{ "title": "Milk", "content": "Bought 1L milk", "category": "Grocery" }
```

`category` must be one of: `Grocery, Food, Shopping, Bills, Travel, Home, Other`. Ownership (`user`) is derived server-side from the JWT — never accepted from the request body.

**Success — 201**

```json
{
  "success": true,
  "data": { "...": "..." },
  "message": "Hisaab created successfully"
}
```

**Errors**
| Status | Cause |
|---|---|
| 400 | Missing/invalid fields (Mongoose validation) |
| 401 | Missing/invalid token |

---

### Update Hisaab

```
PUT /api/hisaab/:id
Authentication: Required
```

**Request body** (any subset)

```json
{ "title": "Milk & Bread" }
```

Only `title`, `content`, `category` are ever accepted — the `user` field cannot be reassigned via this endpoint, even if included in the request body.

**Success — 200** — updated object.
**Errors**
| Status | Cause |
|---|---|
| 400 | Validation failure |
| 404 | Not found, or belongs to a different user |

---

### Delete Hisaab

```
DELETE /api/hisaab/:id
Authentication: Required
```

**Success — 200**

```json
{ "success": true, "data": {}, "message": "Hisaab deleted successfully" }
```

**Errors**
| Status | Cause |
|---|---|
| 404 | Not found, or belongs to a different user |

---

## Common Error Codes (All Endpoints)

| Status | Meaning                                           |
| ------ | ------------------------------------------------- |
| 400    | Bad request — validation failed                   |
| 401    | Unauthorized — missing, invalid, or expired token |
| 404    | Resource not found (or not owned by you)          |
| 500    | Server error — check backend logs                 |
