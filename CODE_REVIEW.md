# Code Review - Expense Pulse (Backend + Frontend)

**Data:** 2026-03-03
**Branch:** `ottimizzazioni`
**Backend:** Quarkus 3.30.4 + MongoDB Panache
**Frontend:** Vue 3.5 + TypeScript + Vite 7 + Pinia + TailwindCSS

---

## ✅ TODO - Fix Checklist

### Stati - Marcare i ToDo con uno dei seguenti stati
✅ -> Attività conclusa  
🚧 -> attività in corso   

### 🔴 Backend - Bug Critici
- [✅] [BUG-1: `convertDtoToEntity()` ritorna sempre null](#bug-1-convertdtotoentity-ritorna-sempre-null)
- [✅] [BUG-4: `aggiornaCategory()` cerca per codice invece che per id](#bug-4-aggiornacategory-cerca-per-codice-invece-che-per-id)
- [✅] [BUG-5: `aggiornaCategory()` inghiotte MongoWriteException non-11000](#bug-5-aggiornacategory-inghiotte-mongowriteexception-non-11000)
- [✅] [BUG-10: Regex injection nelle query di ricerca](#bug-10-regex-injection-nelle-query-di-ricerca)

### 🟠 Backend - Bug Importanti
- [✅] [BUG-2: `findCategoryByCodice()` ritorna null silenziosamente](#bug-2-findcategorybycodice-ritorna-null-silenziosamente)
- [✅] [BUG-3: Exception handling cattura la propria ServiceException](#bug-3-exception-handling-cattura-la-propria-serviceexception)
- [✅] [BUG-6: `findByFiltro()` ritorna null - API risponde 200 con body vuoto](#bug-6-findbyfiltro-ritorna-null---api-risponde-200-con-body-vuoto)
- [✅] [BUG-7: NullPointerException in `convertEntityToDto()` quando `getId()` e null](#bug-7-nullpointerexception-in-convertentitytodto-quando-getid-e-null)
- [✅] [BUG-8: Entity layer referenzia DTO dell'API layer](#bug-8-entity-layer-referenzia-dto-dellapi-layer)
- [✅] [BUG-9: Date confrontate come stringhe](#bug-9-date-confrontate-come-stringhe)

### 🟡 Backend - Qualità del Codice
- [✅] [CQ-1: Campi public su classi con Lombok @Data](#cq-1-campi-public-su-classi-con-lombok-data)
- [✅] [CQ-2: Import inutilizzati](#cq-2-import-inutilizzati)
- [✅] [CQ-3: Variabile inutilizzata](#cq-3-variabile-inutilizzata)
- [✅] [CQ-4: Injection inutilizzata](#cq-4-injection-inutilizzata)
- [ ] [CQ-5: Naming inconsistente - mix italiano/inglese](#cq-5-naming-inconsistente---mix-italianoinglese)
- [✅] [CQ-6: Log con prefissi errati](#cq-6-log-con-prefissi-errati)
- [🚧] [CQ-7: Codice commentato in produzione](#cq-7-codice-commentato-in-produzione)
- [✅] [CQ-8: Annotazione `@Consumes` duplicata](#cq-8-annotazione-consumes-duplicata)
- [✅] [CQ-9: Repository accetta DTO direttamente](#cq-9-repository-accetta-dto-direttamente)

### 🏗️ Backend - Architettura
- [✅] [ARCH-1: Nessun ExceptionMapper](#arch-1-nessun-exceptionmapper)
- [✅] [ARCH-2: Nessuna validazione input](#arch-2-nessuna-validazione-input)
- [✅] [ARCH-3: Stack trace persi nel exception handling](#arch-3-stack-trace-persi-nel-exception-handling)
- [✅] [ARCH-4: `@Model` su TransactionsServiceImpl](#arch-4-model-su-transactionsserviceimpl)
- [✅] [ARCH-5: FiltroMapperImpl non e un bean CDI](#arch-5-filtromapperimpl-non-e-un-bean-cdi)
- [✅] [ARCH-6: Date salvate come stringhe](#arch-6-date-salvate-come-stringhe)
- [✅] [ARCH-7: Category embedded in Transaction](#arch-7-category-embedded-in-transaction)
- [✅] [ARCH-8: Business logic nel repository](#arch-8-business-logic-nel-repository)

### 🔒 Backend - Sicurezza
- [ ] [SEC-1: Regex injection (vedi BUG-10)](#sec-1-regex-injection-vedi-bug-10)
- [ ] [SEC-2: Nessuna autenticazione o autorizzazione](#sec-2-nessuna-autenticazione-o-autorizzazione)
- [ ] [SEC-3: Connection string MongoDB hardcoded](#sec-3-connection-string-mongodb-hardcoded)
- [ ] [SEC-4: Swagger UI abilitato in produzione](#sec-4-swagger-ui-abilitato-in-produzione)
- [ ] [SEC-5: Nessun rate limiting o limite dimensione richieste](#sec-5-nessun-rate-limiting-o-limite-dimensione-richieste)

### ⚡ Backend - Performance
- [✅] [PERF-1: Nessun indice MongoDB definito](#perf-1-nessun-indice-mongodb-definito)
- [✅] [PERF-2: Due round-trip al DB per ogni ricerca](#perf-2-due-round-trip-al-db-per-ogni-ricerca)
- [✅] [PERF-3: Regex con leading wildcard non possono usare indici](#perf-3-regex-con-leading-wildcard-non-possono-usare-indici)
- [✅] [PERF-4: Entity caricata interamente per le operazioni di delete](#perf-4-entity-caricata-interamente-per-le-operazioni-di-delete)
- [✅] [PERF-5: TransactionsServiceImpl @RequestScoped](#perf-5-transactionsserviceimpl-requestscoped)

### 🧪 Backend - Testing
- [ ] [TEST-1: Solo test boilerplate - testa endpoint inesistente](#test-1-solo-test-boilerplate---testa-endpoint-inesistente)
- [ ] [TEST-2: Dipendenze test mancanti](#test-2-dipendenze-test-mancanti)

### ⚙️ Backend - Configurazione
- [ ] [CONFIG-1: CORS configurato in due file diversi](#config-1-cors-configurato-in-due-file-diversi)
- [ ] [CONFIG-2: Database name duplicato](#config-2-database-name-duplicato)
- [ ] [CONFIG-3: Nessun profilo test per MongoDB](#config-3-nessun-profilo-test-per-mongodb)
- [ ] [CONFIG-4: `@CommonsLog` senza dipendenza esplicita](#config-4-commonslog-senza-dipendenza-esplicita)

### 🌐 Backend - API Design
- [ ] [API-1: POST usato per operazioni di lettura](#api-1-post-usato-per-operazioni-di-lettura)
- [ ] [API-2: Endpoint duplicati](#api-2-endpoint-duplicati)
- [ ] [API-3: Status code inconsistenti nella documentazione](#api-3-status-code-inconsistenti-nella-documentazione)
- [ ] [API-4: Nessuna struttura errore standardizzata](#api-4-nessuna-struttura-errore-standardizzata)
- [ ] [API-5: Endpoint delete senza documentazione `@APIResponses`](#api-5-endpoint-delete-senza-documentazione-apiresponses)

### 🔴 Frontend - Bug Critici
- [✅] [BUG-01: `saveTransaction()` crea una categoria invece di aggiornare una transazione](#bug-01-savetransaction-crea-una-categoria-invece-di-aggiornare-una-transazione)
- [✅] [BUG-03: Spreading di una stringa corrompe lo stato del layout](#bug-03-spreading-di-una-stringa-corrompe-lo-stato-del-layout)

### 🟠 Frontend - Bug Importanti
- [ ] [BUG-02: Import eager vanifica il lazy loading](#bug-02-import-eager-vanifica-il-lazy-loading)
- [ ] [BUG-04: Store layout condiviso causa collisione tra view](#bug-04-store-layout-condiviso-causa-collisione-tra-view)
- [ ] [BUG-05: `window.scrollTo` fuori da onMounted](#bug-05-windowscrollto-fuori-da-onmounted)
- [ ] [BUG-06: `editTransaction` ref non inizializzata](#bug-06-edittransaction-ref-non-inizializzata)
- [ ] [BUG-07: `fetchCategories()` senza await](#bug-07-fetchcategories-senza-await)
- [ ] [BUG-08: `FiltroTransactionDTO.transactions` tipizzato come `any[]`](#bug-08-filtrotransactiondtotransactions-tipizzato-come-any)

### 🟡 Frontend - Qualità del Codice
- [ ] [CQ-01: Codice commentato (~200+ righe)](#cq-01-codice-commentato-200-righe)
- [ ] [CQ-02: `formatCurrency` duplicata in 4 componenti](#cq-02-formatcurrency-duplicata-in-4-componenti)
- [ ] [CQ-03: `generateRandomColor` duplicata in 3 componenti](#cq-03-generaterandomcolor-duplicata-in-3-componenti)
- [ ] [CQ-04: Import inutilizzati](#cq-04-import-inutilizzati)
- [ ] [CQ-05: Emit inutilizzati](#cq-05-emit-inutilizzati)
- [ ] [CQ-06: Typo "vategory" nel emit di CategoryTable](#cq-06-typo-vategory-nel-emit-di-categorytable)
- [ ] [CQ-07: Log prefisso errato](#cq-07-log-prefisso-errato)
- [ ] [CQ-08: Console.log con emoji in tutto il codice](#cq-08-consolelog-con-emoji-in-tutto-il-codice)
- [ ] [CQ-09: `EditControl.vue` completamente inutilizzato](#cq-09-editcontrolvue-completamente-inutilizzato)

### 🏗️ Frontend - Architettura
- [ ] [ARCH-01: `GridContainer.vue` senza TypeScript](#arch-01-gridcontainervue-senza-typescript)
- [ ] [ARCH-02: Mutazione diretta dello store](#arch-02-mutazione-diretta-dello-store)
- [ ] [ARCH-03: Service layer completamente inutilizzato](#arch-03-service-layer-completamente-inutilizzato)
- [ ] [ARCH-04: Duplicazione massiva tra HomeView e CategoriesView](#arch-04-duplicazione-massiva-tra-homeview-e-categoriesview)
- [ ] [ARCH-05: Nessun error boundary globale](#arch-05-nessun-error-boundary-globale)
- [ ] [ARCH-06: `FiltroTransactionDTO.ts` inutilizzato](#arch-06-filtrotransactiondtots-inutilizzato)

### 🔒 Frontend - Sicurezza
- [ ] [SEC-01: URL API hardcoded](#sec-01-url-api-hardcoded)
- [ ] [SEC-02: Protocollo HTTP invece di HTTPS](#sec-02-protocollo-http-invece-di-https)
- [ ] [SEC-03: Nessuna sanitizzazione input](#sec-03-nessuna-sanitizzazione-input)
- [ ] [SEC-04: Link a conversazione Gemini nel codice](#sec-04-link-a-conversazione-gemini-nel-codice)

### ⚡ Frontend - Performance
- [ ] [PERF-01: Import eager vanifica lazy loading (vedi BUG-02)](#perf-01-import-eager-vanifica-lazy-loading-vedi-bug-02)
- [ ] [PERF-02: Fetch sequenziali in onMounted](#perf-02-fetch-sequenziali-in-onmounted)
- [ ] [PERF-03: Nessun debounce sulla ricerca](#perf-03-nessun-debounce-sulla-ricerca)
- [ ] [PERF-04: Intera lista transazioni ri-fetchata dopo ogni operazione](#perf-04-intera-lista-transazioni-ri-fetchata-dopo-ogni-operazione)
- [ ] [PERF-05: `vueDevTools()` incluso senza guardia ambiente](#perf-05-vuedevtools-incluso-senza-guardia-ambiente)
- [ ] [PERF-06: Dockerfile esegue dev server](#perf-06-dockerfile-esegue-dev-server)

### 📘 Frontend - TypeScript
- [ ] [TS-01: Tipo `any` in LayoutItemMapper](#ts-01-tipo-any-in-layoutitemmapper)
- [ ] [TS-02: GridContainer castato a `any`](#ts-02-gridcontainer-castato-a-any)
- [ ] [TS-03: `GridContainer.vue` senza `lang="ts"` (vedi ARCH-01)](#ts-03-gridcontainervue-senza-langts-vedi-arch-01)
- [ ] [TS-04: `env.d.ts` usa `any`](#ts-04-envdts-usa-any)
- [ ] [TS-05: Catch blocks usano `: any`](#ts-05-catch-blocks-usano--any)
- [ ] [TS-06: Slot typing con `any`](#ts-06-slot-typing-con-any)

### 🔌 Frontend - Integrazione API
- [ ] [API-01: Nessun interceptor centralizzato](#api-01-nessun-interceptor-centralizzato)
- [ ] [API-02: Nessun timeout configurato](#api-02-nessun-timeout-configurato)
- [ ] [API-03: Gestione errori inconsistente negli store](#api-03-gestione-errori-inconsistente-negli-store)

### 🎨 Frontend - UI/UX
- [ ] [UX-01: Nessun loading indicator](#ux-01-nessun-loading-indicator)
- [ ] [UX-02: Nessun empty state per le categorie](#ux-02-nessun-empty-state-per-le-categorie)
- [ ] [UX-03: Nessun attributo di accessibilita (ARIA)](#ux-03-nessun-attributo-di-accessibilita-aria)
- [ ] [UX-04: Titolo pagina "Vite App"](#ux-04-titolo-pagina-vite-app)
- [ ] [UX-05: `window.confirm()` e `window.alert()` per azioni critiche](#ux-05-windowconfirm-e-windowalert-per-azioni-critiche)
- [ ] [UX-06: Campo data mancante nel form transazioni](#ux-06-campo-data-mancante-nel-form-transazioni)
- [ ] [UX-07: Paginazione dentro l'area scrollabile](#ux-07-paginazione-dentro-larea-scrollabile)

---

## Sommario

- [Backend - Bug Critici](#backend---bug-critici)
- [Backend - Bug Importanti](#backend---bug-importanti)
- [Backend - Qualita del Codice](#backend---qualità-del-codice)
- [Backend - Architettura](#backend---architettura)
- [Backend - Sicurezza](#backend---sicurezza)
- [Backend - Performance](#backend---performance)
- [Backend - Testing](#backend---testing)
- [Backend - Configurazione](#backend---configurazione)
- [Backend - API Design](#backend---api-design)
- [Frontend - Bug Critici](#frontend---bug-critici)
- [Frontend - Bug Importanti](#frontend---bug-importanti)
- [Frontend - Qualita del Codice](#frontend---qualità-del-codice)
- [Frontend - Architettura](#frontend---architettura)
- [Frontend - Sicurezza](#frontend---sicurezza)
- [Frontend - Performance](#frontend---performance)
- [Frontend - TypeScript](#frontend---typescript)
- [Frontend - Integrazione API](#frontend---integrazione-api)
- [Frontend - UI/UX](#frontend---uiux)
- [Raccomandazioni Prioritarie](#raccomandazioni-prioritarie)

---

# BACKEND (Quarkus)

## Backend - Bug Critici

### BUG-1: `convertDtoToEntity()` ritorna sempre null

**File:** `src/main/java/org/acme/transaction/mapper/TransactionResponseMapperImpl.java:29-37`

```java
@Override
public TransactionResponse convertDtoToEntity(TransactionResponseDTO dto) throws MapperException {
    if (dto != null) {
        TransactionResponse entity = TransactionResponse.builder()
                .transactions(transactionMapper.convertDtoToEntity(dto.getTransactions()))
                .paginazione(dto.getPaginazione())
                .build();
    }
    return null;  // BUG: l'entity costruita viene scartata, ritorna sempre null
}
```

**Fix:** aggiungere `return entity;` dentro il blocco `if`.

---

### BUG-4: `aggiornaCategory()` cerca per codice invece che per id

**File:** `src/main/java/org/acme/category/CategoryServiceImpl.java:99`

```java
public void aggiornaCategory(String id, CategoryDTO categoryDTO) throws ServiceException {
    try{
        Optional<Category> category = categoryRepository.findByCodice(id);  // BUG: usa findByCodice invece di findByIdOptional
```

L'API passa il path param `{id}` ma l'implementazione cerca per `codice`. Inconsistente con tutti gli altri CRUD.

**Fix:** usare `categoryRepository.findByIdOptional(new ObjectId(id))`.

---

### BUG-5: `aggiornaCategory()` inghiotte MongoWriteException non-11000

**File:** `src/main/java/org/acme/category/CategoryServiceImpl.java:109-116`

```java
}catch(MongoWriteException e){
    if(e.getCode() == 11000) {
        // ... throws ServiceException
    }
    // BUG: se il codice != 11000, il metodo ritorna normalmente senza errore
}catch(Exception ex) {
```

**Fix:** aggiungere un `else { throw new ServiceException(e.getMessage(), e); }`.

---

### BUG-10: Regex injection nelle query di ricerca

**File:** `src/main/java/org/acme/transaction/TransactionRepository.java:40-41, 67-68`

```java
params.and("title", "(?i).*" + title + ".*");
params.and("category", "(?i).*" + category + ".*");
```

Input utente interpolato direttamente in pattern regex senza escape. Un attaccante puo inviare pattern come `(a+)+$` per causare un ReDoS.

**Fix:** usare `Pattern.quote(title)` per effettuare l'escape dei caratteri speciali regex.

---

## Backend - Bug Importanti

### BUG-2: `findCategoryByCodice()` ritorna null silenziosamente

**File:** `src/main/java/org/acme/category/CategoryServiceImpl.java:28-40`

```java
public CategoryDTO findCategoryByCodice(String codice) throws ServiceException {
    try{
        Optional<Category> category = categoryRepository.findByCodice(codice);
        if(category.isPresent()){
            return categoryMapper.convertEntityToDto(category.get());
        }
    }catch(Exception e){
        throw new ServiceException(e.getMessage());
    }
    return null;  // Ritorna null quando la categoria non viene trovata
}
```

A differenza di `findById()` che lancia `ServiceException`, questo metodo ritorna `null` silenziosamente causando potenziali NPE a valle.

---

### BUG-3: Exception handling cattura la propria ServiceException

**File:** `src/main/java/org/acme/category/CategoryServiceImpl.java:42-55`

```java
public CategoryDTO findById(String id) throws ServiceException{
    try{
        Optional<Category> category = categoryRepository.findByIdOptional(new ObjectId(id));
        if(category.isPresent()){
            return categoryMapper.convertEntityToDto(category.get());
        }
        throw new ServiceException("Categoria con id:" + id + " non trovata");
    }catch(Exception e){
        throw new ServiceException(e.getMessage());  // Cattura la propria ServiceException e la re-wrappa
    }
}
```

Il `catch(Exception e)` cattura anche la `ServiceException` lanciata due righe sopra, perdendo lo stack trace. Lo stesso pattern si ripete in:
- `CategoryServiceImpl.cancella()` (righe 123-137)
- `TransactionsServiceImpl.aggiornaTransaction()` (righe 67-83)
- `TransactionsServiceImpl.cancella()` (righe 86-100)

**Fix:** usare `catch(ServiceException se) { throw se; } catch(Exception e) { throw new ServiceException(e.getMessage(), e); }`.

---

### BUG-6: `findByFiltro()` ritorna null - API risponde 200 con body vuoto

**File:** `src/main/java/org/acme/layout/LayoutServiceImpl.java:130-143`

```java
public LayoutDTO findByFiltro(FiltroDTO filtroDto) throws ServiceException {
    Layout layout = layoutRepository.findByFilters(filtroDto);
    if (layout != null) {
        return layoutMapper.convertEntityToDto(layout);
    }
    return null;  // API ritorna 200 con body null invece di 404
}
```

L'API `LayoutApi.getDefaultLayout()` fa `return Response.ok(layout).build()` - ritorna HTTP 200 con body nullo quando il layout non viene trovato.

---

### BUG-7: NullPointerException in `convertEntityToDto()` quando `getId()` e null

**File:** `src/main/java/org/acme/transaction/mapper/TransactionMapperImpl.java:26`

```java
.id(entity.getId().toHexString())  // NPE se getId() ritorna null
```

Nessun null-check su `entity.getId()`. Stesso problema in `CategoryMapperImpl.convertEntityToDto()` riga 21.

---

### BUG-8: Entity layer referenzia DTO dell'API layer

**File:** `src/main/java/org/acme/transaction/entity/TransactionResponse.java:8`

```java
import org.acme.api.dto.PaginazioneDTO;
// ...
PaginazioneDTO paginazione;
```

L'entity `TransactionResponse` referenzia direttamente `PaginazioneDTO` del layer API. Questo viola la separazione dei layer e accoppia la persistenza all'API.

---

### BUG-9: Date confrontate come stringhe

**File:** `src/main/java/org/acme/transaction/TransactionRepository.java:28-31`

```java
if (startDate.compareTo(endDate) > 0) {
    throw new ServiceException("La data di inizio non può essere successiva alla data di fine.");
}
```

Il confronto tra stringhe funziona correttamente solo se il formato e `yyyy-MM-dd`. Con formati come `dd/MM/yyyy` il confronto darà risultati errati.

---

## Backend - Qualità del Codice

### CQ-1: Campi public su classi con Lombok @Data

Con `@Data` tutti i campi dovrebbero essere `private`. Avere campi `public` e `private` mescolati vanifica i getter/setter generati.

**File coinvolti:**
- `category/dto/CategoryDTO.java:21-22` - `public Double budget; public String colore;`
- `category/entity/Category.java:20-21` - `public Double budget; public String colore;`
- `transaction/dto/TransactionDTO.java:20-23` - tutti i campi `public`
- `transaction/entity/Transaction.java:16-19` - tutti i campi `public`
- `layoutItem/entity/LayoutItem.java:13-22` - tutti i campi tranne `id` sono `public`

---

### CQ-2: Import inutilizzati

| File | Import inutilizzato |
|------|-------------------|
| `TransactionsServiceImpl.java:3` | `com.mongodb.MongoWriteException` |
| `LayoutService.java:3` | `org.acme.exception.MapperException` |
| `LayoutApi.java:13` | `org.acme.layout.entity.Filtro` |

---

### CQ-3: Variabile inutilizzata

**File:** `TransactionRepository.java:34`

```java
TransactionResponse transactionResponse = new TransactionResponse();  // Mai utilizzata
```

---

### CQ-4: Injection inutilizzata

**File:** `TransactionsServiceImpl.java:33-34`

```java
@Inject
CategoryRepository categoryRepository;  // Mai utilizzata
```

---

### CQ-5: Naming inconsistente - mix italiano/inglese

- Italiano: `elenco()`, `crea()`, `cancella()`, `aggiornaCategory()`
- Inglese: `createTransaction()`, `deleteLayout()`, `getAllLayouts()`

---

### CQ-6: Log con prefissi errati

- `CategoryServiceImpl.aggiornaCategory()` logga come `[CategoryApi.aggiornaCategory]` (riga 98, 101, 105, 112)
- Typo in `LayoutApi.java:150`: `"[LayoutApi.deleyeLayout]"` dovrebbe essere `"[LayoutApi.deleteLayout]"`

---

### CQ-7: Codice commentato in produzione

| File | Righe |
|------|-------|
| `LayoutServiceImpl.java:57-70` | Intero metodo `findDefaultLayout()` |
| `LayoutApi.java:92-95` | Logica `if ("default".equals(id))` |
| `LayoutService.java:12` | Dichiarazione `findDefaultLayout()` |

---

### CQ-8: Annotazione `@Consumes` duplicata

Gia dichiarata a livello di classe e ripetuta su singoli metodi:
- `TransactionsApi.java:64`
- `CategoryApi.java:70`

---

### CQ-9: Repository accetta DTO direttamente

**File:** `LayoutRepository.java:21`

```java
public Layout findByFilters(FiltroDTO filtroDto) {
```

Il repository dovrebbe accettare parametri primitivi o entity, non DTO dell'API.

---

## Backend - Architettura

### ARCH-1: Nessun ExceptionMapper

Non esiste un `ExceptionMapper<ApplicationException>` o `ExceptionMapper<NotFoundException>`. Le eccezioni risultano in risposte 500 generiche senza body strutturato. I 404 dichiarati nella documentazione OpenAPI non vengono mai effettivamente ritornati.

---

### ARCH-2: Nessuna validazione input

Zero Bean Validation (`@NotNull`, `@NotBlank`, `@Size`, `@Valid`) su qualsiasi DTO o parametro API. Manca la dipendenza `quarkus-hibernate-validator` nel `pom.xml`.

Esempi di rischi:
- `CategoryDTO.descrizione`, `codice` possono essere null/blank
- `TransactionDTO.title`, `amount`, `date` possono essere null
- `PaginazioneDTO.numeroPagina` e `numeroElementiPerPagina` possono essere null (NPE in `TransactionRepository.java:96`)

---

### ARCH-3: Stack trace persi nel exception handling

Pattern ricorrente in tutto il codebase:

```java
catch(Exception e) {
    throw new ServiceException(e.getMessage());  // Perde lo stack trace originale
}
```

Usare `new ServiceException(e.getMessage(), e)` per preservare la causa.

---

### ARCH-4: `@Model` su TransactionsServiceImpl

**File:** `TransactionsServiceImpl.java:20`

`@Model` combina `@Named` + `@RequestScoped`, creando una nuova istanza per ogni richiesta HTTP. Tutti gli altri service usano `@ApplicationScoped`. Inconsistente e meno performante.

---

### ARCH-5: FiltroMapperImpl non e un bean CDI

**File:** `layout/mapper/FiltroMapperImpl.java:8`

A differenza di tutti gli altri mapper, non e annotata con `@ApplicationScoped`.

---

### ARCH-6: Date salvate come stringhe

Tutti i campi data sono `String` invece di `java.time.LocalDate` o `LocalDateTime`:
- `Transaction.java:19`
- `TransactionDTO.java:23`
- `Layout.java:19`
- `LayoutDTO.java:23`

Impedisce l'indexing MongoDB e rende le range query inaffidabili.

---

### ARCH-7: Category embedded in Transaction

**File:** `Transaction.java:18`

```java
public Category category;
```

La `Category` e embedded come sub-document in ogni `Transaction`. Se una categoria viene aggiornata, tutte le transazioni esistenti mantengono i dati vecchi (inconsistenza dati).

---

### ARCH-8: Business logic nel repository

**File:** `TransactionRepository.java:18-108`

`ricercaTransaction()` contiene:
- Validazione date (righe 28-31)
- Logica paginazione default (righe 76-84)
- Calcolo metadati paginazione (righe 98-99)
- Assemblaggio oggetto risposta (righe 101-103)

Questa logica appartiene al service layer.

---

## Backend - Sicurezza

### SEC-1: Regex injection (vedi BUG-10)

Input utente interpolato direttamente in pattern regex MongoDB.

---

### SEC-2: Nessuna autenticazione o autorizzazione

Nessun meccanismo di sicurezza (`quarkus-oidc`, `quarkus-elytron-security`, etc.). Tutti gli endpoint sono pubblicamente accessibili.

---

### SEC-3: Connection string MongoDB hardcoded

**File:** `application.yml:31`

```yaml
quarkus:
  mongodb:
    connection-string: mongodb://localhost:27017
```

Se MongoDB richiedesse autenticazione, le credenziali sarebbero in chiaro.

---

### SEC-4: Swagger UI abilitato in produzione

**File:** `application.yml:33-35`

```yaml
quarkus:
  swagger-ui:
    always-include: true
    enable: true
```

Espone lo schema API completo in produzione.

---

### SEC-5: Nessun rate limiting o limite dimensione richieste

Nessuna configurazione per limitare il body delle richieste o il rate delle chiamate.

---

## Backend - Performance

### PERF-1: Nessun indice MongoDB definito

Campi usati nelle query senza indice:
- `Category.codice` - usato in `findByCodice()`
- `Transaction.title` - usato in ricerche regex
- `Transaction.date` - usato in range query
- `Transaction.category.descrizione` / `category.codice` - usato in query su sub-document
- `Layout.layoutName` - usato in `findByLayoutName()`
- `Layout.isDefault` - usato nei filtri

Tutte le query eseguono full collection scan.

---

### PERF-2: Due round-trip al DB per ogni ricerca

**File:** `TransactionRepository.java:96-98`

```java
panacheQuery.page(paginazioneDTO.getNumeroPagina(), paginazioneDTO.getNumeroElementiPerPagina());
paginazioneDTO.setNumeroRisTotali(panacheQuery.count());  // Query separata
```

---

### PERF-3: Regex con leading wildcard non possono usare indici

```java
params.and("title", "(?i).*" + title + ".*");
```

Pattern `.*xxx.*` forzano un full collection scan. Considerare MongoDB text index o Atlas Search.

---

### PERF-4: Entity caricata interamente per le operazioni di delete

**File:** `TransactionsServiceImpl.java:89-92`

```java
Optional<Transaction> transaction = transactionRepository.findByIdOptional(new ObjectId(id));
if(transaction.isPresent()){
    transactionRepository.delete(transaction.get());
```

Usare `deleteById()` sarebbe piu efficiente.

---

### PERF-5: TransactionsServiceImpl @RequestScoped

Come da ARCH-4, `@Model` crea un'istanza per request. Nessuno stato request-specific e presente nel service.

---

## Backend - Testing

### TEST-1: Solo test boilerplate - testa endpoint inesistente

**File:** `src/test/java/org/acme/GreetingResourceTest.java`

```java
@Test
void testHelloEndpoint() {
    given()
      .when().get("/hello")
      .then()
         .statusCode(200)
         .body(is("Hello from Quarkus REST"));
}
```

Non esiste un endpoint `/hello` nell'applicazione. **Zero test** per:
- `CategoryApi`, `LayoutApi`, `TransactionsApi`
- `CategoryServiceImpl`, `LayoutServiceImpl`, `TransactionsServiceImpl`
- Nessun mapper testato
- Nessun integration test con MongoDB (Testcontainers/DevServices)

---

### TEST-2: Dipendenze test mancanti

`pom.xml` non include dipendenze per testing MongoDB (embedded mongo, testcontainers).

---

## Backend - Configurazione

### CONFIG-1: CORS configurato in due file diversi

CORS e presente sia in `application.properties` (righe 1-6) che in `application.yml` (righe 13-20) con valori leggermente diversi. Crea ambiguita su quali valori siano effettivamente attivi.

---

### CONFIG-2: Database name duplicato

**File:** `application.yml:3-5`

```yaml
"%prod":
  quarkus:
    mongodb:
      connection-string: mongodb://mongo:27017/expense-pulse
      database: expense-pulse
```

Il nome del database appare sia nella connection string che nella property `database`.

---

### CONFIG-3: Nessun profilo test per MongoDB

Nessun profilo `%test` e nessuna configurazione DevServices. I test richiedono un'istanza MongoDB manuale.

---

### CONFIG-4: `@CommonsLog` senza dipendenza esplicita

Multipli file usano `@CommonsLog` di Lombok senza una dipendenza esplicita `commons-logging`. Usare `@Slf4j` sarebbe piu appropriato con Quarkus.

---

## Backend - API Design

### API-1: POST usato per operazioni di lettura

- `POST /layouts/default` - recuperare il layout default dovrebbe essere `GET`
- `POST /layouts/reset` - reset al default dovrebbe essere `PUT` o `GET`
- `POST /transactions/ricerca` - la ricerca con filtri puo giustificare il POST per il body, ma e discutibile

---

### API-2: Endpoint duplicati

**File:** `LayoutApi.java:47-52`

`GET /layouts/` e `GET /layouts/all` ritornano gli stessi dati. Ridondante.

---

### API-3: Status code inconsistenti nella documentazione

- `CategoryApi.creaCategory()` ritorna 201 ma la documentazione OpenAPI dice `responseCode = "200"`
- `CategoryApi.aggiornaCategory()` ritorna 204 ma la documentazione dice `responseCode = "200"`

---

### API-4: Nessuna struttura errore standardizzata

Nessun formato errore standard (es. `{"error": "message", "code": "XXX"}`). I client ricevono errori 500 generici.

---

### API-5: Endpoint delete senza documentazione `@APIResponses`

**File:** `TransactionsApi.java:102-115` - manca l'annotazione `@APIResponses`.

---

---

# FRONTEND (Vue 3 + TypeScript)

## Frontend - Bug Critici

### BUG-01: `saveTransaction()` crea una categoria invece di aggiornare una transazione

**File:** `src/components/TransactionHistory.vue:78-127`

La funzione e nominata `saveTransaction()` ma chiama `categoryStore.addCategory(...)` (riga 100) e mostra "Categoria creata con successo" (riga 121). Copy-paste errato dalla logica di creazione categoria.

---

### BUG-03: Spreading di una stringa corrompe lo stato del layout

**File:** `src/constants/app.constants.ts:5` + `src/components/EditControl.vue:23`

```typescript
// app.constants.ts
export const DEFAULT_LAYOUT_HOME = "DEFAULT_LAYOUT_HOME";  // E' una stringa!

// EditControl.vue
layout.value = [...DEFAULT_LAYOUT_HOME];  // Produce ['D','E','F','A','U','L','T','_',...]
```

---

## Frontend - Bug Importanti

### BUG-02: Import eager vanifica il lazy loading

**File:** `src/router/index.ts:3,17`

```typescript
import CategoriesView from '../views/CategoriesView.vue'  // Riga 3: eager (inutilizzato)
// ...
component: () => import('../views/CategoriesView.vue')     // Riga 17: lazy (vanificato)
```

L'import statico a riga 3 carica il modulo subito, rendendo inutile l'import dinamico a riga 17.

---

### BUG-04: Store layout condiviso causa collisione tra view

**File:** `src/stores/layoutStore.ts`

`HomeView` e `CategoriesView` condividono lo stesso singleton `layoutStore` e scrivono su `currentLayout`. Navigando tra le view, il layout di una sovrascrive quello dell'altra.

---

### BUG-05: `window.scrollTo` fuori da onMounted

**File:** `src/views/HomeView.vue:69`

`window.scrollTo({ top: 0, behavior: "smooth" })` eseguito a livello di modulo (fuori da `onMounted`). Duplicato e problematico in ambienti non-browser (SSR/test).

---

### BUG-06: `editTransaction` ref non inizializzata

**File:** `src/components/TransactionHistory.vue:21`

`editTransaction` dichiarata come `ref<TransactionVO>()` senza valore iniziale. Il modal commentato (righe 201-213) usa `editTransaction!.title` con non-null assertion - causerebbe runtime error se riabilitato.

---

### BUG-07: `fetchCategories()` senza await

**File:** `src/views/CategoriesView.vue:54`

```typescript
categoryStore.fetchCategories()  // Manca await - errori inghiottiti silenziosamente
```

---

### BUG-08: `FiltroTransactionDTO.transactions` tipizzato come `any[]`

**File:** `src/models/dtos/FiltroTransactionDTO.ts:4`

Bypassa completamente la type safety di TypeScript. Il DTO sembra anche inutilizzato.

---

## Frontend - Qualità del Codice

### CQ-01: Codice commentato (~200+ righe)

| File | Righe | Contenuto |
|------|-------|-----------|
| `views/HomeView.vue` | 77-143 | ~67 righe di codice morto |
| `views/CategoriesView.vue` | 61-99 | ~39 righe di codice morto |
| `constants/app.constants.ts` | 6-22 | Array commentati |
| `services/layoutService.ts` | 5-23, 70-73 | Logica JWT/reset |
| `stores/layoutStore.ts` | 28-41 | Funzione commentata |
| `components/TransactionHistory.vue` | 188-229 | Intero modal |

---

### CQ-02: `formatCurrency` duplicata in 4 componenti

```typescript
const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('it-IT', { style: 'currency', currency: 'EUR' }).format(amount)
}
```

**File:**
- `components/BalanceCards.vue:8`
- `components/TransactionHistory.vue:36`
- `components/CategoryStats.vue:26`
- `components/CategoryTable.vue:21`

**Fix:** estrarre in `src/utils/formatters.ts`.

---

### CQ-03: `generateRandomColor` duplicata in 3 componenti

**File:**
- `components/TransactionForm.vue:37-44`
- `components/TransactionHistory.vue:26-33`
- `components/CategoryForm.vue:32-39`

---

### CQ-04: Import inutilizzati

| File | Import |
|------|--------|
| `TransactionHistory.vue:7` | `X` da `lucide-vue-next` |
| `CategoriesView.vue:3` | `type LayoutItemVO` |
| `EditControl.vue:10` | `type LayoutItem` da `chart.js` (fonte sbagliata!) |
| `constants/app.constants.ts:1` | `type LayoutItemVO` |
| `router/index.ts:3` | `CategoriesView` (import eager inutilizzato) |

---

### CQ-05: Emit inutilizzati

| File | Emit dichiarati ma mai chiamati |
|------|-------------------------------|
| `TransactionHistory.vue:45` | `emit('edit', ...)`, `emit('delete', ...)` |
| `TransactionForm.vue:34` | `emit('success')`, `emit('cancel')`, `emit('edit')` |

---

### CQ-06: Typo "vategory" nel emit di CategoryTable

**File:** `src/components/CategoryTable.vue:17`

```typescript
(e: "edit", vategory: CategoryVO): void  // Dovrebbe essere "category"
```

---

### CQ-07: Log prefisso errato

**File:** `src/views/HomeView.vue:169`

Logga `[CategoriesView.handleLayoutChange]` pur essendo in `HomeView`. Artefatto da copy-paste.

---

### CQ-08: Console.log con emoji in tutto il codice

`console.log`/`console.warn`/`console.error` con prefissi emoji sparsi in:
- `categoryStore.ts` (righe 9, 17, 33, 77, 93, 106)
- `expenseStore.ts` (righe 12, 74, 85, 109, 119, 139, 144)
- `layoutStore.ts` (righe 111, 115, 129, 131, etc.)

Dovrebbero essere rimossi o sostituiti con un sistema di logging.

---

### CQ-09: `EditControl.vue` completamente inutilizzato

Non importato ne usato da nessun altro file. Contiene anche BUG-03 (`DEFAULT_LAYOUT_HOME` spreading).

---

## Frontend - Architettura

### ARCH-01: `GridContainer.vue` senza TypeScript

**File:** `src/components/GridContainer.vue:1`

`<script setup>` manca `lang="ts"`. Props definiti con runtime type checks invece di TypeScript generics.

---

### ARCH-02: Mutazione diretta dello store

**File:** `views/HomeView.vue:161-167`, `views/CategoriesView.vue:129-135`

```typescript
layoutStore.currentLayout = { ... }  // Mutazione diretta invece di action dedicata
```

---

### ARCH-03: Service layer completamente inutilizzato

`categoryService.ts` e `layoutService.ts` definiscono metodi (`getAll()`, `create()`, etc.) ma gli store chiamano direttamente `api.get`/`api.post`/`api.put`/`api.delete`. I file service sono codice morto.

---

### ARCH-04: Duplicazione massiva tra HomeView e CategoriesView

Codice quasi identico in entrambe le view:
- Toggle edit mode (`toggleEditMode`)
- Layout change handlers (`handleLayoutChange`)
- Reset layout (`resetLayout`)
- Template GridContainer con slot
- Button bar con icone Lock/Edit3/RotateCcw
- CSS per placeholder e resizing

**Fix:** estrarre in un composable `useLayoutEditor` o in un componente higher-level.

---

### ARCH-05: Nessun error boundary globale

Nessun error handler o fallback. Se un componente lancia un errore durante il render, l'intera app crasha.

---

### ARCH-06: `FiltroTransactionDTO.ts` inutilizzato

Non importato ne usato. Probabilmente sostituito da `FiltroRicercaTransactionDTO.ts`.

---

## Frontend - Sicurezza

### SEC-01: URL API hardcoded

**File:** `src/services/api.ts:4`

```typescript
const api = axios.create({
  baseURL: 'http://localhost:9091/api/v1'
})
```

Nessun `.env` file. Dovrebbe usare `import.meta.env.VITE_API_BASE_URL`.

---

### SEC-02: Protocollo HTTP invece di HTTPS

L'URL usa `http://`. Per produzione serve HTTPS.

---

### SEC-03: Nessuna sanitizzazione input

- `TransactionForm.vue:218` - `title` inviato direttamente all'API senza validazione lunghezza
- `CategoryForm.vue:101` - `descrizione` con solo `.trim()`
- Nessun vincolo di lunghezza massima su nessun input

---

### SEC-04: Link a conversazione Gemini nel codice

**File:** `src/views/CategoriesView.vue:14`

Commento contiene link a conversazione esterna: `https://gemini.google.com/gem/...`. Non dovrebbe essere nel codice sorgente.

---

## Frontend - Performance

### PERF-01: Import eager vanifica lazy loading (vedi BUG-02)

---

### PERF-02: Fetch sequenziali in onMounted

**File:** `src/views/HomeView.vue:51-66`

Layout, transazioni e categorie fetchate sequenzialmente. Potrebbero essere parallele:

```typescript
await Promise.all([
  store.fetchTransactions(),
  categoryStore.fetchCategories()
]);
```

---

### PERF-03: Nessun debounce sulla ricerca

**File:** `src/components/ResearchTable.vue:82`

`@input="applyFilters"` su ogni keystroke genera una chiamata API per ogni carattere digitato.

**Fix:** aggiungere debounce di 300ms.

---

### PERF-04: Intera lista transazioni ri-fetchata dopo ogni operazione

**File:** `src/stores/expenseStore.ts:107,117,131`

Dopo `addTransaction`, `deleteTransaction` e `updateTransaction`, lo store ri-fetcha l'intera lista. Update ottimistici migliorerebbero l'UX.

---

### PERF-05: `vueDevTools()` incluso senza guardia ambiente

**File:** `vite.config.ts:11`

`vueDevTools()` incluso incondizionatamente anche nei build di produzione.

---

### PERF-06: Dockerfile esegue dev server

**File:** `Dockerfile`

Esegue `npm run dev -- --host` invece di buildare e servire i file statici con nginx.

---

## Frontend - TypeScript

### TS-01: Tipo `any` in LayoutItemMapper

**File:** `src/models/mappers/LayoutItemMapper.ts:11,29`

```typescript
toVO(dto: any)                    // Dovrebbe essere LayoutItemDTO
toDTO(vo: LayoutItemVO): any      // Dovrebbe essere LayoutItemDTO
```

---

### TS-02: GridContainer castato a `any`

**File:** `views/HomeView.vue:34`, `views/CategoriesView.vue:22`

```typescript
const GridContainer = _GridContainer as any;  // Disabilita completamente il type checking
```

---

### TS-03: `GridContainer.vue` senza `lang="ts"` (vedi ARCH-01)

---

### TS-04: `env.d.ts` usa `any`

**File:** `env.d.ts:5`

```typescript
const component: DefineComponent<{}, {}, any>  // Indebolisce la type inference per tutti i .vue import
```

---

### TS-05: Catch blocks usano `: any`

File coinvolti: `TransactionForm.vue:178`, `CategoryForm.vue:71`, `TransactionHistory.vue:122`, `CategoryTable.vue:34`

```typescript
catch (e: any)  // Dovrebbe essere `unknown` con type guard
```

---

### TS-06: Slot typing con `any`

**File:** `views/HomeView.vue:223`, `views/CategoriesView.vue:186`

```html
<template #default="{ item }: any">  <!-- Perde la type safety -->
```

---

## Frontend - Integrazione API

### API-01: Nessun interceptor centralizzato

**File:** `src/services/api.ts`

L'istanza axios non ha response interceptor per errori comuni (401, 403, 500, errori di rete). Ogni store duplica il proprio `try/catch`.

---

### API-02: Nessun timeout configurato

L'istanza axios non ha proprieta `timeout`. Richieste a backend lento restano appese indefinitamente.

---

### API-03: Gestione errori inconsistente negli store

| Store | Metodo | Comportamento |
|-------|--------|---------------|
| `expenseStore` | `fetchTransactions` | Inghiotte l'errore |
| `expenseStore` | `addTransaction` | Rilancia l'errore |
| `categoryStore` | `fetchCategories` | Inghiotte l'errore |
| `categoryStore` | `deleteCategory` | Inghiotte l'errore |
| `categoryStore` | `addCategory` | Rilancia l'errore |
| `categoryStore` | `updateCategory` | Rilancia l'errore |

---

## Frontend - UI/UX

### UX-01: Nessun loading indicator

Gli state `loading` esistono negli store (`expenseStore.loading`, `categoryStore.loading`, `layoutStore.loading`) ma nessun componente li usa per mostrare spinner o skeleton.

---

### UX-02: Nessun empty state per le categorie

**File:** `src/components/CategoryTable.vue`

La tabella non mostra un messaggio quando la lista categorie e vuota.

---

### UX-03: Nessun attributo di accessibilita (ARIA)

- Nessun `aria-label` sui pulsanti con sole icone (edit/delete)
- Nessun `aria-current` sui link di navigazione attivi
- Label dei form non associate agli input via `for`/`id`
- `<html lang="">` in `index.html:2` e vuoto

---

### UX-04: Titolo pagina "Vite App"

**File:** `index.html:8`

Il titolo e il valore default dello scaffold. Dovrebbe essere "ExpensePulse".

---

### UX-05: `window.confirm()` e `window.alert()` per azioni critiche

Usati in: `TransactionHistory.vue:67`, `CategoryTable.vue:30`, `TransactionForm.vue:137/145/155/177`, `HomeView.vue:121`, `CategoriesView.vue:116`

Bloccano il thread principale e possono essere bloccati dai browser. Preferire dialog custom o toast con undo.

---

### UX-06: Campo data mancante nel form transazioni

**File:** `src/components/TransactionForm.vue`

Il model include un campo `date` (riga 29) che default a oggi, ma non c'e un `<input type="date">` nel template. La data e sempre quella corrente.

---

### UX-07: Paginazione dentro l'area scrollabile

**File:** `src/components/TransactionHistory.vue:185`

`AppPagination` e renderizzato dentro il container `overflow-y-auto` (riga 138). L'utente deve scrollare fino in fondo per vedere i controlli di paginazione.

---

---

# Raccomandazioni Prioritarie

## Priorita 1 - Bug Critici

1. Fixare `TransactionResponseMapperImpl.convertDtoToEntity()` - ritorna sempre null
2. Fixare `CategoryServiceImpl.aggiornaCategory()` - lookup per codice invece che per id
3. Fixare il catch silenzioso di `MongoWriteException` non-11000
4. Sanitizzare input nelle regex di ricerca con `Pattern.quote()`
5. Fixare `saveTransaction()` nel frontend - crea categoria invece di aggiornare transazione
6. Fixare `DEFAULT_LAYOUT_HOME` - e una stringa, non un array

## Priorita 2 - Architettura e Sicurezza

7. Aggiungere `ExceptionMapper` JAX-RS per risposte errore strutturate
8. Aggiungere Bean Validation (`@Valid`, `@NotBlank`, `@NotNull`) sui DTO
9. Usare variabili d'ambiente per URL API nel frontend
10. Fixare exception handling per preservare gli stack trace
11. Cambiare `@Model` a `@ApplicationScoped` su `TransactionsServiceImpl`
12. Aggiungere indici MongoDB per i campi usati nelle query

## Priorita 3 - Qualita e Manutenibilita

13. Scrivere test reali (unit + integration con DevServices/Testcontainers)
14. Rimuovere tutto il codice commentato
15. Estrarre utility condivise (`formatCurrency`, `generateRandomColor`)
16. Creare composable `useLayoutEditor` per eliminare duplicazione tra view
17. Consolidare configurazione CORS in un solo file
18. Aggiungere debounce sulla ricerca nel frontend
19. Aggiungere interceptor axios centralizzati con timeout

## Priorita 4 - Polish

20. Usare tipi data appropriati invece di stringhe
21. Fixare naming inconsistente (italiano/inglese)
22. Rimuovere import e variabili inutilizzati
23. Migliorare accessibilita (ARIA labels, `lang` attribute)
24. Aggiungere loading indicators e empty states
25. Fixare Dockerfile frontend per build di produzione
