import React, { useState } from 'react';
import { View, Text, Dimensions } from 'react-native';
import { LineChart } from 'react-native-gifted-charts';
import { BitcoinEvolutionChartProps, ChartDataPoint } from '@/utils/type';
import { ColorProperties } from 'react-native-reanimated/lib/typescript/Colors';

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

const HEADER_HEIGHT = Dimensions.get('window').height * 0.06; // Hauteur adaptative
const INFO_HEIGHT = Dimensions.get('window').height * 0.06;
const CONTAINER_MARGIN = Dimensions.get('window').width * 0.04;

const BitcoinEvolutionChart: React.FC<BitcoinEvolutionChartProps> = ({
    data = mockChartData,
    title = "Bitcoin",
    deviseSymbol = "Ar"
}) => {
    // States pour récupérer la largeur et la hauteur du conteneur parent
    const [containerWidth, setContainerWidth] = useState<number>(0);
    const [containerHeight, setContainerHeight] = useState<number>(0);

    // Détermine la largeur du graphique en soustrayant une marge du conteneur
    const chartWidth = containerWidth ? containerWidth - CONTAINER_MARGIN : Dimensions.get("window").width * 0.92;

    // Le graphique occupe la hauteur restante après avoir retiré l'en-tête et la zone d'infos.
    // On impose également une hauteur minimale pour le graphique.
    const calculatedChartHeight = containerHeight
        ? containerHeight - HEADER_HEIGHT - INFO_HEIGHT
        : Dimensions.get("window").height * 0.3;
    const chartHeight = Math.max(calculatedChartHeight, Dimensions.get("window").height * 0.2);

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
            style={{
                flex: 1,
                padding: Dimensions.get('window').width * 0.02
            }}
            onLayout={({ nativeEvent }) => {
                setContainerWidth(nativeEvent.layout.width);
                setContainerHeight(nativeEvent.layout.height);
            }}
        >
            {/* En-tête */}
            <View style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: Dimensions.get('window').height * 0.01,
                paddingHorizontal: Dimensions.get('window').width * 0.02
            }}>
                <Text style={{
                    fontSize: Dimensions.get('window').width * 0.045,
                    color: '#1F2937',
                    fontWeight: 'bold'
                }}>
                    Crypto : <Text style={{ fontWeight: 'normal' }}>{title}</Text>
                </Text>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Text style={{
                        fontSize: Dimensions.get('window').width * 0.035,
                        fontWeight: '500',
                        color: isPositive ? '#10B981' : '#EF4444'
                    }}>
                        {isPositive ? '+' : ''}{variation}%
                    </Text>
                </View>
            </View>

            {/* Graphique */}
            <LineChart
                data={data.map(item => ({
                    value: item.value,
                }))}

                // Configuration du tracé
                areaChart
                width={chartWidth}
                height={chartHeight}
                curved
                isAnimated
                animationDuration={1500}
                thickness={3} // Légèrement plus épais pour un trait plus visible
                hideDataPoints={false}

                // Valeur maximale
                maxValue={Math.max(...data.map(item => item.value))}

                // Couleurs et remplissage du graphique
                color="#3b82f6"
                startFillColor="rgba(59, 130, 246, 0.3)"
                endFillColor="rgba(59, 130, 246, 0.0)"
                startOpacity={0.8}
                endOpacity={0.1}

                // Axes et styles de texte
                yAxisColor="#e5e7eb"
                xAxisColor="#e5e7eb"
                yAxisTextStyle={{
                    color: '#6b7280',
                    fontSize: Dimensions.get('window').width * 0.03,
                    fontWeight: '500'
                }}
                xAxisLabelTextStyle={{
                    color: '#6b7280',
                    fontSize: Dimensions.get('window').width * 0.025
                }}

                // Configuration des points de données
                dataPointsColor="#2563eb"
                dataPointsRadius={Dimensions.get('window').width * 0.015}
                showVerticalLines
                verticalLinesColor="#d1d5db"
                verticalLinesThickness={1}

                // Espacement et sections
                spacing={Dimensions.get('window').width * 0.15}
                yAxisOffset={Math.min(...data.map(item => item.value))}
                noOfSections={5}

                // Règles (grid lines) et indices
                hideRules={false}
                rulesType="dotted"  // Optez pour des lignes pointillées pour un look plus léger
                rulesColor="#d1d5db"
                showYAxisIndices
                yAxisIndicesColor="#d1d5db"
                yAxisIndicesWidth={1}
            />

        </View>
    );
};

export default BitcoinEvolutionChart;
