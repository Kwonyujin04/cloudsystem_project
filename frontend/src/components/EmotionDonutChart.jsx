import { PieChart, Pie, Cell, Tooltip } from "recharts";

export default function EmotionDonutChart({ data }) {
    console.log("EmotionDonutChart → data:", data);

    if (!data || !Array.isArray(data)) {
        return <div>아직 기록된 감정이 없습니다.</div>;
    }

    const COLORS = ["#f8ec7eff", "#8ac3f6ff", "#f05d5dff", "#a0e0a6ff"];

    return (
        <PieChart width={300} height={300}>
            <defs>
                <filter id="shadow" x="-30%" y="-30%" width="200%" height="200%">
                    <feDropShadow dx="0" dy="0" stdDeviation="6" floodColor="#000" floodOpacity="0.3" />
                </filter>
            </defs>

            <Pie
                data={data}
                cx={150}
                cy={150}
                innerRadius={70}
                outerRadius={110}
                dataKey="value"
            >
                {data.map((entry, index) => (
                    <Cell
                        key={index}
                        fill={COLORS[index]}
                        filter="url(#shadow)"
                    />
                ))}
            </Pie>
            <Tooltip />
        </PieChart>
    );
}
