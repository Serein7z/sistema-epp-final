package com.utp.demo.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.*;

import com.utp.demo.model.Guante;
import com.utp.demo.service.GuanteService;

@RestController
@RequestMapping("/guantes")
public class GuanteController {

    private final GuanteService servicio;

    public GuanteController(GuanteService servicio) {
        this.servicio = servicio;
    }
 @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'USER')")
    public List<Guante> listar() {
        return servicio.listar();
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'USER')")
    public ResponseEntity<Guante> obtener(@PathVariable int id) {
        Guante guante = servicio.obtenerPorId(id);
        if (guante == null) return ResponseEntity.notFound().build();
        return ResponseEntity.ok(guante);
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Guante> crear(@RequestBody Guante guante) {
        return ResponseEntity.status(HttpStatus.CREATED).body(servicio.guardar(guante));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Guante> actualizar(@PathVariable int id, @RequestBody Guante guante) {
        Guante actualizado = servicio.actualizar(id, guante);
        if (actualizado == null) return ResponseEntity.notFound().build();
        return ResponseEntity.ok(actualizado);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> eliminar(@PathVariable int id) {
        if (!servicio.eliminar(id)) return ResponseEntity.notFound().build();
        return ResponseEntity.noContent().build();
    }
}
