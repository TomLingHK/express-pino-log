import { useCallback } from "react";
import { logger } from "../logger"

export default function useActionLog(componentName) {
    const logAction = useCallback((actionName, additionalData = {}) => {
        logger.info(
            `[Action Log] ${actionName}`,
            {
                actionName: actionName,
                context: componentName,
                ...additionalData,
                timestamp: new Date().toISOString(),
            }
        );
    }, [componentName]);

    return logAction;
}