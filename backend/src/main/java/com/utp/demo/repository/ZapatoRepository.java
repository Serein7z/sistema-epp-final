package com.utp.demo.repository;

import com.utp.demo.model.Zapato;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ZapatoRepository extends JpaRepository<Zapato, Integer> {
}
