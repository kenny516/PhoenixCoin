import React, { useState } from 'react';
import { View, Text, Dimensions } from 'react-native';
import { LineChart } from 'react-native-gifted-charts';
import { BitcoinEvolutionChartProps, ChartDataPoint } from '@/utils/type';

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

const HEADER_HEIGHT = 50; // Hauteur réservée pour l'en-tête (modifiable)
const INFO_HEIGHT = 50;   // Hauteur réservée pour la section d'informations complémentaires (modifiable)
const CONTAINER_MARGIN = 32; // Marge totale (ex : 16 de chaque côté)

const BitcoinEvolutionChart: React.FC<BitcoinEvolutionChartProps> = ({
    data = mockChartData,
    title = "Bitcoin",
    deviseSymbol = "Ar"
}) => {
    // States pour récupérer la largeur et la hauteur du conteneur parent
    const [containerWidth, setContainerWidth] = useState<number>(0);
    const [containerHeight, setContainerHeight] = useState<number>(0);

    // Détermine la largeur du graphique en soustrayant une marge du conteneur
    const chartWidth = containerWidth ? containerWidth - CONTAINER_MARGIN : Dimensions.get("window").width - CONTAINER_MARGIN;

    // Le graphique occupe la hauteur restante après avoir retiré l'en-tête et la zone d'infos.
    // On impose également une hauteur minimale pour le graphique.
    const calculatedChartHeight = containerHeight ? containerHeight - HEADER_HEIGHT - INFO_HEIGHT - 20 : Math.min(200, Dimensions.get("window").height * 0.2);
    const chartHeight = calculatedChartHeight > 100 ? calculatedChartHeight : 100; // hauteur minimale de 100

    const firstValue = data[0].value;
    const lastValue = data[data.length - 1].value;
    const variation = ((lastValue - firstValue) / firstValue * 100).toFixed(2);
    const isPositive = parseFloat(variation) >= 0;

    const formatCurrency = (value: number) => {
        return `${value.toLocaleString()} ${deviseSymbol}`;
    };

    const formatDate = (date: any): string => {
        if (!date) return "";

        try {
            // Si l'objet contient `seconds` et `nanoseconds`, c'est un Firestore Timestamp
            if (typeof date === "object" && "seconds" in date && "nanoseconds" in date) {
                return new Date(date.seconds * 1000).toLocaleDateString();
            }
            // Si c'est déjà une chaîne, on la retourne directement
            if (typeof date === "string") return date;
            // Si c'est un objet Date, on le formate
            if (date instanceof Date) {
                return date.toLocaleDateString();
            }
            return "";
        } catch (error) {
            console.error("Erreur de formatage de date :", error);
            return "";
        }
    };

    return (
        // Le conteneur principal récupère sa taille via onLayout
        <View
            style={{ flex: 1 }}
            onLayout={({ nativeEvent }) => {
                setContainerWidth(nativeEvent.layout.width);
                setContainerHeight(nativeEvent.layout.height);
            }}
        >
            {/* En-tête */}
            <View
                style={{
                    height: HEADER_HEIGHT,
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: 8,
                }}
            >
                <Text style={{ fontSize: 20, color: '#1F2937', fontWeight: 'bold' }}>
                    Crypto : <Text style={{ fontWeight: 'normal' }}>{title}</Text>
                </Text>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Text style={{ fontSize: 14, fontWeight: '500', color: isPositive ? '#10B981' : '#EF4444' }}>
                        {isPositive ? '+' : ''}{variation}%
                    </Text>
                </View>
            </View>

            {/* Graphique */}
            <LineChart
                data={data.map(item => ({
                    value: item.value,
                    label: formatDate(item.date),
                    dataPointText: formatCurrency(item.value)
                }))}
                areaChart1
                width={chartWidth}
                height={chartHeight}
                curved
                isAnimated
                animationDuration={1500}
                thickness={2}
                hideDataPoints={false}

                maxValue={50000}
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
        </View>
    );
};

export default BitcoinEvolutionChart;
