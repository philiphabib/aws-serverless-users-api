#!/bin/bash

# ================================
#  CONFIGURATION
# ================================
API_URL="https://i9wm4w38r9.execute-api.us-east-1.amazonaws.com/prod/users"

# ================================
#  COLORS
# ================================
GREEN="\e[32m"
BLUE="\e[34m"
YELLOW="\e[33m"
RED="\e[31m"
NC="\e[0m" # No Color

section() {
  echo -e "${BLUE}\n==============================="
  echo -e " $1"
  echo -e "===============================${NC}"
}

# ================================
#  TEST USERS
# ================================
USERS=(
  '{"userId":"201","name":"John","email":"john@example.com","age":22}'
  '{"userId":"202","name":"Jane","email":"jane@example.com","age":27}'
  '{"userId":"203","name":"Mike","email":"mike@example.com","age":35}'
)

# ================================
#  START TESTING
# ================================

# --------- CREATE USERS ---------
section "CREATE USERS (POST)"
for user in "${USERS[@]}"; do
  curl -s -X POST "$API_URL" \
    -H "Content-Type: application/json" \
    -d "$user" | jq
done

# --------- GET SINGLE USER ---------
section "GET SINGLE USER (GET)"
for user in "${USERS[@]}"; do
  uid=$(echo "$user" | jq -r '.userId')
  curl -s "$API_URL?userId=$uid" | jq
done

# --------- GET ALL USERS ---------
section "GET ALL USERS (GET)"
curl -s "$API_URL" | jq

# --------- UPDATE USERS ---------
section "UPDATE USER (PUT)"
for user in "${USERS[@]}"; do
  uid=$(echo "$user" | jq -r '.userId')
  name=$(echo "$user" | jq -r '.name')
  email=$(echo "$user" | jq -r '.email')
  age=$(echo "$user" | jq -r '.age')
  # append "_Updated" and increment age
  updated_name="${name} Updated"
  updated_email=$(echo "$email" | sed 's/@/_updated@/')
  updated_age=$((age + 1))
  curl -s -X PUT "$API_URL?userId=$uid" \
    -H "Content-Type: application/json" \
    -d "{\"name\":\"$updated_name\",\"email\":\"$updated_email\",\"age\":$updated_age}" | jq
done

# --------- GET UPDATED USERS ---------
section "GET UPDATED USER (GET)"
for user in "${USERS[@]}"; do
  uid=$(echo "$user" | jq -r '.userId')
  curl -s "$API_URL?userId=$uid" | jq
done

# --------- DELETE USERS ---------
section "DELETE USER (DELETE)"
for user in "${USERS[@]}"; do
  uid=$(echo "$user" | jq -r '.userId')
  curl -s -X DELETE "$API_URL?userId=$uid" | jq
done

# --------- GET ALL USERS AFTER DELETE ---------
section "GET ALL USERS AFTER DELETE"
curl -s "$API_URL" | jq

echo -e "${GREEN}\nAll tests completed!${NC}"

