import { Chart, useChart } from "@chakra-ui/charts";
import { Bar, BarChart, XAxis, YAxis, CartesianGrid } from "recharts";

import { Box } from "@chakra-ui/react";

export default function GraphPlaceholder(props) {
    const { data } = props;
    const chart = useChart({
        data: data.map((sesh) => {
            if (sesh.date) {
                return {
                    ...sesh,
                    date: sesh.date.slice(0, 10),
                };
            } else {
                return sesh;
            }
        }),
        series: [{ name: "climbs", color: "#764d2f" }],
    });

    return (
        <Box>
            <Chart.Root chart={chart} bg="rgba(255, 255, 255, 0.5)">
                <BarChart data={chart.data} margin={{ top: 45, right: 55 }}>
                    <CartesianGrid stroke="#482307" vertical={false} />
                    <XAxis axisLine={false} tickLine={false} dataKey={chart.key("date")} />
                    <YAxis axisLine={false} tickLine={false} domain={[0, 30]} />
                    {chart.series.map((item) => (
                        <Bar
                            key={item.name}
                            isAnimationActive={false}
                            dataKey={chart.key(item.name)}
                            fill={chart.color(item.color)}
                        />
                    ))}
                </BarChart>
            </Chart.Root>
        </Box>
    );
}
