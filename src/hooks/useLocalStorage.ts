import { useEffect, useRef, useState } from 'react';
import { ZodSchema } from 'zod';

const isBrowser = typeof window !== 'undefined';

// Generic type for schema validation result
interface ValidationResult<T> {
    success: boolean;
    data?: T;
    error?: string;
}

// Safe parse function that works with or without Zod schema
const safeParseWithSchema = <T,>(
    value: unknown,
    schema?: ZodSchema<T>
): ValidationResult<T> => {
    if (!schema) {
        // No schema provided, just return the value as-is
        return { success: true, data: value as T };
    }

    try {
        const result = schema.safeParse(value);
        if (result.success) {
            return { success: true, data: result.data };
        } else {
            return {
                success: false,
                error: result.error.errors.map(e => e.message).join(', ')
            };
        }
    } catch (e) {
        return { success: false, error: String(e) };
    }
};

const readStorageValue = <T,>(
    key: string,
    initialValue: T | (() => T),
    schema?: ZodSchema<T>
): T => {
    if (!isBrowser) {
        return typeof initialValue === 'function'
            ? (initialValue as () => T)()
            : initialValue;
    }

    try {
        const item = window.localStorage.getItem(key);
        if (item !== null) {
            const parsed = JSON.parse(item);

            // Validate with schema if provided
            const validation = safeParseWithSchema(parsed, schema);

            if (validation.success && validation.data !== undefined) {
                return validation.data;
            }

            // If validation fails, log warning and return initial value
            console.warn(
                `useLocalStorage: Data validation failed for key "${key}". ` +
                `Error: ${validation.error}. Using fallback value.`
            );

            // Optionally clear corrupted data
            // window.localStorage.removeItem(key);
        }
    } catch (error) {
        console.warn(`useLocalStorage: failed to parse value for key "${key}"`, error);
    }

    return typeof initialValue === 'function'
        ? (initialValue as () => T)()
        : initialValue;
};

// Overloaded function signatures
export function useLocalStorage<T>(
    key: string,
    initialValue: T | (() => T)
): readonly [T, React.Dispatch<React.SetStateAction<T>>];

export function useLocalStorage<T>(
    key: string,
    initialValue: T | (() => T),
    schema: ZodSchema<T>
): readonly [T, React.Dispatch<React.SetStateAction<T>>];

export function useLocalStorage<T>(
    key: string,
    initialValue: T | (() => T),
    schema?: ZodSchema<T>
) {
    const [value, setValue] = useState<T>(() => readStorageValue(key, initialValue, schema));
    const previousKeyRef = useRef(key);
    const schemaRef = useRef(schema);

    useEffect(() => {
        if (previousKeyRef.current !== key) {
            previousKeyRef.current = key;
            schemaRef.current = schema;
            setValue(readStorageValue(key, initialValue, schema));
        }
    }, [initialValue, key, schema]);

    useEffect(() => {
        if (!isBrowser) return;

        const handler = setTimeout(() => {
            try {
                // Validate before saving if schema is provided
                if (schemaRef.current) {
                    const validation = safeParseWithSchema(value, schemaRef.current);
                    if (!validation.success) {
                        console.warn(
                            `useLocalStorage: Attempted to save invalid data for key "${key}". ` +
                            `Error: ${validation.error}. Skipping save.`
                        );
                        return;
                    }
                }

                const serialized = JSON.stringify(value);
                const currentValue = window.localStorage.getItem(key);

                if (currentValue !== serialized) {
                    window.localStorage.setItem(key, serialized);
                }
            } catch (error) {
                if (error instanceof DOMException && error.name === 'QuotaExceededError') {
                    console.error(`useLocalStorage: Storage quota exceeded for key "${key}"`);

                    // Emit a toast event to notify the user
                    const event = new CustomEvent('toast', {
                        detail: {
                            message: 'Storage quota exceeded. Some data may not be saved.',
                            type: 'error'
                        }
                    });
                    window.dispatchEvent(event);
                } else {
                    console.warn(`useLocalStorage: failed to write value for key "${key}"`, error);
                }
            }
        }, 500);

        return () => clearTimeout(handler);
    }, [key, value]);

    return [value, setValue] as const;
}
