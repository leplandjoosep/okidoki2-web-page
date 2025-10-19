package com.example.okidoki.service;

import com.example.okidoki.dto.SunSetData;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
@Slf4j
@RequiredArgsConstructor
public class SunService {

    private static final String SUNSET_DATA_URL = "https://api.sunrisesunset.io/json?lat=59.436962&lng=24.753574";


    public SunSetData getSunsetData() {
        log.debug("Getting Sunset info from {}", SUNSET_DATA_URL);
        return (new RestTemplate()).getForObject(SUNSET_DATA_URL, SunSetData.class);
    }
}
