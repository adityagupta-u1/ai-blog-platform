"use client";

import {
    CartesianGrid,
    Line,
    LineChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
} from "recharts";

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";


export function ViewsChart({data}:{data:{date:string,count:number}[]}) {

    return (
        <Card>
        <CardHeader>
            <CardTitle>Views (Last 30 Days)</CardTitle>
            <CardDescription>
            Daily traffic overview
            </CardDescription>
        </CardHeader>

        <CardContent>
            <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                    dataKey="date"
                    tickFormatter={(value) =>
                    new Date(value).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                    })
                    }
                />
                <Tooltip />
                <Line
                    type="monotone"
                    dataKey="count"
                    stroke="#6366f1"
                    strokeWidth={2}
                    dot={false}
                />
                </LineChart>
            </ResponsiveContainer>
            </div>
        </CardContent>
        </Card>
    );
}