package com.example.okidoki.mapper;

import com.example.okidoki.dto.PictureDTO;
import com.example.okidoki.entity.Picture;
import org.mapstruct.Mapper;
import org.mapstruct.ReportingPolicy;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface PictureMapper {
    PictureDTO toDto(Picture picture);
    List<PictureDTO> toDtoList(List<Picture> pictureList);
}
