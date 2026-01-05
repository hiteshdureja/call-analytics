import { useEffect, useRef } from 'react';
import * as echarts from 'echarts';

export interface ChartDataItem {
    name: string;
    value: number;
}

export interface HierarchicalChartData {
    innerRing: ChartDataItem[];
    outerRing: ChartDataItem[];
}

interface Props {
    data?: HierarchicalChartData;
}

const getDefaultData = (): HierarchicalChartData => ({
    innerRing: [
        { name: 'Language Issues', value: 75 },
        { name: 'Hostility Issues', value: 25 },
    ],
    outerRing: [
        { name: 'Assistant did not speak French', value: 20 },
        { name: 'Unsupported Language', value: 35 },
        { name: 'Assistant did not speak Spanish', value: 20 },
        { name: 'Verbal Aggression', value: 15 },
        { name: 'Customer Hostility', value: 10 },
        { name: 'User refused to confirm identity', value: 12 },
        { name: 'Caller Identification', value: 10 },
        { name: 'Incorrect caller identity', value: 8 },
    ],
});

const SadPathChart = ({ data }: Props) => {
    const chartRef = useRef<HTMLDivElement>(null);
    const chartInstanceRef = useRef<echarts.ECharts | null>(null);

    useEffect(() => {
        if (!chartRef.current || chartInstanceRef.current) return;

        chartInstanceRef.current = echarts.init(chartRef.current);

        const handleResize = () => {
            chartInstanceRef.current?.resize();
        };
        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    useEffect(() => {
        if (!chartInstanceRef.current) return;

        const chartData = data || getDefaultData();

        const innerData = chartData.innerRing.map((item, index) => ({
            value: item.value,
            name: item.name,
            itemStyle: {
                color: index === 0 ? '#6366f1' : '#14b8a6',
            },
        }));

        const outerData = chartData.outerRing.map((item, index) => {
            const colors = [
                '#4338ca', '#4f46e5', '#6366f1', '#818cf8',
                '#0f766e', '#0d9488', '#14b8a6', '#2dd4bf'
            ];
            return {
                value: item.value,
                name: item.name,
                itemStyle: {
                    color: colors[index % colors.length],
                },
            };
        });

        const option: echarts.EChartsOption = {
            backgroundColor: 'transparent',
            tooltip: {
                trigger: 'item',
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                borderColor: 'transparent',
                extraCssText: 'box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1); border-radius: 8px;',
                textStyle: {
                    color: '#1f2937',
                },
            },
            legend: {
                orient: 'vertical',
                right: 0,
                top: 'center',
                textStyle: {
                    color: '#4b5563',
                    fontSize: 12,
                    fontFamily: 'Inter, sans-serif'
                },
                formatter: (name: string) => {
                    const item = [...chartData.innerRing, ...chartData.outerRing].find((d) => d.name === name);
                    return `${name}: ${item?.value || 0}`;
                },
            },
            series: [
                {
                    name: 'Inner Ring',
                    type: 'pie',
                    radius: ['40%', '60%'],
                    center: ['35%', '50%'],
                    avoidLabelOverlap: false,
                    itemStyle: {
                        borderRadius: 4,
                        borderColor: '#ffffff',
                        borderWidth: 2,
                    },
                    label: {
                        show: false,
                    },
                    emphasis: {
                        label: {
                            show: true,
                            fontSize: 14,
                            fontWeight: 'bold',
                            color: '#1f2937',
                        },
                    },
                    labelLine: {
                        show: false,
                    },
                    data: innerData,
                },
                {
                    name: 'Outer Ring',
                    type: 'pie',
                    radius: ['65%', '85%'],
                    center: ['35%', '50%'],
                    avoidLabelOverlap: false,
                    itemStyle: {
                        borderRadius: 4,
                        borderColor: '#ffffff',
                        borderWidth: 2,
                    },
                    label: {
                        show: true,
                        position: 'outside',
                        formatter: '{b}',
                        fontSize: 11,
                        color: '#4b5563',
                        fontFamily: 'Inter, sans-serif'
                    },
                    labelLine: {
                        show: true,
                        length: 15,
                        length2: 10,
                        lineStyle: {
                            color: '#9ca3af',
                        },
                    },
                    emphasis: {
                        label: {
                            show: true,
                            fontSize: 12,
                            fontWeight: 'bold',
                            color: '#1f2937',
                        },
                    },
                    data: outerData,
                },
            ],
        };

        chartInstanceRef.current.setOption(option);
    }, [data]);

    useEffect(() => {
        return () => {
            if (chartInstanceRef.current) {
                chartInstanceRef.current.dispose();
                chartInstanceRef.current = null;
            }
        };
    }, []);

    return (
        <div className="p-6 bg-white/60 backdrop-blur-lg border border-white/30 rounded-2xl shadow-md h-full">
            <h2 className="text-lg font-bold mb-4 text-gray-900">Sad Path Analysis</h2>
            <div ref={chartRef} style={{ width: '100%', height: '400px' }} />
        </div>
    );
};

export default SadPathChart;
