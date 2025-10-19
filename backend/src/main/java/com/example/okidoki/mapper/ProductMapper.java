package com.example.okidoki.mapper;

import com.example.okidoki.dto.ProductDTO;
import com.example.okidoki.entity.Product;
import org.mapstruct.Mapper;
import org.mapstruct.ReportingPolicy;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface ProductMapper {
    ProductDTO toDto(Product product);

    List<ProductDTO> toDTOList(List<Product> products);
}
