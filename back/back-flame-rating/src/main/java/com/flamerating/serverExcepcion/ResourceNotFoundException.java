package com.flamerating.serverException;


public class ResourceNotFoundException extends RuntimeException {
    private String messsage;

    public ResourceNotFoundException(String messsage) {
        super(messsage);
        this.messsage = messsage;
    }
    
}


