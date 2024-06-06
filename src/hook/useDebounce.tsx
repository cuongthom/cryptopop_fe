import React, { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom';

function useDebounce(value: any, delay :any) {
    const [debouncedValue, setDebouncedValue] = useState<any>()
    
    useEffect(() => {
        if(!isNaN(value))return
        
        const id = setTimeout(() => {
            console.log("setting new timeout");
            setDebouncedValue(value)
        }, delay)
        return () => {
            console.log("clear time out");
            clearTimeout(id)
        }
    }, [value, delay])
    
    return debouncedValue
}

export default useDebounce