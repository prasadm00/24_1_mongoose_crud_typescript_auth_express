# 24_mongoose_crud_typescript_auth_express


## Step 1: Initializing the TypeScript Project

First, initialize your TypeScript project with the following steps:
- 1. Install TypeScript as a development dependency:
     `npm i typescript --save-dev`
- 2. Initialize your TypeScript project using the following command:
     `npx tsc --init`
- 3. Modify your tsconfig.json file to include all TypeScript files and exclude the node_modules directory:
     `{
     "include": ["**/*"],
     "exclude": ["node_modules"]
     }`
## Step 2: Compiling the TypeScript Project 
Your project is now ready to be compiled. Run the TypeScript compiler from your project's directory:
`npx tsc`

## Step 3: Auto-Compiling Code
To automatically compile your code whenever changes are made, use the following command:
`npx tsc -w`

## Step 4: Setting Up TypeScript with Node.js and Express

- 1. Initialize a Node.js project:
  `npm init --yes`
  2. Install Express and dotenv:
  `npm install express dotenv`
  3. Install TypeScript and type definitions for Express and Node.js as development dependencies:
  `npm i -D typescript @types/express @types/node`
  4. Add the following line to your tsconfig.json file to specify the output directory:
  `"outDir": "./dist"`
## Step 5: Watching File Changes and Building the Directory
- 1. Install concurrently and nodemon as development dependencies:
  `npm install -D concurrently nodemon`
- 2. Update the scripts in your package.json file as follows:
 `"scripts": {
    "build": "npx tsc",
    "start": "node dist/index.js",
    "dev": "concurrently \"npx tsc --watch\" \"nodemon -q dist/index.js\""
}`
  3. Start your development environment using the following command:
  `npm run dev`
## Step 6: Connecting to Mongoose
- 1. Install Mongoose:
  `npm i mongoose`
