package com.apiLibrary.apiLibrary.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserInfoDto {
    private Long id;
    private String fullName;
    private String email;
    private List<String> roles;
}
