
# /services/aws

**Test Case**: /services/aws:01

**Test Scenario**: Check the `Amazon Web Services` page functionality

**Test Steps**:

1. Go to https://admin.photion.app/services
2. Select `Amazon Web Services`

**Expected Results**:

1. https://admin.photion.app/services/aws should be displayed
2. A fill-in form with user data should be displayed
3. There should be a card with a `Back to all services` button that takes the user back to https://admin.photion.app/services

----

**Test Case**: /services/aws:02

**Test Scenario**: Check the login functionality with valid credentials

**Pre-requisites**: The user credentials must be valid

**Test Steps**:

1. Go to https://admin.photion.app/services/aws
2. Fill in the form with valid user credentials
3. Click `Continue`

**Expected Results**:

1. Login successful
2. Homepage https://admin.photion.app/ should be displayed
3. `List Folders` card is now visible on the homepage and is clickable

---

**Test Case**: /services/aws:03

**Test Scenario**: Check the login functionality with invalid credentials

**Pre-requisites**: The user credentials must be invalid

**Test Steps**:

1. Go to https://admin.photion.app/services/aws
2. Fill in the form with invalid user credentials


**Expected Results**:

1. The `Continue` button should be disabled.
2. Login unsuccessful
3. Remain on https://admin.photion.app/services/aws

---

**Test Case**: /services/aws:04

**Test Scenario**: Check the login functionality with an empty form


**Test Steps**:

1. Go to https://admin.photion.app/services/aws
2. Leave the fill-in form empty


**Expected Results**:

1. The `Continue` button should be disabled.
2. Remain on https://admin.photion.app/services/aws
