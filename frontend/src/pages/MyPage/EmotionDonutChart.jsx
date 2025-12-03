import { PieChart, Pie, Cell, Tooltip } from "recharts";

export default function EmotionDonutChart({ data }) {
    console.log("EmotionDonutChart → data:", data);

    if (!data || !Array.isArray(data)) {
        return <div>아직 기록된 감정이 없습니다.</div>;
    }

    const COLORS = ["#edb066", "#86b3d3", "#f4727d", "#a0e792"];

    return (
        <PieChart width={300} height={300}>
            <defs>
                <filter id="shadow" x="-30%" y="-30%" width="200%" height="200%">
                    <feDropShadow dx="0" dy="0" stdDeviation="6" floodColor="#000" floodOpacity="0.2" />
                </filter>
            </defs>
            <circle cx={150} cy={150} r={120} fill="#ffffffff" />

            <Pie
                data={data}
                cx={145}
                cy={145}
                innerRadius={70}
                outerRadius={110}
                dataKey="value"
                stroke="none"
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
