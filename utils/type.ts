export type Profil = {
    id: string;
    nom: string;
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
    isFavorite?: boolean;
};

export type Crypto = {
    id: string,
    designation: string,
    isFavorite?: boolean,
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
    dateAction: string;
    cours: number;
    quantite: number;
    profil: string;
    crypto: string;
    typeTransaction: string;
}

export type Portefeuille = {
    profil: Profil;
    transactions: Transaction[];
}

export type Historique_fond = {
    id: string,
    date_transaction: string;
    numCarteBancaire: string;
    montant: number;
    idProfil: string;
    idTypeAction: string;
}