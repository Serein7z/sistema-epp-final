package com.utp.demo.service;

import org.springframework.stereotype.Service;
import java.util.*;

import com.utp.demo.model.Mascarilla;
import com.utp.demo.repository.MascarillaRepository;

@Service
public class MascarillaService {

    private final MascarillaRepository repositorio;

    public MascarillaService(MascarillaRepository repositorio) {
        this.repositorio = repositorio;
    }

    public List<Mascarilla> listar() {
        return repositorio.findAll();
    }

    public Mascarilla obtenerPorId(int id) {
        return repositorio.findById(id).orElse(null);
    }

    public Mascarilla guardar(Mascarilla mascarilla) {
        mascarilla.setId(0);
        return repositorio.save(mascarilla);
    }

    public Mascarilla actualizar(int id, Mascarilla datos) {
        Mascarilla existente = obtenerPorId(id);
        if (existente == null) return null;
        existente.setTipo(datos.getTipo());
        existente.setFiltracion(datos.getFiltracion());
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
