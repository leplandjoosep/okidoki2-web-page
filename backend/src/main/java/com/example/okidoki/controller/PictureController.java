package com.example.okidoki.controller;

import com.example.okidoki.dto.PictureDTO;
import com.example.okidoki.service.PictureService;
import lombok.AllArgsConstructor;
import org.springframework.web.bind.annotation.*;


@RequestMapping("api")
@AllArgsConstructor
@RestController
public class PictureController {
    public final PictureService pictureService;

    @PostMapping("/public/picture")
    public PictureDTO postPicture(@RequestBody PictureDTO pictureDTO) {
        return pictureService.addPicture(pictureDTO);
    }

    @GetMapping("/public/picture/{id}")
    public PictureDTO getPictureById(@PathVariable Long id) {
        return pictureService.getById(id);
    }
}
