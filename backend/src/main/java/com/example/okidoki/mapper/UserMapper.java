package com.example.okidoki.mapper;

import com.example.okidoki.dto.UserDto;
import com.example.okidoki.entity.AppUser;
import org.mapstruct.Mapper;

import org.mapstruct.ReportingPolicy;
import org.springframework.stereotype.Component;

import java.util.List;
@Component
@Mapper(componentModel =  "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface UserMapper {
    UserDto toDto(AppUser user);

    List<UserDto> toDtoList(List<AppUser> user);

}
