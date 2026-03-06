# TODO - Expense Pulse (Backend + Frontend)

**Data:** 2026-03-06
**Basato su:** Code Review completa BE + FE 

--- -

## Legenda priorita

- **P0** - Bug critici / comportamento errato
- **P1** - Bug importanti / sicurezza / architettura
- **P2** - Qualita del codice / performance
- **P3** - Polish / nice-to-have

---

# BACKEND

## P0 - Bug Critici

### [ ] BE-BUG-1: ObjectId non validato causa 500

**File:** `CategoryServiceImpl.java:53,108,140` | `TransactionsServiceImpl.java:109,130` | `LayoutServiceImpl.java:48,78,98`

```java
new ObjectId(id) // Se id non e un hex di 24 caratteri -> IllegalArgumentException -> 500
```

**Fix:** Validare con `ObjectId.isValid(id)` prima della conversione, oppure catch `IllegalArgumentException` e lanciare un errore 400.

---

## P1 - Sicurezza

### [ ] BE-SEC-1: Connection string MongoDB hardcoded

**File:** `application.yml:31`

```yaml
connection-string: mongodb://localhost:27017
```

**Fix:** Usare variabile d'ambiente: `${MONGO_CONNECTION_STRING:mongodb://localhost:27017}`.

---

### [ ] BE-SEC-2: Swagger UI abilitato in produzione

**File:** `application.yml:33-35`

**Fix:** Aggiungere `%prod.quarkus.swagger-ui.always-include=false`.

---

### [ ] BE-SEC-3: Nessuna autenticazione o autorizzazione

Tutti gli endpoint sono pubblicamente accessibili.

**Fix:** Valutare `quarkus-oidc` o `quarkus-security-jwt` in base ai requisiti.

---

### [ ] BE-SEC-4: Nessun rate limiting o limite dimensione richieste

**Fix:** Configurare `quarkus.http.limits.max-body-size` e valutare rate limiting.

---

## P1 - Configurazione

### [ ] BE-CFG-1: CORS duplicato in due file

**File:** `application.properties:1-6` e `application.yml:13-20`

**Fix:** Rimuovere la configurazione CORS da `application.properties`, tenerla solo in `application.yml`.

---

### [ ] BE-CFG-2: Database name duplicato

**File:** `application.yml:3-5`

```yaml
connection-string: mongodb://mongo:27017/expense-pulse
database: expense-pulse  # duplicato
```

**Fix:** Rimuovere il database dalla connection string, tenerlo solo nella property `database`.

---

### [ ] BE-CFG-3: Nessun profilo test per MongoDB

**Fix:** Aggiungere `%test.quarkus.mongodb.devservices.enabled=true` in `application.yml`.

---

### [ ] BE-CFG-4: `@CommonsLog` senza dipendenza esplicita

**File:** Tutti i service e API usano `@CommonsLog` di Lombok.

**Fix:** Sostituire con `@Slf4j` (piu appropriato con Quarkus) oppure aggiungere dipendenza esplicita `commons-logging`.

---

## P1 - API Design

### [ ] BE-API-1: POST usato per operazioni di lettura

- `POST /layouts/default` -> dovrebbe essere `GET`
- `POST /layouts/reset` -> dovrebbe essere `PUT`

---

### [ ] BE-API-2: Endpoint duplicati

**File:** `LayoutApi.java:30-52`

`GET /layouts/` e `GET /layouts/all` ritornano gli stessi dati.

**Fix:** Rimuovere uno dei due.

---

### [ ] BE-API-3: Status code OpenAPI inconsistenti

**File:** `CategoryApi.java:68-70`

Documentazione dice `responseCode = "200"` ma il codice ritorna 201 (Created).

**Fix:** Allineare `@APIResponse` ai codici effettivi.

---

### [ ] BE-API-4: Endpoint delete senza `@APIResponses`

**File:** `TransactionsApi.java:105-120`

**Fix:** Aggiungere annotazione `@APIResponses`.

---

## P2 - Qualita del Codice

### [ ] BE-CQ-1: Naming inconsistente - mix italiano/inglese

- Italiano: `elenco()`, `crea()`, `cancella()`, `aggiornaCategory()`
- Inglese: `createTransaction()`, `deleteLayout()`, `getAllLayouts()`

**Fix:** Scegliere una lingua (consigliato inglese) e rinominare.

---

### [ ] BE-CQ-2: Codice commentato residuo

| File | Contenuto |
|------|-----------|
| `LayoutApi.java:92-95` | Logica `if ("default".equals(id))` |
| `LayoutService.java:12` | Dichiarazione `findDefaultLayout()` |

