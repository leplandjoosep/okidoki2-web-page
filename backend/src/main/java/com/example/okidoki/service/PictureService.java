package com.example.okidoki.service;

import com.example.okidoki.dto.PictureDTO;
import com.example.okidoki.entity.Picture;
import com.example.okidoki.mapper.PictureMapper;
import com.example.okidoki.repository.PictureRepo;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;

@Slf4j
@Service
@AllArgsConstructor
public class PictureService {
    private PictureRepo pictureRepo;
    private PictureMapper pictureMapper;

    public List<PictureDTO> getAllPictures() {
        return pictureMapper.toDtoList(pictureRepo.findAll());
    }
    public PictureDTO addPicture(PictureDTO pictureDTO) {

        String pictureString = pictureDTO.pictureString();


        Picture picture = new Picture();
        picture.setPictureString(pictureString);
        pictureRepo.save(picture);
        log.debug("New picture added with the id: {}", picture.getId());
        return pictureMapper.toDto(picture);
    }
    public PictureDTO getById(Long id) {
        return pictureMapper.toDto(pictureRepo.getReferenceById(id));
    }
}
