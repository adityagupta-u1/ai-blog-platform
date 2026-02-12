
'use client'

import { motion } from "motion/react";
import { useRouter } from "next/navigation";
import React from 'react';
import { CardContent, CardDashboard } from "./cardDashboard";

export default function AnimatedCardComponent({title,value}: {title: string,value:number | string}) {
  const Ref = React.useRef<HTMLDivElement>(null);
  const router = useRouter()
  return (
    <motion.div className="h-full" whileHover={{ scale: 1.02 }} onClick={() => router.push(`/dashboard/${title}`)} >
    <CardDashboard className="rounded-2xl shadow-md h-full" ref={Ref} > 
      <CardContent className="p-6" >
        <h2 className="text-xl font-semibold mb-2 capitalize cursor-pointer">{title}</h2>
        <p className="text-3xl font-bold">{value}</p>
      </CardContent>
    </CardDashboard>
  </motion.div>
  )
}
