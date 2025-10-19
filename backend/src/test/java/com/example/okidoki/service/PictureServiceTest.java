package com.example.okidoki.service;

import com.example.okidoki.dto.PictureDTO;
import com.example.okidoki.entity.Picture;
import com.example.okidoki.mapper.PictureMapper;
import com.example.okidoki.repository.PictureRepo;
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
class PictureServiceTest {

    @Mock
    private PictureRepo pictureRepo;

    @Mock
    private PictureMapper pictureMapper;

    @InjectMocks
    private PictureService pictureService;

    @Test
    void get_all_pictures_success() {
        // Mock data
        Picture picture = new Picture();
        picture.setPictureString("Sample Picture String");

        PictureDTO pictureDTO = new PictureDTO(1L, "Sample Picture String");

        when(pictureRepo.findAll()).thenReturn(Collections.singletonList(picture));
        when(pictureMapper.toDtoList(Collections.singletonList(picture))).thenReturn(Collections.singletonList(pictureDTO));

        List<PictureDTO> result = pictureService.getAllPictures();

        assertEquals(1, result.size());
        assertEquals(1L, result.get(0).id());
        assertEquals("Sample Picture String", result.get(0).pictureString());
        verify(pictureRepo).findAll();
        verify(pictureMapper).toDtoList(Collections.singletonList(picture));
    }

    @Test
    void add_picture_success() {
        // Mock data
        PictureDTO pictureDTO = new PictureDTO(1L, "Sample Picture String");
        Picture picture = new Picture();
        picture.setPictureString("Sample Picture String");

        when(pictureRepo.save(any(Picture.class))).thenAnswer(invocation -> {
            Picture savedPicture = invocation.getArgument(0);
            savedPicture.setId(1L); // Set an ID for the saved picture
            return savedPicture;
        });

        // Mocking the mapper to handle any Picture to PictureDTO conversion
        when(pictureMapper.toDto(any(Picture.class))).thenAnswer(invocation -> {
            Picture passedPicture = invocation.getArgument(0);
            return new PictureDTO(passedPicture.getId(), passedPicture.getPictureString());
        });

        PictureDTO result = pictureService.addPicture(pictureDTO);

        assertEquals(1L, result.id());
        assertEquals("Sample Picture String", result.pictureString());
        verify(pictureRepo).save(any(Picture.class));
        verify(pictureMapper).toDto(any(Picture.class));
    }

    @Test
    void get_picture_by_id_success() {
        // Mock data
        Long pictureId = 1L;
        Picture picture = new Picture();
        picture.setId(pictureId);
        picture.setPictureString("Sample Picture String");

        PictureDTO pictureDTO = new PictureDTO(pictureId, "Sample Picture String");


        when(pictureRepo.getReferenceById(pictureId)).thenReturn(picture);
        when(pictureMapper.toDto(picture)).thenReturn(pictureDTO);

        PictureDTO result = pictureService.getById(pictureId);

        assertEquals(pictureId, result.id());
        assertEquals("Sample Picture String", result.pictureString());
        verify(pictureRepo).getReferenceById(pictureId);
        verify(pictureMapper).toDto(picture);
    }
}
