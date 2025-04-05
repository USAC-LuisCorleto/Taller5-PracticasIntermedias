# Taller 5 - HTML, CSS y JS Fundamentos para el desarrollo web

Este proyecto consiste en una aplicación de encuestas sobre lenguajes de programación favoritos, implementada con una arquitectura cliente-servidor.

## Estructura del Proyecto

```
├── backend/              # Servidor API con Express y Supabase
│   ├── config/           # Configuración de conexión a Supabase
│   ├── .env              # Variables de entorno
│   ├── index.js          # Punto de entrada del servidor
│   └── package.json      # Dependencias del backend
└── frontend/             # Interfaz de usuario con HTML, CSS y JavaScript
    ├── index.html        # Estructura HTML de la aplicación
    ├── styles.css        # Estilos CSS de la aplicación
    └── index.js          # Lógica de interacción del cliente
```

## Backend API

El backend está construido con Express.js y utiliza Supabase como base de datos.

### Endpoints disponibles

#### `GET /api/preguntas`

Obtiene todas las preguntas disponibles.

**Respuesta:**
```json
[
  {
    "id": 1,
    "pregunta": "¿Cuál es tu lenguaje de programación favorito?",
    "created_at": "2023-06-01T12:00:00Z"
  }
]
```

#### `GET /api/preguntas/:id`

Obtiene una pregunta específica por su ID junto con sus posibles respuestas.

**Respuesta:**
```json
{
  "pregunta": {
    "id": 1,
    "pregunta": "¿Cuál es tu lenguaje de programación favorito?",
  },
  "respuestas": [
    {
      "id": 1,
      "pregunta_id": 1,
      "respuesta": "JavaScript",
      "votos": 1
    },
    {
      "id": 2,
      "pregunta_id": 1,
      "respuesta": "Python",
      "votos": 2
    }
  ]
}
```

#### `POST /api/votar`

Registra un voto para una respuesta específica.

**Solicitud:**
```json
{
  "respuestaId": 1
}
```

**Respuesta:**
```json
{
  "message": "Voto registrado exitosamente",
  "respuesta": {
    "id": 1,
    "pregunta_id": 1,
    "respuesta": "JavaScript",
    "votos": 1
  }
}
```

#### `GET /api/resultados`

Obtiene los resultados actuales de la votación ordenados por número de votos.

**Respuesta:**
```json
[
  {
    "id": 1,
    "respuesta": "JavaScript",
    "votos": 1
  },
  {
    "id": 2,
    "respuesta": "Python",
    "votos": 2
  }
]
```

## Frontend

La interfaz de usuario permite a los visitantes:
- Ver la pregunta de la encuesta
- Seleccionar una opción
- Enviar su voto
- Ver los resultados actuales con gráficos de barras
- Volver a votar si lo desean

## Configuración y Ejecución

### Documentación de la API

La documentación completa de la API está disponible en Postman para facilitar las pruebas y la integración:
[Documentación de la API en Postman](https://documenter.getpostman.com/view/29771444/2sB2cU9N6L#323f200c-6fa2-4d6a-8a56-106c73bc52b2)

### Frontend

El frontend puede ser servido mediante cualquier servidor web estático. Para desarrollo, puede usar:

```
cd frontend
npx serve
```

O simplemente abrir el archivo `index.html` en un navegador.

## Tecnologías Utilizadas

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Backend**: Node.js, Express.js
- **Base de datos**: Supabase (PostgreSQL)
- **Despliegue**: Render (backend)

## Notas sobre el API

- La API maneja adecuadamente los errores y proporciona mensajes descriptivos
- Todas las operaciones de base de datos se realizan a través del cliente de Supabase
- Los endpoints siguen principios RESTful
- CORS está habilitado para permitir solicitudes desde el frontend