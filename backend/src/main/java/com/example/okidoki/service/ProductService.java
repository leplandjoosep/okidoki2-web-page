package com.example.okidoki.service;

import com.example.okidoki.dto.ProductDTO;
import com.example.okidoki.entity.Product;
import com.example.okidoki.mapper.ProductMapper;
import com.example.okidoki.repository.ProductRepo;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Slf4j
@Service
@AllArgsConstructor
public class ProductService {

    private ProductRepo productRepo;
    @Autowired
    private ProductMapper productMapper;


    public List<ProductDTO> getAllProducts() {
        return productMapper.toDTOList(productRepo.findAll());
    }

    public void addProduct(ProductDTO productDTO) {
        Product product = new Product();
        product.setDescription(productDTO.description());
        product.setName(productDTO.name());
        product.setPrice(productDTO.price());
        product.setPictureId(productDTO.pictureId());
        product.setOwnerId(productDTO.ownerId());
        log.debug("Product added with the id: {}", product.getId());
        productRepo.save(product);
    }
}
