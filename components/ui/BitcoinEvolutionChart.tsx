import { BitcoinEvolutionChartProps, ChartDataPoint } from '@/utils/type';
import React from 'react';
import { View, Text, Dimensions } from 'react-native';
import { LineChart } from 'react-native-gifted-charts';

// Type pour les données du graphique

// Données du graphique (à remplacer par des données dynamiques)
const mockChartData: ChartDataPoint[] = [
    { value: 50, date: '1 Jan' },
    { value: 500, date: '2 Jan' },
    { value: 600, date: '3 Jan' },
    { value: 1000, date: '4 Jan' },
    { value: 1050, date: '5 Jan' },
    { value: 1000, date: '6 Jan' },
    { value: 3900, date: '7 Jan' },
];

const BitcoinEvolutionChart: React.FC<BitcoinEvolutionChartProps> = ({
    data = mockChartData,
    title = "Bitcoin",
    devise = "EUR",
    deviseSymbol = "Ar"
}) => {
    // On définit une marge globale de 32 (16px de chaque côté)
    const containerMargin = 32;
    const screenWidth = Dimensions.get("window").width - containerMargin;

    const firstValue = data[0].value;
    const lastValue = data[data.length - 1].value;
    const variation = ((lastValue - firstValue) / firstValue * 100).toFixed(2);
    const isPositive = parseFloat(variation) >= 0;

    const formatCurrency = (value: number) => {
        return `${value.toLocaleString()} ${deviseSymbol}`;
    };

    const formatDate = (date: any): string => {
        console.log(date);

        if (!date) return "";

        try {
            // 🔹 Si l'objet contient `seconds` et `nanoseconds`, c'est un Firestore Timestamp
            if (typeof date === "object" && "seconds" in date && "nanoseconds" in date) {
                return new Date(date.seconds * 1000).toLocaleDateString();
            }

            // 🔹 Si c'est déjà une chaîne, on la retourne directement
            if (typeof date === "string") return date;

            // 🔹 Si c'est un objet Date, on le formate
            if (date instanceof Date) {
                return date.toLocaleDateString();
            }

            // ❌ Si le format est inconnu, retourne une chaîne vide pour éviter l'erreur
            return "";
        } catch (error) {
            console.error("Erreur de formatage de date :", error);
            return "";
        }
    };



    return (
        <View>
            {/* En-tête */}
            <View className="flex-row items-center justify-between mb-4">
                <Text className="text-xl text-gray-800">
                    <Text className="font-bold">Crypto : </Text>{title}
                </Text>
                <View className="flex-row items-center">
                    <Text className={`text-sm font-medium ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
                        {isPositive ? '+' : ''}{variation}%
                    </Text>
                </View>
            </View>

            {/* Graphique */}
            <LineChart
                data={data.map(item => ({
                    value: item.value,
                    label: formatDate(item.date),  // ✅ Transformation ici
                    dataPointText: formatCurrency(item.value)
                }))}


                areaChart1

                width={screenWidth} // Utilise toute la largeur calculée
                height={Math.min(200, Dimensions.get("window").height * 0.4)}
                curved
                isAnimated
                animationDuration={1500}
                thickness={2}
                hideDataPoints={false}
                // Couleurs et remplissage
                color="#3b82f6"
                startFillColor="rgba(59, 130, 246, 0.2)"
                endFillColor="rgba(59, 130, 246, 0.01)"
                startOpacity={0.9}
                endOpacity={0.2}
                // Axes et texte
                yAxisColor="#e5e7eb"
                xAxisColor="#e5e7eb"
                yAxisTextStyle={{ color: '#6b7280', fontSize: 12 }}
                xAxisLabelTextStyle={{ color: '#6b7280', fontSize: 10 }}
                // Points de données
                dataPointsColor="#3b82f6"
                dataPointsRadius={5}

                // Lignes de grille
                showVerticalLines
                verticalLinesColor="rgba(229, 231, 235, 0.5)"
                verticalLinesThickness={1}
                showHorizontalLines
                horizontalLinesColor="rgba(229, 231, 235, 0.5)"
                // Configuration du graphique
                spacing={50}
                yAxisOffset={40}
                noOfSections={6}
                // Règles et indices
                hideRules={false}
                rulesType="solid"
                rulesColor="rgba(229, 231, 235, 0.8)"
                showYAxisIndices
                yAxisIndicesColor="#e5e7eb"
                yAxisIndicesWidth={1}
            />

            {/* Informations complémentaires */}
            <View className="flex-row justify-between mt-4">
                <View className="items-end">
                    <Text className="text-xs text-gray-500">Début période</Text>
                    <Text className="text-base font-bold text-gray-800">
                        €{formatCurrency(firstValue)}
                    </Text>
                </View>
                <View>
                    <Text className="text-xs text-gray-500">Cours actuel</Text>
                    <Text className="text-base font-bold text-gray-800">
                        €{formatCurrency(lastValue)}
                    </Text>
                </View>
            </View>
        </View>
    );
};

export default BitcoinEvolutionChart;
