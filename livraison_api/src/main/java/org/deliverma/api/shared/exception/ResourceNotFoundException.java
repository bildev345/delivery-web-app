package org.deliverma.api.shared.exception;


public class ResourceNotFoundException extends RuntimeException{
    public ResourceNotFoundException(String resource, Object id){
        super(resource + " avec l'id " + id + " est introuvable");
    }
    public ResourceNotFoundException(String message){
        super(message);
    }
    
}