**Fix:** Rimuovere il codice commentato.

---

### [ ] BE-CQ-3: Catch silenzioso in MongoIndexConfig

**File:** `MongoIndexConfig.java:37`

```java
catch (Exception ignored) { }
```

**Fix:** Aggiungere `log.debug("Indice non presente, verra creato", ignored);`.

---

### [ ] BE-CQ-4: AbstractMapperComponent aggiunge null alla lista

**File:** `AbstractMapperComponent.java:18-19`

Se `convertEntityToDto()` ritorna null, il null viene aggiunto alla lista risultante.

**Fix:** Filtrare i null: `if (dto != null) dtoList.add(dto);`.

---

### [ ] BE-CQ-5: Layout.isDefault e Boolean wrapper

**File:** `Layout.java:21`

`Boolean isDefault` puo essere null -> possibile NPE.

**Fix:** Usare `boolean` primitivo con default `false`.

---

## P2 - Testing

### [ ] BE-TEST-1: Solo test boilerplate

**File:** `GreetingResourceTest.java` testa endpoint `/hello` inesistente.

**Fix:** Scrivere test reali per `CategoryApi`, `TransactionsApi`, `LayoutApi` con `@QuarkusTest`.

---

### [ ] BE-TEST-2: Dipendenze test mancanti

`pom.xml` non include Testcontainers per MongoDB.

**Fix:** Aggiungere `testcontainers-mongodb` e scrivere integration test.

---

---

# FRONTEND

## P0 - Bug Critici

### [ ] FE-BUG-1: `saveTransaction()` crea una categoria invece di aggiornare una transazione

**File:** `TransactionHistory.vue:78-127`

La funzione chiama `categoryStore.addCategory()` (riga 100) e mostra "Categoria creata con successo" (riga 121). Copy-paste dalla logica di creazione categoria.

**Fix:** Sostituire con chiamata a `store.updateTransaction()` con i dati di `editTransaction`.

---

### [ ] FE-BUG-2: Store layout condiviso causa collisione tra view

**File:** `layoutStore.ts`

`HomeView` e `CategoriesView` condividono lo stesso singleton `layoutStore`. Navigando tra le view, il layout di una sovrascrive quello dell'altra.

**Fix:** Parametrizzare lo store per view (es. `Map<string, LayoutVO>`) oppure usare store separati.

---

## P1 - Bug Importanti

### [ ] FE-BUG-3: Import eager vanifica lazy loading

**File:** `router/index.ts:2-3`

```typescript
import HomeView from '../views/HomeView.vue'      // eager
import CategoriesView from '../views/CategoriesView.vue'  // eager (inutilizzato)
// ...
component: () => import('../views/CategoriesView.vue')    // lazy vanificato
```

**Fix:** Rimuovere l'import statico di `CategoriesView` a riga 3.

---

### [ ] FE-BUG-4: `window.scrollTo` fuori da onMounted

**File:** `HomeView.vue:73`

Eseguito a livello di modulo, duplicato (gia presente in `onMounted` a riga 69).

**Fix:** Rimuovere la riga 73.

---

### [ ] FE-BUG-5: `fetchCategories()` senza await

**File:** `CategoriesView.vue:52`

```typescript
categoryStore.fetchCategories()  // manca await
```

**Fix:** Aggiungere `await`.

---

### [ ] FE-BUG-6: Pulsante `+` categoria non invoca `openCategoryModal()`

**File:** `TransactionForm.vue:241`

```html
<button @click="isCategoryModalOpen = true">  <!-- Non genera codice/colore -->
```

**Fix:** Cambiare in `@click="openCategoryModal()"`.

---

### [ ] FE-BUG-7: `editTransaction` ref non inizializzata

**File:** `TransactionHistory.vue:21`

Il modal commentato (righe 201-213) usa `editTransaction!.title` con non-null assertion.

**Fix:** Inizializzare con valore di default oppure rimuovere il modal commentato.

---

## P1 - Sicurezza

### [ ] FE-SEC-1: URL API hardcoded

**File:** `api.ts:4`

```typescript
baseURL: 'http://localhost:9091/api/v1'
```

**Fix:** Usare `import.meta.env.VITE_API_BASE_URL` con `.env` file.

---

### [ ] FE-SEC-2: Nessuna validazione lunghezza input

Nessun `maxlength` su nessun input nei form.

**Fix:** Aggiungere `maxlength` sugli input e validare lato client.

---

## P1 - Architettura

### [ ] FE-ARCH-1: Service layer completamente inutilizzato

**File:** `categoryService.ts`, `layoutService.ts`

