# Feedback del Trabajo Práctico (TP2 — MongoDB)

## Integrantes

A partir de los commits del repositorio:

- **Juan Pablo Céspedes** (`juanPabloCespedes`)
- **Nair Paz** (`Nair14`)
- **Osvaldo Galán** (`OsvaldoGalan7` / `Osvaldo Galán`)

> Trabajo repartido entre los tres integrantes. 👏

---

## Resumen General

¡Muy buen trabajo! 🎉 La entrega cumple el MVP con un **modelado documental coherente y bien pensado**: los comentarios y las imágenes van **embebidos** en el `Post`, mientras que el autor y los tags son **referencias** (`ObjectId` + `ref` + `populate`). Esa combinación es exactamente el tipo de decisión que el enunciado deja a su criterio, y la resolvieron con criterio. Además, la **regla de los comentarios antiguos está aplicada y es configurable**, y sumaron el bonus de **seguidores** y una estrategia de **caché con Redis**.

El punto principal a pulir es de diseño: aprovechar los middlewares que ya tienen para que los controladores no repitan comprobaciones (justo lo que pide el enunciado sobre la única responsabilidad).

### Estado por criterio

| Criterio        | Estado | Comentario breve |
|-----------------|:------:|------------------|
| Arquitectura    |   ✅   | Capas claras + middlewares genéricos (`validateObjectId`, `validaExiste`). |
| Modelado        |   ✅   | Documental coherente (embebido + referenciado); `nickName` único. |
| Validaciones    |   ✅   | Joi por endpoint + validación de `ObjectId`. |
| Middlewares     |   ✅   | Genéricos parametrizables, bien compuestos en las rutas. |
| API REST        |   ✅   | CRUD + relaciones (comentarios, imágenes, tags) completos. |
| Configuración   |   ✅   | `MONGODB_URI`, `PORT` y `COMMENT_AGE_MONTHS` por `.env`. |
| Documentación   |   ✅   | Swagger, `Ejemplos/`, `docker-compose`. |

---

## Fortalezas

### 1. Modelado documental coherente 🗃️
**Ubicación:** `src/models/Post.js`, `src/models/User.js`

Resolvieron muy bien la decisión embebido/referenciado: `comments` e `images` son subdocumentos del `Post` (con `_id` propio, lo que permite `post.comments.id(...)`, `push`, `pull`), y `user` y `tags` son referencias navegables con `populate`. `nickName` está definido como **único** (`unique: true, trim: true`). Es un diseño que aprovecha lo mejor de cada estrategia. 👌

### 2. Regla de comentarios antiguos aplicada y configurable ⏳
**Ubicación:** `src/controllers/postController.js` (`getAllPosts`, `getPostById`)

Al traer los posts filtran los comentarios por visibilidad y antigüedad, con el umbral tomado del entorno:

```js
const cutoffDate = new Date();
cutoffDate.setMonth(cutoffDate.getMonth() - monthsToSubtract); // COMMENT_AGE_MONTHS (default 6)
postObj.comments = postObj.comments.filter(c => c.visible === true && new Date(c.createdAt) >= cutoffDate);
```

Cumple las dos condiciones: **se aplica** en la visualización del post y el umbral **es configurable** por variable de entorno. 🎯

### 3. Validación de `ObjectId` y existencia en middlewares ♻️
**Ubicación:** `src/middlewares/existe.middleware.js`

`validateObjectId(param)` valida el formato del id (el equivalente Mongo del chequeo de id), y `validaExisteMiddleware(Modelo, param)` verifica la existencia para **cualquier** modelo y deja el documento en `req.registro`. Son genéricos y se componen bien en `postRoutes.js`. Es el patrón que la materia valora.

### 4. Bonus de seguidores completo 🔗
**Ubicación:** `src/controllers/followController.js`, `src/models/Follow.js`

Seguir/dejar de seguir, listar seguidores y seguidos, con guardas contra seguirse a sí mismo y contra duplicados (índice único compuesto en `Follow`). Muy bien resuelto para un bonus.

