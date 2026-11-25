# openQomu Web

Web pública de [openQomu](https://github.com/qalyBuild/openQomu), disponible en <https://openqomu.qaly.dev/>. La aplicación y su documentación de autoalojamiento se mantienen en el repositorio principal.

## Desarrollo

La web es estática y no necesita compilación ni instalación de dependencias. Para servirla localmente:

```sh
python3 -m http.server 8000
```

## Publicación

El flujo de GitHub Actions publica la rama `main` en Firebase Hosting, proyecto `qomu-app`, sitio `openqomu`. Necesita el secreto de repositorio `FIREBASE_SERVICE_ACCOUNT_QOMU_APP`, con una cuenta de servicio autorizada para desplegar en ese proyecto. También puede publicarse manualmente con Firebase CLI y credenciales autorizadas:

```sh
npx firebase-tools@15 deploy --only hosting --project qomu-app
```

La configuración de seguridad y caché está en `firebase.json`.

## Licencia

El contenido del proyecto está sujeto a [AGPL-3.0](LICENSE); los componentes de terceros mantienen sus propias licencias y avisos. El nombre y el logotipo tienen condiciones específicas: consulta [TRADEMARKS.md](TRADEMARKS.md).
