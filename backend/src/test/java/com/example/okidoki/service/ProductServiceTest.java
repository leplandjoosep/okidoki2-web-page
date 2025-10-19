package com.example.okidoki.service;

import com.example.okidoki.dto.ProductDTO;
import com.example.okidoki.entity.Product;
import com.example.okidoki.mapper.ProductMapper;
import com.example.okidoki.repository.ProductRepo;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;


import java.util.Collections;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ProductServiceTest {

    @Mock
    private ProductRepo productRepo;

    @Mock
    private ProductMapper productMapper;

    @InjectMocks
    private ProductService productService;

    @Test
    void get_all_products_success() {
        // Mock data
        Product product = new Product();
        product.setId(1L);
        product.setName("Test Product");
        product.setDescription("Test Description");
        product.setPrice(100F);
        product.setPictureId(1);
        product.setOwnerId(1);

        ProductDTO productDTO = new ProductDTO(1L, "Test Product", 1, "Test Description", 1, 100f);

        when(productRepo.findAll()).thenReturn(Collections.singletonList(product));
        when(productMapper.toDTOList(Collections.singletonList(product))).thenReturn(Collections.singletonList(productDTO));

        List<ProductDTO> result = productService.getAllProducts();

        assertEquals(1, result.size());
        assertEquals(1L, result.get(0).id());
        assertEquals("Test Product", result.get(0).name());
        assertEquals(1, result.get(0).ownerId());
        assertEquals("Test Description", result.get(0).description());
        assertEquals(1, result.get(0).pictureId());
        assertEquals(100f, result.get(0).price());
        verify(productRepo).findAll();
        verify(productMapper).toDTOList(Collections.singletonList(product));
    }

    @Test
    void add_product_success() {
        // Mock data
        ProductDTO productDTO = new ProductDTO(1L, "Test Product", 1, "Test Description", 1, 100f);

        when(productRepo.save(any(Product.class))).thenAnswer(invocation -> {
            Product savedProduct = invocation.getArgument(0);
            savedProduct.setId(1L); // Set an ID for the saved product
            return savedProduct;
        });

        productService.addProduct(productDTO);

        verify(productRepo).save(any(Product.class));
    }
}
