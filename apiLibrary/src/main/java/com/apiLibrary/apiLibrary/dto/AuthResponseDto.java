package com.apiLibrary.apiLibrary.dto;

// import com.apiLibrary.apiLibrary.model.User; // No longer directly needed
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AuthResponseDto {
    private String message;
    private UserInfoDto userInfo; // Changed from User to UserInfoDto
    private String token;
}
