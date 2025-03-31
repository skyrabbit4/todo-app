# Full-Stack Todo App

This is a full‑stack Todo application that demonstrates a simple CRUD (Create, Read, Update, Delete) functionality using a .NET backend with SQLite and an Angular frontend styled with Angular Material.

## Table of Contents

- [Features](#features)
- [Prerequisites](#prerequisites)
- [Project Structure](#project-structure)
- [Backend Setup (.NET)](#backend-setup-net)
- [Frontend Setup (Angular)](#frontend-setup-angular)
- [Running the Application](#running-the-application)
- [Future Enhancements](#future-enhancements)
- [License](#license)

## Features

- **CRUD Operations:** Create, read, update, and delete Todo items.
- **Backend:** ASP.NET Core Web API using Entity Framework Core with SQLite for persistent data storage.
- **Frontend:** Angular standalone application using Angular Material for a modern UI.
- **Responsive UI:** Designed to be responsive and user-friendly.
- **CORS Enabled:** The .NET API is configured to allow requests from the Angular development server.

## Prerequisites

- [.NET 7 SDK](https://dotnet.microsoft.com/download/dotnet/7.0)
- [Node.js and npm](https://nodejs.org/en/download/)
- [Angular CLI](https://angular.io/cli) (install via `npm install -g @angular/cli`)
- [Visual Studio Code](https://code.visualstudio.com/) or your preferred IDE/editor

## Project Structure

The repository is organized as a monorepo containing both the backend and frontend:

