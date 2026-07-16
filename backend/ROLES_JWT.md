Acá está:

---

# ROLES Y PERMISOS — EPP Demo (Avance 2)

## Tecnologías usadas
- Spring Boot 3.2
- Spring Security 6
- JWT (jjwt)
- Java 17

---

## Usuarios del sistema

| Usuario | Contraseña | Rol |
|---------|------------|-----|
| admin | 1234 | ADMIN |
| user | 1234 | USER |

Los usuarios están en memoria dentro de `SecurityConfig.java`. Las contraseñas están hasheadas con BCrypt.

---

## Cómo funciona la autenticación

1. El cliente hace POST a `/auth/login` con usuario y contraseña
2. El servidor valida las credenciales y devuelve un token JWT
3. El cliente incluye ese token en todas las peticiones siguientes en el header: `Authorization: Bearer <token>`
4. El filtro `JwtFilter` intercepta cada request, extrae el usuario del token y lo carga en el contexto de seguridad
5. Spring Security evalúa el rol del usuario antes de ejecutar cada endpoint

---

## Permisos por endpoint
| Método | Endpoint                | USER      | ADMIN     |
| ------ | ----------------------- | --------- | --------- |
| POST   | /auth/login             | libre     | libre     |
| GET    | /cascos                 | permitido | permitido |
| GET    | /cascos/{id}            | permitido | permitido |
| GET    | /cascos/estado/{estado} | denegado  | permitido |
| POST   | /cascos                 | denegado  | permitido |
| DELETE | /cascos/{id}            | denegado  | permitido |
| GET    | /guantes                | permitido | permitido |
| GET    | /guantes/{id}           | permitido | permitido |
| POST   | /guantes                | denegado  | permitido |
| DELETE | /guantes/{id}           | denegado  | permitido |
| GET    | /lentes                 | permitido | permitido |
| GET    | /lentes/{id}            | permitido | permitido |
| POST   | /lentes                 | denegado  | permitido |
| DELETE | /lentes/{id}            | denegado  | permitido |
| GET    | /mascarillas            | permitido | permitido |
| GET    | /mascarillas/{id}       | permitido | permitido |
| POST   | /mascarillas            | denegado  | permitido |
| DELETE | /mascarillas/{id}       | denegado  | permitido |
| GET    | /zapatos                | permitido | permitido |
| GET    | /zapatos/{id}           | permitido | permitido |
| POST   | /zapatos                | denegado  | permitido |
| DELETE | /zapatos/{id}           | denegado  | permitido |


---

## Cómo se implementa en el código

### 1. Habilitar @PreAuthorize — SecurityConfig.java
```java
@Configuration
@EnableWebSecurity
@EnableMethodSecurity  // esta anotación activa el uso de @PreAuthorize en los controllers
public class SecurityConfig { ... }
```

### 2. Aplicar roles en los controllers (ejemplo CascoController)
```java
// USER y ADMIN pueden leer
@PreAuthorize("hasAnyRole('USER','ADMIN')")
@GetMapping
public List<Casco> listar() { ... }

// Solo ADMIN puede filtrar por estado
@PreAuthorize("hasRole('ADMIN')")
@GetMapping("/estado/{estado}")
public List<Casco> filtrarPorEstado(@PathVariable String estado) { ... }

// Solo ADMIN puede crear
@PreAuthorize("hasRole('ADMIN')")
@PostMapping
public ResponseEntity<Casco> crear(@RequestBody Casco casco) { ... }

// Solo ADMIN puede eliminar
@PreAuthorize("hasRole('ADMIN')")
@DeleteMapping("/{id}")
public ResponseEntity<Void> eliminar(@PathVariable int id) { ... }
```

### 3. Cómo el sistema conoce el rol del usuario
En `Usuario.java`, el método `getAuthorities()` devuelve el rol con el prefijo `ROLE_`:
```java
@Override
public Collection<? extends GrantedAuthority> getAuthorities() {
    return List.of(new SimpleGrantedAuthority("ROLE_" + rol));
}
```
Por eso en `@PreAuthorize` se escribe `hasRole('ADMIN')` sin el prefijo — Spring lo agrega solo.

---

## Respuestas del servidor según el rol

| Situación | Código HTTP |
|-----------|-------------|
| Sin token | 403 Forbidden |
| Token válido, rol suficiente | 200 OK |
| Token válido, rol insuficiente | 403 Forbidden |
| Token expirado o inválido | 403 Forbidden |
| Credenciales incorrectas en login | 401 Unauthorized |

---

## Flujo de prueba en Postman

**Paso 1 — Login como user**
```
POST /auth/login
Body: { "username": "user", "password": "1234" }
```
Copiar el token de la respuesta.

**Paso 2 — Intentar crear un casco con token de user**
```
POST /cascos
Authorization: Bearer <token_de_user>
Body: { "id": 6, "marca": "MSA", "talla": "L", "estado": "Nuevo", "observacion": "Test" }
Resultado esperado: 403 Forbidden
```

**Paso 3 — Login como admin**
```
POST /auth/login
Body: { "username": "admin", "password": "1234" }
```

**Paso 4 — Crear el mismo casco con token de admin**
```
POST /cascos
Authorization: Bearer <token_de_admin>
Body: { "id": 6, "marca": "MSA", "talla": "L", "estado": "Nuevo", "observacion": "Test" }
Resultado esperado: 200 OK
```