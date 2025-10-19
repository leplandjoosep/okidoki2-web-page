package com.example.okidoki.dto;

import lombok.Data;

@Data
public class Results {
    private String date;
    private String sunrise;
    private String sunset;
    private String firstLight;
    private String lastLight;
    private String dawn;
    private String dusk;
    private String solarNoon;
    private String goldenHour;
    private String dayLength;
    private String timezone;
    private int utcOffset;

}
