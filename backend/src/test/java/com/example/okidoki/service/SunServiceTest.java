package com.example.okidoki.service;

import com.example.okidoki.dto.SunSetData;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.web.client.RestTemplate;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class SunServiceTest {

    private static final String SUNSET_DATA_URL = "https://api.sunrisesunset.io/json?lat=59.436962&lng=24.753574";

    @Mock
    private RestTemplate restTemplate;

    @InjectMocks
    private SunService sunService;

    @Test
    void getSunsetData() {
        // Given
        SunSetData expectedSunSetData = new SunSetData();
        expectedSunSetData.setStatus("OK");
        lenient().when(restTemplate.getForObject(SUNSET_DATA_URL, SunSetData.class))
                .thenReturn(expectedSunSetData);

        // When
        SunSetData result = sunService.getSunsetData();

        // Then
        assertNotNull(result, "The result should not be null");
        assertNotNull(result.getResults(), "The Result should not be null");
        assertEquals("OK", result.getStatus());

    }
}
