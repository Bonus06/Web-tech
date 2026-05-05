# User Registration Authentication (Tonight's Work)

## 1. Contract Table

| Route | Method | Request Payload | Response (Success) | Response (Error) | Description |
|---|---|---|---|---|---|
| `/api/signup` | `POST` | `name` (string)<br>`email` (string)<br>`password` (string) | **`201 Created`**<br>`{ success: true, message: 'Signup successful' }` | **`400 Bad Request`**<br>`{ success: false, message: 'Please provide all required fields' }`<br><br>**`409 Conflict`**<br>`{ success: false, message: 'Email already exists' }` | Registers a new user. Hashes the password using `bcrypt` before storing the user in the database. |

## 2. Activity Diagram

```mermaid
flowchart TD
    A[Start POST /api/signup] --> B{Are fields missing?}
    B -- Yes --> C[Return 400 Bad Request]
    B -- No --> D{Does Email exist?}
    D -- Yes --> E[Return 409 Conflict]
    D -- No --> F[Hash password using bcrypt]
    F --> G[Save new user to Database]
    G --> H[Return 201 Created]
```

## 3. Sequence Diagram

```mermaid
sequenceDiagram
    participant Client
    participant APIRoute as API Route (/api/signup)
    participant Bcrypt as bcrypt
    participant Database

    Client->>APIRoute: POST /api/signup (name, email, password)
    APIRoute->>Database: Find user by email
    Database-->>APIRoute: Result
    
    alt User exists
        APIRoute-->>Client: 409 Conflict
    else User does not exist
        APIRoute->>Bcrypt: Hash password (saltRounds: 10)
        Bcrypt-->>APIRoute: Hashed password
        APIRoute->>Database: Save new user record
        Database-->>APIRoute: Success confirmation
        APIRoute-->>Client: 201 Created
    end
```

## 4. GenAI Prompts

**Prompt for `Express.js` route & logic (`register.js`):**

> **Act as an expert backend developer.** Using the Contract Table and Diagrams provided above, please generate an Express.js route inside a separate file named `register.js` for handling the `POST /api/signup` logic. 
>
> The route must:
> 1. Receive `name`, `email`, and `password` from the request body.
> 2. Validate that all fields are present (return `400 Bad Request` if any are missing).
> 3. Check if the email already exists in the database. If it does, return `409 Conflict`.
> 4. If the user does not exist, use the `bcrypt` library to hash the password securely.
> 5. Save the new user record into the database.
> 6. Return `201 Created` upon successful registration.
>
> **CRITICAL INSTRUCTION:** Ensure your code has comprehensive comments explaining how it works step-by-step!
