# WSO2 VSCode Helper Tool - RPC Code Generator

## Installation

Run below inside the rpc-generator if you are using this first time.

```bash
npm install
```

## How to generate the RPC Layer Code

First you have to setup the extension project as follows,

- Extension Folder  - This is where the extension getting implemented
- Core Folder - This is where all the core Types and Interfaces defined
- RPC Client Folder - This is where the sharable RPC client getting implemented

Each module needs to have folder paths as well,

- Extension Module - src/rpc-managers
- Core Module - src/rpc-types
- RPC Client Module - src/rpc-clients

Note: Check the ballerina extension implementation to get the idea how to structure the modules.

The first thing you have to do is to define the interfaces which needs to be used as RPC layer. 

Inside the Core Module src/rpc-types/*Component Name*/index.ts you have to define a single interface with relevant methods.


Then simply run below command from the rpc-generator path

```bash
npm run generate
```

It will generate all the related RPC layer codes. 

You have to export the rpc-types.ts and register the class objects in relevant places.

In the rpc-manager.ts you will have to implement the codes.