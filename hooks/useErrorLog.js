import { useCallback } from "react";
import { logger } from "../logger"

export default function useErrorLog(componentName) {
    const logError = useCallback((actionName, error, additionalData = {}) => {
        logger.error(
            `[Error Log] ${actionName}! Error: ${error}`,
            {
                context: componentName,
                ...additionalData,
                timestamp: new Date().toISOString(),
            }
        );
    }, [componentName]);

    return logError;
}