### 5. Caché con Redis y validación con Joi 🚀🛡️
**Ubicación:** `src/controllers/postController.js`, `src/config/redis.js`, `src/schema/`

Implementaron caché de posts con invalidación al crear/comentar/editar/eliminar, y validan los cuerpos con **Joi** (lo recomendado, porque corta el dato inválido antes de tocar Mongo). Buen uso de ambos.

---

## Observaciones

### 1. Los controladores repiten comprobaciones que ya hacen los middlewares

**Estado:** ⚠️  **Severidad:** 🟠 Importante
**Ubicación:** `src/routes/postRoutes.js`, `src/controllers/postController.js`

**Descripción:**
El enunciado pide controladoras de **única responsabilidad**, evitando comprobaciones innecesarias. En las rutas GET/PUT/DELETE ya aplican `validaExisteMiddleware(Post, 'postId')`, que valida la existencia y deja el post en `req.registro`. Sin embargo, los controladores (`getPostById`, `deletePost`, `getCommentsByPostId`, etc.) **vuelven a hacer** `Post.findById(postId)` y a chequear el 404. Además, las rutas POST de sub-recursos (`/:postId/comments`, `/:postId/images`, `/:postId/tag`) **no** pasan por `validateObjectId`/`validaExiste`, así que ahí la comprobación vive solo en el controller.

**Impacto:**
Se ejecuta la misma consulta dos veces y la lógica de existencia queda duplicada e inconsistente entre rutas. Es justo el punto que el enunciado quiere evitar.

**Recomendación:**
Usar `req.registro` en el controlador en lugar de volver a buscar, y aplicar `validateObjectId` + `validaExiste` también en las rutas POST de sub-recursos. Así el controller queda enfocado en su única responsabilidad.

---

### 2. La lista de comentarios de un post no aplica el filtro de visibilidad

**Estado:** ⚠️  **Severidad:** 🟡 Mejora recomendada
**Ubicación:** `src/controllers/postController.js` (`getCommentsByPostId`)

**Descripción:**
`getAllPosts` y `getPostById` filtran correctamente los comentarios antiguos/ocultos, pero `getCommentsByPostId` (`GET /posts/:postId/comments`) devuelve **todos** los comentarios embebidos sin filtrar.

**Impacto:**
Es una inconsistencia: por la vista del post un comentario viejo no se ve, pero por su endpoint de comentarios sí. Conviene unificar el criterio.

**Recomendación:**
Reutilizar el mismo filtro (umbral por `COMMENT_AGE_MONTHS` + `visible`) en `getCommentsByPostId`, idealmente en una función/helper compartida.

---

### 3. La caché de Redis quedó desactivada

**Estado:** ⚠️  **Severidad:** 🟡 Mejora recomendada
**Ubicación:** `src/server.js`

**Descripción:**
La lógica de caché está bien escrita, pero en `server.js` la línea `connectRedis()` está **comentada**, por lo que el cliente nunca se conecta y todos los `if (redis && redis.isOpen)` resultan falsos: la caché nunca se activa (la app sigue funcionando, yendo siempre a la base).

**Impacto:**
El bonus de caché, que está implementado, hoy no tiene efecto.

**Recomendación:**
Descomentar/activar la conexión a Redis (manejando el caso de que no esté disponible) o, si no se va a usar, quitar el cableado para evitar confusión. (Detalle menor relacionado: `multer` figura como dependencia pero no se usa, ya que las imágenes se cargan por URL.)

---

## Conclusión

Es una entrega muy sólida y prolija: un modelado documental bien decidido, la regla de negocio resuelta y configurable, middlewares genéricos para `ObjectId`/existencia, y dos bonus (seguidores y caché). Se nota criterio en el diseño. 🌟

El foco principal es aprovechar los middlewares para aligerar los controladores (única responsabilidad) y unificar el filtro de comentarios. Son ajustes acotados sobre una base muy buena. ¡Felicitaciones y sigan así! 🚀
