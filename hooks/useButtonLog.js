import { useCallback } from 'react';
import { logger } from "../logger";

export default function useButtonLog(componentName) {
    const logClick = useCallback((buttonId, additionalData = {}) => {
        logger.info({
            event: 'button_click',
            context: componentName,
            buttonId,
            ...additionalData,
            timestamp: new Date().toISOString(),
        }, `Button click: ${buttonId} (from ${componentName})`);
    }, [componentName]);

    return logClick;
};
