# URL Shortener Using Trie Data Structure

A high-performance URL shortener service built with NestJS and MongoDB, implementing a custom Trie data structure for efficient URL storage and retrieval. This project demonstrates advanced data structure implementation in a real-world application.

## 🌟 Features

- **Trie-Based Storage**: Custom Trie implementation for efficient URL mapping
- **High Performance**: O(k) time complexity for both shortening and expanding URLs
- **Collision Handling**: Automatic collision detection and resolution
- **MongoDB Integration**: Persistent storage using Mongoose ODM
- **RESTful API**: Clean and intuitive API endpoints
- **Automatic Redirects**: Seamless redirection to original URLs
- **TypeScript Support**: Full type safety and modern JavaScript features
- **Scalable Architecture**: Built with NestJS for enterprise-grade applications

## 🏗️ Architecture Overview

### Trie Data Structure Implementation

The core innovation of this project is the implementation of a Trie (Prefix Tree) data structure for URL storage:

```
Root Node (start_node)
├── 'A' → Node1
│   ├── 'B' → Node2
│   │   └── 'C' → Node3 (stores: https://example.com)
│   └── 'D' → Node4
└── 'E' → Node5
    └── 'F' → Node6 (stores: https://google.com)
```

### How It Works

1. **URL Shortening**: 
   - Generate a 6-character random string
   - Traverse the Trie character by character
   - Create new nodes if path doesn't exist
   - Store the original URL at the leaf node

2. **URL Expansion**:
   - Traverse the Trie using the short URL characters
   - Retrieve the original URL from the leaf node
   - Handle invalid short URLs gracefully

## 🛠️ Tech Stack

- **Framework**: NestJS
- **Database**: MongoDB with Mongoose ODM
- **Language**: TypeScript
- **Data Structure**: Custom Trie Implementation
- **Environment**: dotenv for configuration
- **Package Manager**: pnpm/npm

## 📋 Prerequisites

- Node.js (v18 or higher)
- MongoDB (local or cloud instance)
- pnpm (recommended) or npm

## 🚀 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd URL_Shortner_Using_Trie
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   # or
   npm install
   ```

3. **Environment Setup**
   Create a `.env` file in the root directory:
   ```env
   # Database Configuration
   CONNECT_DB_KEY=mongodb://localhost:27017/url-shortener
   
   # Trie Configuration
   START_NODE=your-start-node-id-here
   
   # Server Configuration
   PORT=3000
   
   # Environment
   NODE_ENV=development
   ```

4. **Initialize the Trie**
   You need to create an initial root node in MongoDB:
   ```javascript
   // Connect to your MongoDB and create the start node
   db.url.insertOne({
     _id: ObjectId("your-start-node-id-here"),
     url: "/",
     shortUrl: "",
     next: {}
   })
   ```

5. **Start MongoDB**
   Make sure MongoDB is running on your system.

## 🏃‍♂️ Running the Application

### Development Mode
```bash
pnpm run dev
# or
npm run dev
```

### Production Mode
```bash
pnpm run build
pnpm run start:prod
# or
npm run build
npm run start:prod
```

### Debug Mode
```bash
pnpm run start:debug
# or
npm run start:debug
```

## 📚 API Documentation

The API runs on `http://localhost:3000` by default.

### Endpoints

#### Create Short URL
```http
POST /url
Content-Type: application/json

{
  "url": "https://www.example.com/very/long/url/path"
}
```

**Response:**
```json
"AbC123"
```

#### Redirect to Original URL
```http
GET /url/{shortUrl}
```

**Response:**
- **301 Redirect** to the original URL
- **404 Not Found** if short URL doesn't exist

### Example Usage

```bash
# Create a short URL
curl -X POST http://localhost:3000/url \
  -H "Content-Type: application/json" \
  -d '{"url": "https://www.google.com"}'

# Response: "XyZ789"

# Access the short URL (will redirect to original)
curl -I http://localhost:3000/url/XyZ789
# Response: HTTP/1.1 301 Moved Permanently
# Location: https://www.google.com
```

