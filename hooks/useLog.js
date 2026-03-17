import { useCallback } from "react";
import { logger } from "../logger"

function useActionLog(componentName) {
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

function useButtonLog(componentName) {
    const logClick = useCallback((buttonId, additionalData = {}) => {
        logger.info(
            `[Button Log] Button click: ${buttonId} (from ${componentName})`,
            {
                event: 'button_click',
                context: componentName,
                buttonId,
                ...additionalData,
                timestamp: new Date().toISOString(),
            }
    );
    }, [componentName]);

    return logClick;
};

function useErrorLog(componentName) {
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

function useRenderLog(componentName, propsToTrack = {}) {
    const renderCount = useRef(0);

    useEffect(() => {
        logger.info(
            `[Render Log] ${componentName} Render count: ${renderCount.current}`,
            { props: propsToTrack }
            // { props: propsToTrack, timestamp: new Date().toISOString() }
        )

        return () => {
            logger.info(
                `[Unmount Log] ${componentName}`
            )
        }
    }, [])
}

export { useActionLog, useButtonLog, useErrorLog, useRenderLog };