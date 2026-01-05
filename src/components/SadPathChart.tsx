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
                color: index === 0 ? '#855CF1' : '#41E5E4', // Accent : Highlight
            },
        }));

        const outerData = chartData.outerRing.map((item, index) => {
            const colors = [
                '#6644C4', '#855CF1', '#A78BFA', // Purples
                '#115E59', '#14B8A6', '#41E5E4'  // Teals
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
                backgroundColor: '#1C1C28',
                borderColor: '#2C2C3F',
                extraCssText: 'box-shadow: 0 10px 30px -5px rgba(0, 0, 0, 0.5); border-radius: 16px;',
                textStyle: {
                    color: '#FFF',
                    fontFamily: 'Outfit, sans-serif'
                },
            },
            legend: {
                type: 'scroll',
                orient: 'vertical',
                right: 0,
                top: 'middle',
                align: 'left',
                itemGap: 10,
                pageIconColor: '#9ca3af',
                pageIconInactiveColor: '#4b5563',
                pageTextStyle: {
                    color: '#9ca3af',
                    fontFamily: 'Outfit, sans-serif'
                },
                textStyle: {
                    color: '#9ca3af',
                    fontSize: 13,
                    fontFamily: 'Outfit, sans-serif'
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
                    radius: ['45%', '60%'],
                    center: ['35%', '50%'],
                    avoidLabelOverlap: false,
                    itemStyle: {
                        borderRadius: 8,
                        borderColor: '#222230',
                        borderWidth: 3,
                    },
                    label: {
                        show: false,
                    },
                    emphasis: {
                        label: {
                            show: true,
                            fontSize: 16,
                            fontWeight: 'bold',
                            color: '#FFF',
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
                    radius: ['65%', '80%'],
                    center: ['35%', '50%'],
                    avoidLabelOverlap: false,
                    itemStyle: {
                        borderRadius: 8,
                        borderColor: '#222230',
                        borderWidth: 3,
                    },
                    label: {
                        show: true,
                        position: 'outside',
                        formatter: '{b}',
                        fontSize: 12,
                        color: '#9ca3af',
                        fontFamily: 'Outfit, sans-serif'
                    },
                    labelLine: {
                        show: true,
                        length: 20,
                        length2: 15,
                        lineStyle: {
                            color: '#4b5563',
                        },
                    },
                    emphasis: {
                        label: {
                            show: true,
                            fontSize: 13,
                            fontWeight: 'bold',
                            color: '#FFF',
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
        <div className="p-8 bg-card border border-[#2C2C3F] rounded-5xl shadow-xl h-full w-full">
            <h2 className="text-2xl font-bold mb-6 text-white">Sad Path Analysis</h2>
            <div ref={chartRef} className="w-full h-[450px]" />
        </div>
    );
};

export default SadPathChart;