Gli store chiamano direttamente `api.get/post/put/delete`. I service sono codice morto.

**Fix:** O usare i service dagli store, oppure eliminarli.

---

### [ ] FE-ARCH-2: Duplicazione massiva tra HomeView e CategoriesView

Codice quasi identico: `toggleEditMode`, `resetLayout`, `handleLayoutChange`, template GridContainer, button bar, CSS.

**Fix:** Estrarre in un composable `useLayoutEditor()`.

---

### [ ] FE-ARCH-3: `GridContainer.vue` senza TypeScript

**File:** `GridContainer.vue:1` - `<script setup>` senza `lang="ts"`.

**Fix:** Aggiungere `lang="ts"`, tipizzare props con generics e il parametro di `onLayoutUpdated`.

---

### [ ] FE-ARCH-4: Mutazione diretta dello store

**File:** `HomeView.vue:101-106`, `CategoriesView.vue:58-63`

```typescript
layoutStore.currentLayout = { ... }
```

**Fix:** Creare un'action nello store (es. `cloneAsPersonal(componentName)`).

---

### [ ] FE-ARCH-5: Nessun error boundary globale

**Fix:** Aggiungere `app.config.errorHandler` in `main.ts`.

---

## P2 - Performance

### [ ] FE-PERF-1: Fetch sequenziali in onMounted

**File:** `HomeView.vue:64-65`

```typescript
await store.fetchTransactions();
await categoryStore.fetchCategories();
```

**Fix:**
```typescript
await Promise.all([store.fetchTransactions(), categoryStore.fetchCategories()]);
```

---

### [ ] FE-PERF-2: Nessun debounce sulla ricerca

**File:** `ResearchTable.vue:82`

`@input="applyFilters"` genera una chiamata API per ogni carattere.

**Fix:** Aggiungere debounce 300ms (es. `useDebounceFn` da VueUse o `setTimeout` manuale).

---

### [ ] FE-PERF-3: Re-fetch intera lista dopo ogni operazione

**File:** `expenseStore.ts:107,117,134`

Dopo `addTransaction`, `deleteTransaction`, `updateTransaction` viene ri-fetchata l'intera lista.

**Fix:** Valutare update ottimistici locali per migliorare UX.

---

### [ ] FE-PERF-4: `vueDevTools()` incluso senza guardia ambiente

**File:** `vite.config.ts:11`

**Fix:**
```typescript
plugins: [
  vue(),
  ...(process.env.NODE_ENV !== 'production' ? [vueDevTools()] : []),
]
```

---

### [ ] FE-PERF-5: Dockerfile esegue dev server

**File:** `Dockerfile`

```dockerfile
CMD ["npm", "run", "dev", "--", "--host"]
```

**Fix:** Multi-stage build: `npm run build` + servire con nginx.

---

## P2 - Qualita del Codice

### [ ] FE-CQ-1: ~200+ righe di codice commentato

| File | Righe |
|------|-------|
| `TransactionHistory.vue` | 188-229 (modal intero) |
| `layoutStore.ts` | 34-47, 109-116, 270-275, 289-291 |
| `layoutService.ts` | 5-23, 70-73 |

**Fix:** Rimuovere tutto il codice commentato.

---

### [ ] FE-CQ-2: `formatCurrency` duplicata in 4 componenti

**File:** `BalanceCards.vue:8`, `TransactionHistory.vue:36`, `CategoryStats.vue:26`, `CategoryTable.vue:21`

**Fix:** Estrarre in `src/utils/formatters.ts`.

---

### [ ] FE-CQ-3: `generateRandomColor` duplicata in 3 componenti

**File:** `TransactionForm.vue:37`, `TransactionHistory.vue:26`, `CategoryForm.vue:32`

**Fix:** Estrarre in `src/utils/colors.ts`.

---

### [ ] FE-CQ-4: Import inutilizzati

| File | Import |
|------|--------|
| `EditControl.vue:10` | `type LayoutItem` da `chart.js` (fonte sbagliata) |
| `router/index.ts:3` | `CategoriesView` (import eager inutilizzato) |

---

### [ ] FE-CQ-5: Emit dichiarati ma mai usati

| File | Emit |
|------|------|
| `TransactionHistory.vue:45` | `emit('edit')`, `emit('delete')` |
| `TransactionForm.vue:34` | `emit('success')`, `emit('cancel')`, `emit('edit')` |

---

### [ ] FE-CQ-6: Typo "vategory"

**File:** `CategoryTable.vue:17`

```typescript
(e: "edit", vategory: CategoryVO): void  // -> category
```

---

