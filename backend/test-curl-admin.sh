# Register an admin
curl -X POST http://localhost:5000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "adminuser",
    "password": "adminpass",
    "full_name": "Admin User",
    "email": "admin@example.com",
    "role": "admin"
  }'

# Login as admin
curl -X POST http://localhost:5000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "adminuser",
    "password": "adminpass"
  }'

# Get all users (replace <TOKEN>)
curl -X GET http://localhost:5000/api/admin/users \
  -H "Authorization: Bearer <TOKEN>"

# Get all doctors (replace <TOKEN>)
curl -X GET http://localhost:5000/api/admin/doctors \
  -H "Authorization: Bearer <TOKEN>"

# Get all patients (replace <TOKEN>)
curl -X GET http://localhost:5000/api/admin/patients \
  -H "Authorization: Bearer <TOKEN>"

# Get a single user by ID (replace <TOKEN> and <USER_ID>)
curl -X GET http://localhost:5000/api/admin/users/<USER_ID> \
  -H "Authorization: Bearer <TOKEN>"

# Create a new user (replace <TOKEN>)
curl -X POST http://localhost:5000/api/admin/users \
  -H "Authorization: Bearer <TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{
    "username": "newuser",
    "password": "newpass",
    "full_name": "New User",
    "email": "newuser@example.com",
    "role": "patient"
  }'

# Update a user's details (replace <TOKEN> and <USER_ID>)
curl -X PUT http://localhost:5000/api/admin/users/<USER_ID> \
  -H "Authorization: Bearer <TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{
    "full_name": "Updated Name",
    "email": "updated@example.com"
  }'

# Update a user's role (replace <TOKEN> and <USER_ID>)
curl -X PUT http://localhost:5000/api/admin/users/<USER_ID>/role \
  -H "Authorization: Bearer <TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{"role": "doctor"}'

# Delete a user (replace <TOKEN> and <USER_ID>)
curl -X DELETE http://localhost:5000/api/admin/users/<USER_ID> \
  -H "Authorization: Bearer <TOKEN>"

# (Optional) Get system stats or logs if your API supports it (replace <TOKEN>)
curl -X GET http://localhost:5000/api/admin/stats \
  -H "Authorization: Bearer <TOKEN>"

curl -X GET http://localhost:5000/api/admin/logs \
  -H "Authorization: Bearer <TOKEN>"

# ...add any other admin-specific endpoints your backend supports...
