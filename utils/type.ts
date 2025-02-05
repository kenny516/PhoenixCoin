export type CoursCrypto = {
    id: string;
    designation: string;
    name: string;
    coursActuel: number;
    dateCours: Date;
    priceChangePercentage24h: number;
    isFavorite?: boolean;
};

export type Crypto = {
    id: string,
    designation: string
};

export type ChartDataPoint = {
    value: number;
    date: string;
}

export type BitcoinEvolutionChartProps = {
    data?: ChartDataPoint[];
    title?: string;
    devise?: string;
    deviseSymbol?: string;
}