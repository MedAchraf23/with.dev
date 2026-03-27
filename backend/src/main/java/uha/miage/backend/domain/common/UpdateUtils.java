package uha.miage.backend.domain.common;

import java.util.function.Consumer;

public class UpdateUtils {
    
    public static <T> void setIfNotNull(T value, Consumer<T> setter) {
        if (value != null) {
            setter.accept(value);
        }
    }
}