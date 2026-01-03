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

// Default data structure matching the requirements
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

    // Initialize chart once
    useEffect(() => {
        if (!chartRef.current || chartInstanceRef.current) return;

        chartInstanceRef.current = echarts.init(chartRef.current);

        // Handle resize
        const handleResize = () => {
            chartInstanceRef.current?.resize();
        };
        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    // Update chart when data changes
    useEffect(() => {
        if (!chartInstanceRef.current) return;

        const chartData = data || getDefaultData();

        // Prepare data for multi-ring donut chart
        // Inner ring data
        const innerData = chartData.innerRing.map((item, index) => ({
            value: item.value,
            name: item.name,
            itemStyle: {
                color: index === 0 ? '#60a5fa' : '#86efac', // Blue for Language, Green for Hostility
            },
        }));

        // Outer ring data
        const outerData = chartData.outerRing.map((item, index) => {
            // Distribute colors based on category
            const colors = ['#60a5fa', '#3b82f6', '#2563eb', '#86efac', '#4ade80', '#a5b4fc', '#818cf8', '#6366f1'];
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
                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                borderColor: '#333',
                textStyle: {
                    color: '#fff',
                },
            },
            legend: {
                orient: 'vertical',
                right: 10,
                top: 'center',
                textStyle: {
                    color: '#aaa',
                    fontSize: 12,
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
                    center: ['40%', '50%'],
                    avoidLabelOverlap: false,
                    itemStyle: {
                        borderRadius: 4,
                        borderColor: '#0d1117',
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
                            color: '#fff',
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
                    center: ['40%', '50%'],
                    avoidLabelOverlap: false,
                    itemStyle: {
                        borderRadius: 4,
                        borderColor: '#0d1117',
                        borderWidth: 2,
                    },
                    label: {
                        show: true,
                        position: 'outside',
                        formatter: '{b}',
                        fontSize: 11,
                        color: '#aaa',
                    },
                    labelLine: {
                        show: true,
                        length: 15,
                        length2: 10,
                        lineStyle: {
                            color: '#666',
                        },
                    },
                    emphasis: {
                        label: {
                            show: true,
                            fontSize: 12,
                            fontWeight: 'bold',
                            color: '#fff',
                        },
                    },
                    data: outerData,
                },
            ],
        };

        chartInstanceRef.current.setOption(option);
    }, [data]);

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            if (chartInstanceRef.current) {
                chartInstanceRef.current.dispose();
                chartInstanceRef.current = null;
            }
        };
    }, []);

    return (
        <div className="p-4 bg-white/5 rounded-2xl backdrop-blur-md shadow-lg">
            <h2 className="text-lg font-semibold mb-4 text-white">Sad Path Analysis</h2>
            <div ref={chartRef} style={{ width: '100%', height: '400px' }} />
        </div>
    );
};

export default SadPathChart;
