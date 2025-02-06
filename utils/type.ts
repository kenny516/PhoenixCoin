export type Profil = {
    id: string;
    email: string;
    fondActuel: number;
}


export type TypeTransaction = {
    id: string;
    designation: string;
}

export type TypeAction = {
    id: string;
    designation: string;
}

export type CoursCrypto = {
    id: string;
    designation: string;
    name: string;
    coursActuel: number;
    dateCours: string;
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

export type Transaction = {
    id: string;
    date_action: string;
    cours: number;
    quantite: number;
    profil: Profil;
    crypto: Crypto;
    transaction: TypeTransaction;
}

export type Portefeuille = {
    profil: Profil;
    transactions: Transaction[];
}