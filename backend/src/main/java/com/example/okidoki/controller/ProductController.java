package com.example.okidoki.controller;

import com.example.okidoki.dto.ProductDTO;
import com.example.okidoki.service.ProductService;
import lombok.AllArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RequestMapping("api")
@AllArgsConstructor
@RestController
public class ProductController {

    public final ProductService productService;

    @GetMapping("/public/products")
    public List<ProductDTO> getProdcuts() {
        return productService.getAllProducts();
    }

    @PostMapping("/public/product")
    public void addProduct(@RequestBody ProductDTO productDTO) {
        productService.addProduct(productDTO);
    }
}
