package com.utp.demo.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

@Entity
public class Guante {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;
    private String material;
    private String talla;
    private String estado;
    private String observacion;

    public Guante() {}

    public Guante(int id, String material, String talla, String estado, String observacion) {
        this.id = id;
        this.material = material;
        this.talla = talla;
        this.estado = estado;
        this.observacion = observacion;
    }

    public int getId() { return id; }
    public void setId(int id) { this.id = id; }
    public String getMaterial() { return material; }
    public void setMaterial(String material) { this.material = material; }
    public String getTalla() { return talla; }
    public void setTalla(String talla) { this.talla = talla; }
    public String getEstado() { return estado; }
    public void setEstado(String estado) { this.estado = estado; }
    public String getObservacion() { return observacion; }
    public void setObservacion(String observacion) { this.observacion = observacion; }
}