### [ ] FE-CQ-7: Log prefisso errato

**File:** `CategoriesView.vue:68` - logga come `[HomeView.toggleEditMode]`.

---

### [ ] FE-CQ-8: Console.log con emoji ovunque

File: `categoryStore.ts`, `expenseStore.ts`, `layoutStore.ts`

**Fix:** Rimuovere o sostituire con sistema di logging condizionale.

---

### [ ] FE-CQ-9: `EditControl.vue` completamente inutilizzato

Non importato da nessun file. Contiene anche BUG-03.

**Fix:** Eliminare il file.

---

### [ ] FE-CQ-10: `FiltroTransactionDTO.ts` inutilizzato

Non importato da nessun file. Contiene `transactions?: any[]`.

**Fix:** Eliminare il file.

---

## P2 - TypeScript

### [ ] FE-TS-1: Tipo `any` in LayoutItemMapper

**File:** `LayoutItemMapper.ts:11,29`

```typescript
static toVO(dto: any): LayoutItemVO      // -> LayoutItemDTO
static toDTO(vo: LayoutItemVO): any      // -> LayoutItemDTO
```

---

### [ ] FE-TS-2: GridContainer castato a `any`

**File:** `HomeView.vue:34`, `CategoriesView.vue:20`

```typescript
const GridContainer = _GridContainer as any;
```

**Fix:** Aggiungere `lang="ts"` a GridContainer e rimuovere il cast.

---

### [ ] FE-TS-3: `env.d.ts` usa `any`

**File:** `env.d.ts:5`

```typescript
const component: DefineComponent<{}, {}, any>
```

---

### [ ] FE-TS-4: Catch blocks usano `: any`

**File:** `TransactionForm.vue:178`, `CategoryForm.vue:71`, `TransactionHistory.vue:122`, `CategoryTable.vue:34`

**Fix:** Usare `unknown` con type guard.

---

### [ ] FE-TS-5: Slot typing con `any`

**File:** `HomeView.vue:156`, `CategoriesView.vue:128`

```html
<template #default="{ item }: any">
```

---

## P2 - Integrazione API

### [ ] FE-API-1: Nessun interceptor centralizzato

**File:** `api.ts`

Nessun response interceptor per errori 401, 403, 500.

**Fix:** Aggiungere interceptor con gestione centralizzata errori.

---

### [ ] FE-API-2: Nessun timeout configurato

**Fix:** Aggiungere `timeout: 15000` alla configurazione axios.

---

### [ ] FE-API-3: Gestione errori inconsistente negli store

| Store | Metodo | Errore |
|-------|--------|--------|
| `expenseStore` | `fetchTransactions` | Inghiottito |
| `expenseStore` | `addTransaction` | Rilanciato |
| `categoryStore` | `fetchCategories` | Inghiottito |
| `categoryStore` | `deleteCategory` | Inghiottito |
| `categoryStore` | `addCategory` | Rilanciato |

**Fix:** Scegliere un pattern unico (consigliato: rilanciare sempre).

---

## P3 - UI/UX

### [ ] FE-UX-1: Nessun loading indicator

`loading` esiste negli store ma nessun componente lo usa.

---

### [ ] FE-UX-2: Nessun empty state per le categorie

`CategoryTable.vue` non mostra messaggio quando la lista e vuota.

---

### [ ] FE-UX-3: Nessun attributo ARIA

- Nessun `aria-label` sui pulsanti con sole icone
- `<html lang="">` vuoto in `index.html:2`

---

### [ ] FE-UX-4: Titolo pagina "Vite App"

**File:** `index.html:8`

**Fix:** Cambiare in "ExpensePulse".

---

### [ ] FE-UX-5: `window.confirm()` e `window.alert()` per azioni critiche

Usati ovunque. Bloccano il thread principale.

**Fix:** Sostituire con dialog/toast custom.

---

### [ ] FE-UX-6: Campo data mancante nel form transazioni

**File:** `TransactionForm.vue` - il model ha `date` ma non c'e un `<input type="date">` nel template.

---

### [ ] FE-UX-7: Paginazione dentro l'area scrollabile

**File:** `TransactionHistory.vue:185` - `AppPagination` dentro `overflow-y-auto`.

**Fix:** Spostare fuori dal container scrollabile.

---

---

# Riepilogo conteggio

| Area | P0 | P1 | P2 | P3 | Totale |
|------|----|----|----|----|--------|
| **Backend** | 1 | 8 | 9 | 0 | **18** |
| **Frontend** | 2 | 10 | 20 | 7 | **39** |
| **Totale** | **3** | **18** | **29** | **7** | **57** |
