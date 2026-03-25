CREATE TABLE usuarios (
id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
nombre text NOT NULL,
email text NOT NULL UNIQUE,
telefono text NOT NULL,
direccion text NOT NULL,
activo boolean NOT NULL DEFAULT true,
created_at timestamp DEFAULT now(),
updated_at timestamp DEFAULT now()
);
