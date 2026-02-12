import React, { createContext } from "react"


export const TitleContext = createContext<{
    title:string,
    setTitle: React.Dispatch<React.SetStateAction<string>>,
    step:number,
    setStep: React.Dispatch<React.SetStateAction<number>>
} | null>(null)