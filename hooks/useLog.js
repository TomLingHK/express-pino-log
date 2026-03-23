import { useCallback, useEffect, useRef } from "react";
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

function useApiLog(componentName) {
    const logApi = useCallback((apiName, method, returnData, additionalData = {}) => {
        logger.info(
            `[API Log] API_name: ${apiName} Method: ${method} Data: ${JSON.stringify(returnData)}`,
            {
                apiName: apiName,
                method: method,
                context: componentName,
                returnData,
                ...additionalData,
                timestamp: new Date().toISOString(),
            }
        )
    }, [componentName])

    return logApi;
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

function useInputLog(componentName) {
    const logInput = useCallback((inputId, newValue, additionalData = {}) => {
        logger.info(
            `[Input Log] Input: ${inputId} Value: ${newValue}`,
            {
                event: 'input_change',
                context: componentName,
                inputId,
                newValue,
                ...additionalData,
                timestamp: new Date().toISOString,
            }
        );
    }, [componentName])

    return logInput;
}

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

function useRenderLog(componentName, route='/', propsToTrack = {}) {
    const renderCount = useRef(0);
    renderCount.current = (renderCount.current || 0) + 1;

    useEffect(() => {
        const isRecording = propsToTrack && propsToTrack.recording;
        if (isRecording) {
            logger.info(
                // `[Render Log] ${componentName} Render (${route}) count: ${renderCount.current}`,
                `[Render Log] ${componentName} Render (${route})`,
                { props: propsToTrack, timestamp: new Date().toISOString() }
            );
        }

        // return () => {
        //     if (isRecording) {
        //         logger.info(
        //             `[Unmount Log] ${componentName}`,
        //             { props: propsToTrack, timestamp: new Date().toISOString() }
        //         );
        //     }
        // };
    }, [route, JSON.stringify(propsToTrack)]);
}

export { useActionLog, useApiLog, useButtonLog, useInputLog, useErrorLog, useRenderLog };