import { useEffect, useRef } from "react"
import { logger } from "../logger"

export default function useRenderLog(componentName, propsToTrack = {}) {
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