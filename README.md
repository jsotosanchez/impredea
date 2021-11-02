# Proyecto Final de Ingeniería | Universidad Argentina de la Empresa

## Impredea

Plataforma de servicios de impresión tridimensional y manufactura aditiva dentro de Buenos Aires en 2021

Integrantes:

- Gómez Hernández, Maria Paula - LU: 1108264
- Soto Sánchez, Jose Miguel - LU: 1087702

Tutor: Galuppo, Guido

# Link a aplicación web:

[Impredea](https://impredea.vercel.app/)

## Requisitos para usar:

- Una cuenta de google, para poder crear registarse en la aplicación.

---

---

# Como ejecutar la aplicación en ambiente propio

# Spanish

Primero necesitas configurar una cuenta en los siguientes proveedores

- [Hasura](https://hasura.io/)
- [SendGrid](https://sendgrid.com/)
- [Heroku](https://heroku.com/)
- [Vercel](https://vercel.com/)
- [Auth0](https://auth0.com/)
- [AWS](https://aws.amazon.com/) necesitas configurar una instancia de S3

Después de configurar sus cuentas en cada proveedor, debes crear un archivo .env.local para configurar sus claves. Hay un archivo de ejemplo llamado ".env.example".

### Configurar esquema en Hasura

Después de configurar su proyecto Hasura, necesita configurar su base de datos. Recomendamos utilizar heroku, ya que es la forma más sencilla de hacerlo, ya que puede hacerlo desde la GUI de Hasura. Hay un diagrama de la base de datos en la carpeta docs/diagrams llamado Database.png

### Configurar la bucket de S3

Debe configurar su depósito como público y agregar la siguiente política.

```
{
    "Version": "2008-10-17",
    "Id": "Policy1380877762691",
    "Statement": [
        {
            "Sid": "Stmt1380877761162",
            "Effect": "Allow",
            "Principal": {
                "AWS": "*"
            },
            "Action": "s3:GetObject",
            "Resource": "arn:aws:s3:::YOUR_BUCKET_NAME/*"
        }
    ]
}
```

## Precaución!

Dicha bucket solo debe usarse para imágenes públicas, ya que cualquier persona tendrá acceso al contenido del mismo.

Por ultimo ejecutar el siguiente comando:

```bash
yarn dev
```

# English

## How to run

First you need to configure an account in the following providers:

- [Hasura](https://hasura.io/)
- [SendGrid](https://sendgrid.com/)
- [Heroku](https://heroku.com/) (this one can be done through Hasura)
- [Vercel](https://vercel.com/)
- [Auth0](https://auth0.com/)
- [AWS](https://aws.amazon.com/) you need to configure an S3 bucket

After setting up your accounts in each provider, you need to create a .env.local file to set up your keys. There is an example file called ".env.example" in the root folder.

### Configuring scheme in Hasura

After setting up your Hasura project, you need to set up your database. We recommend hosting it in heroku, as it is the simplest way to do it since you can do it from Hasura GUI. There's a diagram of the DB in the /docs/diagrams folder called Database.png

### Configuring S3 Bucket

You need to set up your bucket as public, and add the following policy.

```
{
    "Version": "2008-10-17",
    "Id": "Policy1380877762691",
    "Statement": [
        {
            "Sid": "Stmt1380877761162",
            "Effect": "Allow",
            "Principal": {
                "AWS": "*"
            },
            "Action": "s3:GetObject",
            "Resource": "arn:aws:s3:::YOUR_BUCKET_NAME/*"
        }
    ]
}
```

## Warning!

Said bucket should only be used for public images, since anyone will have access to the content of it.

Lastly, run the development server:

```bash
yarn dev
```
