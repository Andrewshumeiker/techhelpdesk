# TechHelpDesk – API REST con NestJS y TypeORM

Este proyecto implementa una **API REST** para gestionar el ciclo de vida de tickets de soporte técnico.  Fue diseñada como una prueba de desempeño para el módulo de _Node.js con NestJS y TypeORM_.  La API permite registrar usuarios con distintos roles (Administrador, Técnico y Cliente), crear y administrar tickets, gestionar categorías de incidencia y consultar el historial de tickets según cliente o técnico.

## Tecnologías utilizadas

- **NestJS**: framework para Node.js que facilita la creación de APIs modulares y tipadas.
- **TypeORM**: ORM para manejar la persistencia en una base de datos relacional **PostgreSQL**.
- **JWT**: para autenticación y manejo de sesiones.
- **Swagger/OpenAPI**: documentación interactiva de los endpoints.
- **Jest**: pruebas unitarias.

## Estructura del proyecto

La aplicación está organizada en módulos siguiendo las buenas prácticas de NestJS.  Cada dominio (usuarios, clientes, técnicos, categorías, tickets) cuenta con su propio módulo, controlador, servicio, entidad y DTOs.  Además, existe un módulo de autenticación y un módulo "common" que agrupa interceptores, filtros de excepciones, guards de roles y decoradores personalizados.

    techhelpdesk/
    ├── src/
    │   ├── app.module.ts           # Módulo raíz de la aplicación
    │   ├── main.ts                 # Punto de entrada; configura Swagger e interceptores globales
    │   ├── common/                 # Código compartido (decoradores, guards, filtros, interceptores)
    │   ├── auth/                   # Autenticación JWT y login/registro
    │   ├── users/                  # CRUD de usuarios y roles
    │   ├── clients/                # CRUD de clientes
    │   ├── technicians/            # CRUD de técnicos
    │   ├── categories/             # CRUD de categorías de incidencia
    │   ├── tickets/                # Gestión de tickets y cambio de estado
    │   └── seeds/                  # Script para poblar la base de datos con datos iniciales
    ├── test/                       # Pruebas unitarias con Jest
    ├── .env.example               # Ejemplo de variables de entorno
    ├── docker-compose.yml         # Composición de servicios (API + PostgreSQL)
    ├── Dockerfile                 # Imagen Docker para la API
    ├── package.json               # Dependencias y scripts de npm
    └── tsconfig*.json             # Configuración de TypeScript

## Instalación y ejecución

1. **Clonar el repositorio**

       git clone https://github.com/usuario/techhelpdesk.git
       cd techhelpdesk

2. **Instalar dependencias**

   Este proyecto utiliza npm.  Asegúrate de tener Node.js ≥ 18 instalado.

       npm install

3. **Configurar las variables de entorno**

   Copia el archivo `.env.example` a `.env` y edita los valores según tu entorno.  Por ejemplo:

       # Puerto en el que escuchará la API
       PORT=3000

       # Configuración de la base de datos PostgreSQL
       DB_HOST=localhost
       DB_PORT=5432
       DB_USERNAME=postgres
       DB_PASSWORD=postgres
       DB_NAME=techhelpdesk

       # Clave secreta para firmar JWT
       JWT_SECRET=changeme
       JWT_EXPIRES_IN=3600s

4. **Iniciar la base de datos**

   Se utiliza PostgreSQL como motor de almacenamiento.  Puedes levantar la base de datos con Docker mediante `docker-compose`:

       docker-compose up db

   Esto creará un contenedor de PostgreSQL con persistencia de datos.  Asegúrate de que las credenciales coincidan con las de tu `.env`.

5. **Ejecutar la aplicación en modo desarrollo**

       npm run start:dev

   La API estará disponible en `http://localhost:3000`.  Los endpoints están documentados en Swagger.

6. **Acceder a la documentación Swagger**

   Una vez iniciada la aplicación, visita `http://localhost:3000/docs`.  Encontrarás una interfaz interactiva con la descripción de cada endpoint, ejemplos de request/response y la opción de probar las peticiones directamente desde el navegador.

7. **Semillas de datos**

   El directorio `src/seeds` contiene un script de TypeORM para poblar la base de datos con usuarios, clientes, técnicos y categorías de ejemplo.  Puedes ejecutarlo mediante:

       npm run seed

   Asegúrate de que la base de datos esté en funcionamiento y de que las credenciales sean correctas antes de ejecutar el seeding.

## Pruebas unitarias

Este proyecto incluye pruebas básicas con **Jest**.  Para ejecutarlas y verificar la cobertura, utiliza:

    npm run test
    npm run test:cov

Las pruebas incluidas validan la creación de tickets y el cambio de su estado respetando las reglas de negocio.

## Dockerización (opcional)

Se proporciona un **Dockerfile** para construir una imagen de la API y un archivo **docker-compose.yml** para levantar tanto la API como una base de datos PostgreSQL con volúmenes persistentes.  Para ejecutar todo el stack con Docker:

    docker-compose up

Esto levantará los servicios `api` y `db`.  La aplicación quedará disponible en `http://localhost:3000` y PostgreSQL escuchará en el puerto `5432`.

## Información adicional requerida

- **Nombre del coder y clan**: Andres covaleda, linus.
- **Ejemplos de endpoints**: en Swagger encontrarás ejemplos de peticiones y respuestas.  Puedes ampliar esta documentación en el README si lo deseas.
- **Dump de la base de datos**: se incluyen semillas en lugar de un dump SQL.  Si prefieres un archivo `.sql`, puedes exportar la estructura y los datos iniciales desde PostgreSQL y añadirlo al repositorio.
- **Archivo `.env` de ejemplo**: el archivo `.env.example` provee un punto de partida.  _No incluyas contraseñas reales en el repositorio._

## Licencia

Este proyecto se distribuye bajo la licencia MIT.  Puedes copiar y modificar el código según sea necesario para la prueba técnica.