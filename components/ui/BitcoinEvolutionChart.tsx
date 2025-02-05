import React from 'react';
import { View, Text, Dimensions } from 'react-native';
import { LineChart, LineChartBicolor } from 'react-native-gifted-charts';

// Type pour les données du graphique
interface ChartDataPoint {
    value: number;
    date: string;
}

// Données du graphique (à remplacer par des données dynamiques)
const mockChartData: ChartDataPoint[] = [
    { value: 50, date: '1 Jan' },
    { value: 500, date: '2 Jan' },
    { value: 39000, date: '3 Jan' },
    { value: 38500, date: '4 Jan' },
    { value: 40000, date: '5 Jan' },
    { value: 39500, date: '6 Jan' },
    { value: 39000, date: '7 Jan' },
];

const BitcoinEvolutionChart: React.FC = () => {
    const screenWidth = Dimensions.get("window").width - 32; // Largeur avec marges

    // Calculer la variation et la tendance
    const firstValue = mockChartData[0].value;
    const lastValue = mockChartData[mockChartData.length - 1].value;
    const variation = ((lastValue - firstValue) / firstValue * 100).toFixed(2);
    const isPositive = parseFloat(variation) >= 0;

    return (
        <View className="w-full p-4 bg-white shadow-md rounded-xl">
            <View className="flex-row items-center justify-between mb-2">
                <Text className="text-lg font-semibold text-gray-800">
                    Évolution du Bitcoin (7j)
                </Text>
                <View className="flex-row items-center">
                    <Text
                        className={`font-semibold ${isPositive ? 'text-green-600' : 'text-red-600'
                            }`}
                    >
                        {isPositive ? '+' : ''}{variation}%
                    </Text>
                </View>
            </View>

            <LineChart
                data={mockChartData.map(item => ({
                    value: item.value,
                    label: item.date,
                    dataPointText: `€${item.value}`
                }))}
                width={screenWidth - 32}
                height={180}

                // Style amélioré du graphique

                isAnimated
                animationDuration={1500}
                thickness={2}
                hideDataPoints={false}

                // Couleurs et style
                color="#3b82f6"
                startFillColor="rgba(59, 130, 246, 0.2)"
                endFillColor="rgba(59, 130, 246, 0.01)"
                startOpacity={0.9}
                endOpacity={0.2}

                // Axes et grille
                yAxisColor="#e5e7eb"
                xAxisColor="#e5e7eb"
                yAxisTextStyle={{ color: '#6b7280', fontSize: 12 }}
                xAxisLabelTextStyle={{ color: '#6b7280', fontSize: 10 }}

                // Points de données
                dataPointsColor="#3b82f6"
                dataPointsRadius={5}
                showDataPointOnPress

                // Lignes de grille
                showVerticalLines
                verticalLinesColor="rgba(229, 231, 235, 0.5)"
                verticalLinesThickness={1}
                showHorizontalLines
                horizontalLinesColor="rgba(229, 231, 235, 0.5)"

                // Configuration
                spacing={44}
                yAxisOffset={1000}
                noOfSections={6}
                maxValue={42000}

                // Personnalisation supplémentaire
                hideRules={false}
                rulesType="solid"
                rulesColor="rgba(229, 231, 235, 0.8)"
                showYAxisIndices
                yAxisIndicesColor="#e5e7eb"
                yAxisIndicesWidth={1}

            />

            <View className="flex-row justify-between mt-2">
                <View>
                    <Text className="text-xs text-gray-500">Cours actuel</Text>
                    <Text className="text-base font-semibold text-gray-800">
                        €{lastValue.toLocaleString()}
                    </Text>
                </View>
                <View className="items-end">
                    <Text className="text-xs text-gray-500">Début période</Text>
                    <Text className="text-base font-semibold text-gray-800">
                        €{firstValue.toLocaleString()}
                    </Text>
                </View>
            </View>
        </View>
    );
};

export default BitcoinEvolutionChart;