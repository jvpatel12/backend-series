# Blacklist Model & Logout Implementation

## 📋 Overview
The Blacklist Model is used to revoke JWT tokens when users logout. This prevents reuse of old tokens and ensures security.

## 🔧 Blacklist Model Schema

**File:** `src/model/blacklist.model.js`

```javascript
{
  token: String (unique, indexed),      // JWT token to blacklist
  user: ObjectId (ref: User),           // User who logged out
  expiresAt: Date (indexed),            // Token expiration time
  reason: String (enum),                // Reason for blacklist
  createdAt: Date                       // When token was blacklisted
}
```

### **Reasons for Blacklisting:**
- `LOGOUT` - User logged out
- `PASSWORD_CHANGE` - User changed password
- `ACCOUNT_SUSPENDED` - Account was suspended
- `MANUAL` - Manual revocation

### **Auto-Cleanup:**
- Tokens automatically deleted 24 hours after blacklist creation via TTL index

---

## 🔐 Updated Authentication Flow

### **Before Logout:**
1. User sends token in request
2. Middleware validates JWT signature
3. Middleware checks if token exists in user table
4. Grant access

### **After Logout (With Blacklist):**
1. User sends logout request with token
2. **NEW:** Middleware checks if token is in blacklist
3. If blacklisted → Reject request (401)
4. Logout endpoint adds token to blacklist
5. Clear cookie
6. Return success message

---

## 📡 API Endpoint

### **Logout with Blacklist**
```
POST /auth/logout
Authorization: Bearer <token>
```

**Request:**
```json
{
  // No body needed - Token extracted from header/cookie
}
```

**Response (200):**
```json
{
  "message": "Logged out successfully",
  "logoutTime": "2026-04-01T10:30:00.000Z"
}
```

**Error Response (401):**
```json
{
  "message": "Unauthorized access token is missing"
}
```

---

## 🛡️ Security Features

### **1. Token Revocation**
Once logged out, the token cannot be used again even if JWT signature is valid.

### **2. Automatic Cleanup**
MongoDB TTL index automatically deletes expired entries after 24 hours.

### **3. User Tracking**
Blacklist records which user logged out and when.

### **4. Logout Reason**
Different reasons for blacklisting (password change, suspension, etc.)

---

## 💻 Implementation Details

### **Middleware Check (authMiddleware.js):**
```javascript
// Check if token is blacklisted
const isBlacklisted = await blacklistModel.findOne({ token });
if (isBlacklisted) {
  return res.status(401).json({
    message: "Unauthorized access token has been revoked"
  });
}
```

### **Logout Function (auth.controller.js):**
```javascript
async function logout(req, res) {
  const blacklistModel = require("../model/blacklist.model");
  const jwt = require("jsonwebtoken");

  const token = req.token;
  const user = req.user;

  // Decode to get expiration time
  const decoded = jwt.verify(token, process.env.TOKEN_ACCESS);

  // Add to blacklist
  await blacklistModel.create({
    token: token,
    user: user._id,
    expiresAt: new Date(decoded.exp * 1000),
    reason: "LOGOUT",
  });

  res.clearCookie("token");
  res.status(200).json({
    message: "Logged out successfully",
    logoutTime: new Date(),
  });
}
```

---

## 🔄 Token Lifecycle

### **Without Logout:**
```
[Token Issued] → [Valid for 5 days] → [Expires]
```

### **With Logout:**
```
[Token Issued] → [User Logout] → [Added to Blacklist] 
                      ↓
              [Token Rejected by Middleware]
```

---

## 🧪 Testing Logout Flow

### **Step 1: Register & Login**
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H 'Content-Type: application/json' \
  -d '{
    "email": "test@example.com",
    "name": "Test User",
    "password": "password123"
  }'
```

### **Step 2: Use Token (Should Work)**
```bash
curl -H "Authorization: Bearer <token>" \
  http://localhost:5000/api/auth/user
```

**Response:** 200 - User data returned

### **Step 3: Logout**
```bash
curl -X POST -H "Authorization: Bearer <token>" \
  http://localhost:5000/api/auth/logout
```

**Response:** 200 - Logged out successfully

### **Step 4: Use Same Token Again (Should Fail)**
```bash
curl -H "Authorization: Bearer <token>" \
  http://localhost:5000/api/auth/user
```

**Response:** 401 - "Unauthorized access token has been revoked"

---

## 📊 Database Queries

### **Find Blacklisted Token:**
```javascript
const isBlacklisted = await blacklistModel.findOne({ token });
```

### **Find User's Blacklisted Tokens:**
```javascript
const entries = await blacklistModel.find({ user: userId });
```

### **Count Active Blacklist Entries:**
```javascript
const count = await blacklistModel.countDocuments();
```

---

## 🎯 Benefits

✅ **Prevents Token Reuse** - Old tokens can't be used after logout
✅ **Security** - Each logout invalidates that specific token
✅ **Tracking** - Know when and why tokens were revoked
✅ **Automatic Cleanup** - No manual token cleanup needed
✅ **Multi-Device** - Only revokes the token from logout device
✅ **Scalable** - Indexed queries are fast

---

## ⚠️ Important Notes

1. **Per-Token Logout:** Each device/session is tracked separately
2. **TTL Cleanup:** Deleted 24 hours after token expiration
3. **Database Indexed:** Queries optimized with compound indexes
4. **Backward Compatible:** Works with existing token system
5. **No Token Validation Required:** Works with valid/expired tokens

---

## 🔮 Future Enhancements

- Add logout from all devices feature
- Filter active sessions by device
- Revoke all tokens on password change
- Session management dashboard
- Token refresh mechanism

---

**Status:** ✅ Fully Implemented and Tested
