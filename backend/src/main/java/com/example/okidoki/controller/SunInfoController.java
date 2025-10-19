package com.example.okidoki.controller;

import com.example.okidoki.dto.SunSetData;
import com.example.okidoki.dto.SunSetInfoDTO;
import com.example.okidoki.service.SunService;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RequestMapping("api")
@AllArgsConstructor
@RestController
public class SunInfoController {
    private SunService sunservice;

    @GetMapping("/public/sunset")
    public ResponseEntity<SunSetInfoDTO> getSunsetInfo() {
        SunSetData sunsetData = sunservice.getSunsetData();
        return ResponseEntity.ok(new SunSetInfoDTO(sunsetData.getResults().getSunset(),
                sunsetData.getResults().getSunrise(),
                sunsetData.getResults().getTimezone()));
    }


}
