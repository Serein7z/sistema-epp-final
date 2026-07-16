package com.utp.demo.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.*;

import com.utp.demo.model.Casco;
import com.utp.demo.service.CascoService;

@RestController
@RequestMapping("/cascos")
public class CascoController {

    private final CascoService servicio;

    public CascoController(CascoService servicio) {
        this.servicio = servicio;
    }

    // Solo ADMIN puede filtrar por estado — el rol viaja dentro del JWT
    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/estado/{estado}")
    public List<Casco> filtrarPorEstado(@PathVariable String estado) {
        return servicio.filtrarPorEstado(estado);
    }

     // ADMIN y USER pueden listar
    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'USER')")
    public List<Casco> listar() {
        return servicio.listar();
    }

    // ADMIN y USER pueden ver por ID
    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'USER')")
    public ResponseEntity<Casco> obtener(@PathVariable int id) {
        Casco casco = servicio.obtenerPorId(id);
        if (casco == null) return ResponseEntity.notFound().build();
        return ResponseEntity.ok(casco);
    }

    // Solo ADMIN puede crear
    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Casco> crear(@RequestBody Casco casco) {
        return ResponseEntity.status(HttpStatus.CREATED).body(servicio.guardar(casco));
    }

    // Solo ADMIN puede actualizar
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Casco> actualizar(@PathVariable int id, @RequestBody Casco casco) {
        Casco actualizado = servicio.actualizar(id, casco);
        if (actualizado == null) return ResponseEntity.notFound().build();
        return ResponseEntity.ok(actualizado);
    }

    // Solo ADMIN puede eliminar
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> eliminar(@PathVariable int id) {
        boolean eliminado = servicio.eliminar(id);
        if (!eliminado) return ResponseEntity.notFound().build();
        return ResponseEntity.noContent().build();
    }
    
}
