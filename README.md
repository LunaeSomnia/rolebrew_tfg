# Rolebrew

**Rolebrew is a free Pathfinder 2e explorer, character creator & simulator tool**.

## Project structure

The project is composed of three smaller projects situated in three different directories:
- Data Transformer (`data-transformer/`): Transforms a series of [compatible JSON files](https://github.com/foundryvtt/pf2e) from the Pathfinder 2e system into a more readable and usable form for the application and inserts them into a MongoDB database.
- Backend (`backend/`): Constitutes the main backend for the application: serves data requests for the Compendium, handles the character creator and the simulator.
- Frontend (`frontend/`): Constitutes the application's frontend.

Docker Compose is used to deploy the MongoDB database and each of the sub-projects.

### Data Transformer

Built in Typescript, transforms each model using the [`class-transformer`](https://github.com/typestack/class-transformer) package.

Models are divided into *primary* and *secondary*. Primary models are the ones directly requested to the backend (ancestry, feat, action, etc) and secondary models are any model used within a primary model (damage, publication, rule, etc)

### Backend

Built in Rust, uses [`actix-web`](https://github.com/actix/actix-web) to listen for requests, along with the [`mongodb` rust driver](https://github.com/mongodb/mongo-rust-driver) to connect to the MongoDB instance. It also uses WebSockets to handle simulation sessions.

### Frontend

Built in Sveltekit 2 and Svelte 5.

## Usage

We include a `docker-compose.yaml` to quickly deploy the application using Docker Compose.

To deploy the application, firstly create a directory next to the `docker-compose.yaml` file called `env` and four `.env` files with the following environment variables:
- `backend.env`:
    - `JWT_SECRET`
    - `MONGO_URL`
- `frontend.env`:
    - `PUBLIC_BACKEND_URL` set to `"http://backend:8080/api/"`
    - `JWT_SECRET`
- `data-transformer.env`:
    - `MONGO_URL`
- `data-transformer.env`:
    - `MONGO_INITDB_DATABASE` set to `rolebrew`
    - `MONGO_INITDB_ROOT_USERNAME` set to `rolebrew`
    - `MONGO_INITDB_ROOT_PASSWORD`


Then, in the project's root directory, run the following command:

```bash
docker-compose up --build
```

If you already built the project for the first time, you can run the following command instead:

```bash
docker-compose up
```

### Manual build

#### Frontend

To build the frontend, follow these steps:
1. Install the `npm` node runtime or similar.

> You can also use `bun`, `pnpm`, `yarn` or any other package manager & javascript runtime. I use `bun` personally.

2. Copy the `frontend.env` file created in the *usage* section and name it `.env`. Place it in the `frontend/` directory.

3. Open a terminal window and navigate to the `frontend/` directory.

4. Execute the following command:

```bash
npm run build
```

This will generate a compiled JS, HTML & CSS version of the SvelteKit application under the `build/` directory.

#### Backend

To build the backend, follow these steps:

1. Install rust from the [official documentation](https://www.rust-lang.org/tools/install)
2. Open a terminal window and navigate to the `backend/` directory.
3. Execute the following command:

```bash
cargo build --release
```

This will generate an executable file under `target/release/` named `backend`.

### Other requisites

Since the MongoDB instance is handled by a docker container, and the data to populate the database is handled by Docker Compose, after manually building and running the frontend and backend, nothing will work.

It is mandatory to set up the MongoDB instance first, then run the data transformer, and then the backend and/or the frontend (in no particular order).

It is also necessary to set up the environment variables as listed in the *usage* section.

## License

All rights reserved. No use, modification, or redistribution allowed.
Read the license [here](./LICENSE)
