package com.utp.demo.repository;

import com.utp.demo.model.Casco;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CascoRepository extends JpaRepository<Casco, Integer> {
    List<Casco> findByEstadoIgnoreCase(String estado);
}
