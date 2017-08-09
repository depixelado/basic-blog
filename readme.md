# Basic microservices blog system

## Introduction

 Basic blog system based on microservices.

 ### API service

  Blog API with basic authentication. Username: ```admin``` password: ```admin```
  
  Current blog entities:
  1. Posts
  2. Users
 

## Installation

> To an easy installation of this project **Docker** is required.

1. Install and create the app containers ```docker-compose up -d```
2. Install dependencies ```npm install```
3. Create a .env file from .env.sample and customize it
4. Test everything works fine with ```npm run test```
5. Seed databae ```npm run load-fixtures```
6. Run the server ```npm run init```
