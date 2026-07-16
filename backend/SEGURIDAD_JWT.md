# Seguridad con Spring Security + JWT

## ¿Qué es JWT?

JWT (JSON Web Token) es un estándar para transmitir información de forma segura entre cliente y servidor.
El token tiene tres partes separadas por puntos:

```
eyJhbGci...   →   HEADER.PAYLOAD.SIGNATURE
```

- **Header**: algoritmo de firma (HS256)
- **Payload**: datos del usuario (username, roles, expiración)
- **Signature**: firma con clave secreta — garantiza que nadie lo modificó

---

## Flujo de autenticación

```
1. Cliente envía:     POST /auth/login  { username, password }
2. Servidor valida las credenciales
3. Servidor responde: { "token": "eyJhbGci..." }
4. Cliente guarda el token

5. Cliente envía:     GET /cascos
                      Authorization: Bearer eyJhbGci...
6. JwtFilter intercepta y valida el token
7. Si es válido → acceso permitido (200 OK)
8. Si no hay token o es inválido → acceso denegado (403 Forbidden)
```

---

## Componentes implementados

### 1. `JwtUtil.java`
Clase utilitaria que se encarga de:
- **Generar** el token JWT firmado con una clave secreta
- **Extraer** el username desde el token
- **Validar** que el token no esté expirado y la firma sea correcta

```java
// Genera token con username + roles + expiración de 24 horas
public String generarToken(UserDetails userDetails)

// Extrae el username del token
public String extraerUsername(String token)

// Verifica que el token sea válido y no esté expirado
public boolean validarToken(String token, UserDetails userDetails)
```

---

### 2. `JwtFilter.java`
Filtro que se ejecuta **en cada request** antes de llegar al controller.
Extiende `OncePerRequestFilter` para garantizar que se ejecuta una sola vez por request.

Proceso:
1. Lee el header `Authorization: Bearer <token>`
2. Extrae el username del token
3. Valida el token con `JwtUtil`
4. Si es válido, registra al usuario en el `SecurityContextHolder`

---

### 3. `SecurityConfig.java`
Configuración central de Spring Security. Define:

- **Sesión STATELESS**: el servidor no guarda sesión, cada request se valida con el token
- **CSRF deshabilitado**: no necesario en APIs REST con JWT
- **Rutas públicas**: solo `/auth/login` es accesible sin token
- **Rutas protegidas**: todo lo demás requiere token válido
- **Usuarios en memoria**: admin y user con contraseña hasheada con BCrypt
- **BCryptPasswordEncoder**: hashea las contraseñas, nunca se guardan en texto plano

```java
.authorizeHttpRequests(auth -> auth
    .requestMatchers("/auth/login").permitAll()  // público
    .anyRequest().authenticated()                 // protegido
)
```

---

### 4. `AuthController.java`
Único endpoint público: `POST /auth/login`

Recibe las credenciales, las valida y devuelve el token JWT.

---

### 5. `AuthService.java`
Lógica de autenticación:
1. Usa `AuthenticationManager` para validar usuario y contraseña
2. Si son correctos, llama a `JwtUtil` para generar el token
3. Devuelve el token en la respuesta

---

### 6. `Usuario.java`
Modelo de usuario que implementa `UserDetails` de Spring Security.
Contiene username, contraseña hasheada y rol (`ROLE_ADMIN` o `ROLE_USER`).

---

## Usuarios de prueba

| Usuario | Contraseña | Rol         |
|---------|-----------|-------------|
| admin   | 1234      | ROLE_ADMIN  |
| user    | 1234      | ROLE_USER   |

---

## Endpoints

| Método | Endpoint         | Acceso     | Descripción                        |
|--------|-----------------|------------|------------------------------------|
| POST   | /auth/login      | Público    | Devuelve token JWT                 |
| GET    | /cascos          | Protegido  | Lista todos los cascos             |
| GET    | /cascos/{id}     | Protegido  | Obtiene un casco por ID            |
| GET    | /guantes         | Protegido  | Lista todos los guantes            |
| GET    | /lentes          | Protegido  | Lista todos los lentes             |
| GET    | /mascarillas     | Protegido  | Lista todas las mascarillas        |
| GET    | /zapatos         | Protegido  | Lista todos los zapatos            |

---

## Conceptos clave de Spring Security usados

| Concepto                    | Para qué se usa                                              |
|-----------------------------|--------------------------------------------------------------|
| `SecurityFilterChain`       | Define reglas de acceso por endpoint                        |
| `OncePerRequestFilter`      | Filtro que se ejecuta una vez por cada request              |
| `UserDetailsService`        | Carga el usuario desde la fuente de datos (memoria en este caso) |
| `AuthenticationManager`     | Orquesta la validación de credenciales                      |
| `BCryptPasswordEncoder`     | Hashea contraseñas de forma segura                          |
| `SecurityContextHolder`     | Almacena el usuario autenticado durante el request          |
| `SessionCreationPolicy.STATELESS` | Sin sesiones en servidor — cada request es independiente |
