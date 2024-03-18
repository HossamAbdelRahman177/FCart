import { useEffect, useState } from "react";

export default function useLocalStorage(key, intialValue) {
    const [value, setValue] = useState(() => {
        const data = localStorage.getItem(key)

        if (data) return JSON.parse(data)

        if (typeof intialValue === 'function') return intialValue()

        return intialValue
    })

    useEffect(() => {
        localStorage.setItem(key, JSON.stringify(value))
    }, [key, value])

    return [value, setValue]
}