## 📊 Data Models

### URL Node Schema
```typescript
{
  _id: ObjectId;              // MongoDB document ID
  url: string;                // Original URL (empty for intermediate nodes)
  shortUrl: string;           // Short URL (empty for intermediate nodes)
  next: Map<string, string>; // Character → Next Node ID mapping
}
```

### Trie Structure Example
```typescript
// Root node
{
  _id: "start_node_id",
  url: "/",
  shortUrl: "",
  next: {
    "A": "node_a_id",
    "B": "node_b_id"
  }
}

// Leaf node storing actual URL
{
  _id: "leaf_node_id",
  url: "https://example.com",
  shortUrl: "AbC123",
  next: {}
}
```

## 🔧 Algorithm Details

### URL Shortening Algorithm
```typescript
async createUrl(longUrl: string): Promise<string> {
  1. Generate random 6-character string
  2. For each character in short URL:
     a. Check if current node has next[character]
     b. If yes, move to next node
     c. If no, create new node and update mapping
  3. Store original URL at leaf node
  4. Handle collisions by regenerating if needed
}
```

### URL Expansion Algorithm
```typescript
async getUrl(shortUrl: string): Promise<string> {
  1. Start from root node
  2. For each character in short URL:
     a. Check if current node has next[character]
     b. If yes, move to next node
     c. If no, return empty (invalid short URL)
  3. Return URL from leaf node
}
```

## ⚡ Performance Characteristics

- **Time Complexity**: O(k) where k is the length of short URL (6 characters)
- **Space Complexity**: O(n) where n is the number of URLs stored
- **Collision Resolution**: Up to 20 attempts for unique short URL generation
- **Memory Efficiency**: Shared prefixes reduce storage overhead

## 🧪 Testing

### Run Tests
```bash
pnpm run test
# or
npm run test
```

### Run Tests in Watch Mode
```bash
pnpm run test:watch
# or
npm run test:watch
```

### Run E2E Tests
```bash
pnpm run test:e2e
# or
npm run test:e2e
```

### Generate Coverage Report
```bash
pnpm run test:cov
# or
npm run test:cov
```

## 🔍 Code Quality

### Linting
```bash
pnpm run lint
# or
npm run lint
```

### Formatting
```bash
pnpm run format
# or
npm run format
```

## 📁 Project Structure

```
src/
├── url/
│   ├── url.controller.ts    # URL endpoints
│   ├── url.module.ts       # URL module configuration
│   ├── url.schema.ts       # MongoDB schema for Trie nodes
│   └── url.service.ts      # Trie implementation and business logic
├── app.controller.ts       # Root controller
├── app.module.ts          # Root module
├── app.service.ts         # Root service
├── main.ts               # Application entry point
└── const.ts             # Environment constants
```

## 🔐 Key Features Explained

### Collision Handling
The system handles collisions by:
1. Generating a new random short URL
2. Checking if the path already exists in the Trie
3. Retrying up to 20 times for uniqueness
4. Failing gracefully if no unique URL can be generated

### Memory Efficiency
- **Shared Prefixes**: Common URL prefixes share the same Trie path
- **Lazy Loading**: Nodes are created only when needed
- **Minimal Storage**: Only leaf nodes store actual URLs

### Scalability Considerations
- **Horizontal Scaling**: Each Trie can be sharded by prefix
- **Caching**: Frequently accessed nodes can be cached
- **Database Optimization**: Proper indexing on node IDs

## 🚀 Deployment

### Environment Variables for Production
```env
NODE_ENV=production
PORT=3000
CONNECT_DB_KEY=mongodb://your-production-db-url
START_NODE=your-production-start-node-id
```

### Docker Deployment (Optional)
```bash
# Build Docker image
docker build -t url-shortener-trie .

# Run container
docker run -p 3000:3000 url-shortener-trie
```
