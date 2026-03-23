import { useEffect, useRef } from "react";
import { useInputLog } from "./useLog";


function useInputLogEffect(pageName, inputId, value, delay = 3000) {
    const logInput = useInputLog(pageName);

    const timerRef = useRef(null);
    const valueRef = useRef(value);

    // 1. 同步最新的值到 Ref，確保 Cleanup 能抓到最新狀態
    useEffect(() => {
        valueRef.current = value;
    }, [value]);

    // 2. 處理 Debounce (緩衝執行)
    useEffect(() => {
        if (timerRef.current) clearTimeout(timerRef.current);

        timerRef.current = setTimeout(() => {
            logInput(inputId, value);
            timerRef.current = null;
        }, delay);

        return () => {
            if (timerRef.current) clearTimeout(timerRef.current);
        }
    }, [value]);

    // 3. 專門處理「卸載時」的立即執行
    useEffect(() => {
        return () => {
            // 當組件真的要消失時，立刻執行最後一次
            if (timerRef.current) {
                clearTimeout(timerRef.current);
                logInput(inputId, valueRef.current);
            }
        };
    }, []); // 注意：空陣列確保只在 Unmount 時觸發
}

export default useInputLogEffect;