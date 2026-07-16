package com.utp.demo.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

@Entity
public class Casco {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;
    private String marca;
    private String talla;
    private String estado;
    private String observacion;

    public Casco() {}

    public Casco(int id, String marca, String talla, String estado, String observacion) {
        this.id = id;
        this.marca = marca;
        this.talla = talla;
        this.estado = estado;
        this.observacion = observacion;
    }

    public int getId() { return id; }
    public void setId(int id) { this.id = id; }
    public String getMarca() { return marca; }
    public void setMarca(String marca) { this.marca = marca; }
    public String getTalla() { return talla; }
    public void setTalla(String talla) { this.talla = talla; }
    public String getEstado() { return estado; }
    public void setEstado(String estado) { this.estado = estado; }
    public String getObservacion() { return observacion; }
    public void setObservacion(String observacion) { this.observacion = observacion; }
}
