package com.utp.demo.service;

import org.springframework.stereotype.Service;
import java.util.*;

import com.utp.demo.model.Casco;
import com.utp.demo.repository.CascoRepository;

@Service
public class CascoService {

    private final CascoRepository repositorio;

    public CascoService(CascoRepository repositorio) {
        this.repositorio = repositorio;
    }

    public List<Casco> listar() {
        return repositorio.findAll();
    }

    public Casco obtenerPorId(int id) {
        return repositorio.findById(id).orElse(null);
    }

    public List<Casco> filtrarPorEstado(String estado) {
        return repositorio.findByEstadoIgnoreCase(estado);
    }

    public Casco guardar(Casco casco) {
        casco.setId(0);
        return repositorio.save(casco);
    }

    public Casco actualizar(int id, Casco datos) {
        Casco existente = obtenerPorId(id);
        if (existente == null) return null;
        existente.setMarca(datos.getMarca());
        existente.setTalla(datos.getTalla());
        existente.setEstado(datos.getEstado());
        existente.setObservacion(datos.getObservacion());
        return repositorio.save(existente);
    }

    public boolean eliminar(int id) {
        if (!repositorio.existsById(id)) return false;
        repositorio.deleteById(id);
        return true;
    }
}
