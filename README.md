# Event Management Assignment

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 15.0.4.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

## JSON Server

Run `json-server --watch db.json` to run the mock backend locally.

## Documentation

1. **src/**:  Main source directory for the Angular application.
2. **db.json**:  Mock database for local development using JSON server.

### Inside src/:

1. **app/:** This directory contains the core components, services, and modules of the Angular application.
    - **components/**: Contains reusable components.
    - **services/:** Contains services for handling business logic and communication with APIs.
    - **pages/:** Contains 3 pages, login, register and event-list.
    - **guards/:** Contains auth guard for handling user authentication.
    - **models/:** Contains data models used in the application.
        - **auth.service.ts:** Contains APIs for handling user authentication.
        - **event.service.ts:** Contains APIs for handling event related functionalities such as add, delete and update.   
    - **app.module.ts:** The root module that bootstraps the application.
    - **app.component.ts:** The root component of the application.
    - **app.routing.module.ts:** Contains different routes of the application.
    - **material-module.ts:** Contains all the modules of angular material.
      
1. **assets/**: Contains static files such as images and icons.
2. **index.html:** The main HTML file that gets served when the application is launched.

