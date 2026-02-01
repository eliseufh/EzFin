"use client";

import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from "recharts";
import { PieChart as PieIcon } from "lucide-react"; // Importamos o ícone oficial
import { useTranslations } from "@/i18n/use-translations";

interface DataItem {
  name: string;
  value: number;
}

interface PieLabelProps {
  cx: number;
  cy: number;
  midAngle: number;
  innerRadius: number;
  outerRadius: number;
  percent: number;
}

const COLORS = [
  "#10b981",
  "#3b82f6",
  "#f59e0b",
  "#ef4444",
  "#8b5cf6",
  "#ec4899",
];

export function CategoryChart({ data }: { data: DataItem[] }) {
  const { t } = useTranslations();

  if (data.length === 0) {
    return (
      <div className="h-[300px] flex flex-col items-center justify-center text-slate-500 gap-3">
        {/* Ícone estilizado em vez do emoji */}
        <div className="h-16 w-16 bg-slate-50 rounded-full flex items-center justify-center border border-slate-100 shadow-sm">
          <PieIcon className="h-8 w-8 text-slate-300" />
        </div>
        <div className="text-center">
          <p className="text-sm font-medium text-slate-600">
            {t("dashboard.categoryChart.noData")}
          </p>
          <p className="text-[11px] text-slate-400">
            {t("dashboard.categoryChart.noDataDescription")}
          </p>
        </div>
      </div>
    );
  }

  const renderCustomizedLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    percent,
  }: PieLabelProps) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * (Math.PI / 180));
    const y = cy + radius * Math.sin(-midAngle * (Math.PI / 180));

    return (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor="middle"
        dominantBaseline="central"
        className="text-[10px] font-bold"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  return (
    <div className="h-[350px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={renderCustomizedLabel}
            outerRadius={100}
            dataKey="value"
          >
            {data.map((_, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
                stroke="white"
                strokeWidth={2}
              />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              borderRadius: "8px",
              border: "none",
              boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
            }}
            formatter={(value: number) => `€ ${value.toFixed(2)}`}
          />
          <Legend
            iconType="circle"
            layout="horizontal"
            verticalAlign="bottom"
            align="center"
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
