package com.utp.demo.service;

import org.springframework.stereotype.Service;
import java.util.*;

import com.utp.demo.model.Guante;
import com.utp.demo.repository.GuanteRepository;

@Service
public class GuanteService {

    private final GuanteRepository repositorio;

    public GuanteService(GuanteRepository repositorio) {
        this.repositorio = repositorio;
    }

    public List<Guante> listar() {
        return repositorio.findAll();
    }

    public Guante obtenerPorId(int id) {
        return repositorio.findById(id).orElse(null);
    }

    public Guante guardar(Guante guante) {
        guante.setId(0);
        return repositorio.save(guante);
    }

    public Guante actualizar(int id, Guante datos) {
        Guante existente = obtenerPorId(id);
        if (existente == null) return null;
        existente.setMaterial(datos.getMaterial());
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
