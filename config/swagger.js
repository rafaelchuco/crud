const swaggerJSDoc = require('swagger-jsdoc');

const swaggerDefinition = {
  openapi: '3.0.3',
  info: {
    title: 'API REST CRUD - Usuarios',
    version: '1.0.0',
    description:
      'Documentacion oficial del CRUD de usuarios con Node.js, Express y Supabase.',
    contact: {
      name: 'Equipo CRUD Usuarios',
    },
  },
  servers: [
    {
      url: 'http://localhost:10000',
      description: 'Servidor local',
    },
    {
      url: 'https://crud-rhcq.onrender.com',
      description: 'Servidor de produccion en Render',
    },
  ],
  tags: [
    {
      name: 'Health',
      description: 'Estado y disponibilidad de la API',
    },
    {
      name: 'Usuarios',
      description: 'Operaciones CRUD sobre usuarios',
    },
  ],
  components: {
    schemas: {
      Usuario: {
        type: 'object',
        properties: {
          id: {
            type: 'string',
            format: 'uuid',
            example: '0d3d3f1c-bca6-4c2f-88af-2d8db5d6aa5f',
          },
          nombre: {
            type: 'string',
            example: 'Ana Torres',
          },
          email: {
            type: 'string',
            format: 'email',
            example: 'ana@correo.com',
          },
          telefono: {
            type: 'string',
            example: '+51945612378',
          },
          direccion: {
            type: 'string',
            example: 'Jr. Primavera 456',
          },
          activo: {
            type: 'boolean',
            example: true,
          },
          created_at: {
            type: 'string',
            format: 'date-time',
            example: '2026-03-25T02:30:00.000Z',
          },
          updated_at: {
            type: 'string',
            format: 'date-time',
            example: '2026-03-25T03:10:00.000Z',
          },
        },
      },
      CrearUsuarioRequest: {
        type: 'object',
        required: ['nombre', 'email', 'telefono', 'direccion'],
        properties: {
          nombre: {
            type: 'string',
            example: 'Ana Torres',
          },
          email: {
            type: 'string',
            format: 'email',
            example: 'ana@correo.com',
          },
          telefono: {
            type: 'string',
            example: '+51945612378',
          },
          direccion: {
            type: 'string',
            example: 'Jr. Primavera 456',
          },
          activo: {
            type: 'boolean',
            example: true,
            description: 'Campo opcional, por defecto true',
          },
        },
      },
      ActualizarUsuarioRequest: {
        type: 'object',
        properties: {
          nombre: {
            type: 'string',
            example: 'Ana Actualizada',
          },
          email: {
            type: 'string',
            format: 'email',
            example: 'ana.actualizada@correo.com',
          },
          telefono: {
            type: 'string',
            example: '+51912345678',
          },
          direccion: {
            type: 'string',
            example: 'Calle Nueva 999',
          },
          activo: {
            type: 'boolean',
            example: false,
          },
        },
      },
      ErrorResponse: {
        type: 'object',
        properties: {
          ok: {
            type: 'boolean',
            example: false,
          },
          message: {
            type: 'string',
            example: 'Error interno del servidor',
          },
          error: {
            type: 'string',
            example: 'Detalle tecnico opcional',
          },
        },
        required: ['ok', 'message'],
      },
      HealthResponse: {
        type: 'object',
        properties: {
          ok: {
            type: 'boolean',
            example: true,
          },
          message: {
            type: 'string',
            example: 'API de usuarios funcionando correctamente',
          },
        },
      },
      UsuarioSingleResponse: {
        type: 'object',
        properties: {
          ok: {
            type: 'boolean',
            example: true,
          },
          message: {
            type: 'string',
            example: 'Usuario creado correctamente',
          },
          data: {
            $ref: '#/components/schemas/Usuario',
          },
        },
        required: ['ok', 'data'],
      },
      UsuarioListResponse: {
        type: 'object',
        properties: {
          ok: {
            type: 'boolean',
            example: true,
          },
          data: {
            type: 'array',
            items: {
              $ref: '#/components/schemas/Usuario',
            },
          },
        },
        required: ['ok', 'data'],
      },
    },
  },
  paths: {
    '/': {
      get: {
        tags: ['Health'],
        summary: 'Health check de la API',
        description: 'Confirma que el servidor se encuentra levantado.',
        responses: {
          200: {
            description: 'Estado correcto',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/HealthResponse',
                },
              },
            },
          },
        },
      },
    },
    '/usuarios': {
      get: {
        tags: ['Usuarios'],
        summary: 'Obtener todos los usuarios',
        description: 'Retorna todos los usuarios ordenados por created_at desc.',
        responses: {
          200: {
            description: 'Listado de usuarios',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/UsuarioListResponse',
                },
              },
            },
          },
          500: {
            description: 'Error interno al obtener usuarios',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ErrorResponse',
                },
              },
            },
          },
        },
      },
      post: {
        tags: ['Usuarios'],
        summary: 'Crear un usuario',
        description:
          'Crea un usuario con nombre, email, telefono y direccion obligatorios.',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/CrearUsuarioRequest',
              },
            },
          },
        },
        responses: {
          201: {
            description: 'Usuario creado correctamente',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/UsuarioSingleResponse',
                },
              },
            },
          },
          400: {
            description: 'Error de validacion de datos',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ErrorResponse',
                },
              },
            },
          },
          409: {
            description: 'Conflicto por email duplicado',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ErrorResponse',
                },
              },
            },
          },
          500: {
            description: 'Error interno al crear usuario',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ErrorResponse',
                },
              },
            },
          },
        },
      },
    },
    '/usuarios/{id}': {
      get: {
        tags: ['Usuarios'],
        summary: 'Obtener un usuario por id',
        parameters: [
          {
            in: 'path',
            name: 'id',
            required: true,
            schema: {
              type: 'string',
              format: 'uuid',
            },
            description: 'Id del usuario',
          },
        ],
        responses: {
          200: {
            description: 'Usuario encontrado',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    ok: {
                      type: 'boolean',
                      example: true,
                    },
                    data: {
                      $ref: '#/components/schemas/Usuario',
                    },
                  },
                },
              },
            },
          },
          404: {
            description: 'Usuario no encontrado',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ErrorResponse',
                },
              },
            },
          },
        },
      },
      put: {
        tags: ['Usuarios'],
        summary: 'Actualizar un usuario por id',
        parameters: [
          {
            in: 'path',
            name: 'id',
            required: true,
            schema: {
              type: 'string',
              format: 'uuid',
            },
            description: 'Id del usuario',
          },
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/ActualizarUsuarioRequest',
              },
            },
          },
        },
        responses: {
          200: {
            description: 'Usuario actualizado correctamente',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/UsuarioSingleResponse',
                },
              },
            },
          },
          400: {
            description: 'Error de validacion de datos',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ErrorResponse',
                },
              },
            },
          },
          404: {
            description: 'Usuario no encontrado',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ErrorResponse',
                },
              },
            },
          },
          409: {
            description: 'Conflicto por email duplicado',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ErrorResponse',
                },
              },
            },
          },
        },
      },
      delete: {
        tags: ['Usuarios'],
        summary: 'Eliminar un usuario por id',
        parameters: [
          {
            in: 'path',
            name: 'id',
            required: true,
            schema: {
              type: 'string',
              format: 'uuid',
            },
            description: 'Id del usuario',
          },
        ],
        responses: {
          200: {
            description: 'Usuario eliminado correctamente',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/UsuarioSingleResponse',
                },
              },
            },
          },
          404: {
            description: 'Usuario no encontrado',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ErrorResponse',
                },
              },
            },
          },
        },
      },
    },
  },
};

const options = {
  definition: swaggerDefinition,
  apis: [],
};

const swaggerSpec = swaggerJSDoc(options);

module.exports = swaggerSpec;
