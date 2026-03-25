CREATE TABLE usuarios (
id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
nombre text NOT NULL,
email text NOT NULL,
created_at timestamp DEFAULT now()
);
