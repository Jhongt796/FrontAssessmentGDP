# Explorador de Ventas

Construir **una sola página** que explore las ventas del dataset.

> Contexto: necesitas una vista para explorar las ventas del dataset.

## Features funcionales

1. **Listado navegable** de las ventas, mostrando cliente, producto, monto, status, fecha y vendedor.
2. **Búsqueda** por cliente o producto, con **debounce** de ~300ms.
3. **Filtros** por `status` y **rango de fechas**.
4. **Ordenamiento** por un criterio relevante — el control lo elige el candidato.
5. **Acción sobre un subconjunto** de ventas, estado **local** — no persiste.
6. **Ver el detalle** de una venta — el patrón lo elige el candidato.
7. **Estado en la URL**: búsqueda, filtros, orden, página → recargar mantiene la vista y el link es compartible.
8. **Estados de UI**: loading, vacío, error.

## Features de calidad

- **Responsive**: usable de móvil a desktop. El candidato resuelve la visualización e interacción en cada tamaño.
- **TypeScript sin `any`.** El estado async modelado con union discriminada.
- **Componetización**: la vista descompuesta en componentes de responsabilidad clara, con interfaces explícitas y piezas reutilizables.
- **Estado derivado**, no duplicado: lo filtrado/ordenado/paginado se computa, no se guarda.
- **Accesibilidad**: cualquiera sea el patrón elegido, operable por teclado; si el detalle abre en overlay, focus trap + cierre con `Esc`.
- **Sin recargar todo el listado** al cambiar un filtro.

## Datos

Los datos viven en **MongoDB** y la conexión se toma de `MONGODB_URI` en el `.env`. Hay tres colecciones: `sells`, `customers` y `products`. Cada venta referencia a su cliente y producto por `_id`.

`sells`:

```json
{
  "_id": "ObjectId",
  "code": "V-00001",
  "customerId": "ObjectId",
  "productId": "ObjectId",
  "amount": 249,
  "currency": "PEN",
  "exchangeRate": 3.71,
  "status": "PAID",
  "date": "ISODate",
  "seller": "Ana Torres"
}
```

`customers`:

```json
{
  "_id": "ObjectId",
  "name": "María Fernanda Quispe Rojas",
  "region": "Lima",
  "segment": "B",
  "createdAt": "ISODate"
}
```

`products`:

```json
{
  "_id": "ObjectId",
  "name": "Creaclass Anual",
  "category": "Subscription",
  "price": 249,
  "currency": "PEN"
}
```

La UI muestra etiquetas en español; su mapeo a campos es: cliente → `customers.name`, producto → `products.name`, monto → `amount`, status → `status`, fecha → `date`, vendedor → `seller`.

Los seeds en **EJSON** (`sells.ejson`, `customers.ejson`, `products.ejson`) se descargan aquí (URL válida por 3 horas):

[FrontAssessmentGDP-seeds.rar](https://gdpcloud-thexerox-corebucketbucket-tvcuovts.s3.us-east-1.amazonaws.com/temp/FrontAssessmentGDP-seeds.rar?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIATJFC7CMYVMS65THA%2F20261013%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20261013T210805Z&X-Amz-Expires=10800&X-Amz-SignedHeaders=host&X-Amz-Signature=7093d5b90996e7abfd4f966e90419ea2d68aa4b3ea931fb4237ada96e89a39b7)

## Endpoint de prueba

```
GET /api/sells?limit=50
```

Devuelve N documentos crudos de `sells` (sin join). Su único fin es **demostrar la conexión con MongoDB**: no es la base de la solución. El objetivo es la página única de búsqueda.

## Puesta en marcha

```bash
npm install
npm run seed:import
npm run dev
```

`seed:import` carga los seeds y lee `MONGODB_URI` del `.env`.
