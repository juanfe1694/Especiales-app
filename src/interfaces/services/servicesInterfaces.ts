export interface scheduleServiceCompany {
    origin: string;
    destination: string;
    pickUpDate: Date;
    returnDate: Date | undefined;
    pickUpTime: Date;
    returnTime: Date | undefined; 
    numberOfPassengers: number;
    costCenter?: string | undefined;
    SAPCode?: string;
    requestState?: string;
    requester?: bigint;
    requesterName?: string;
    serviceId?: string;
    driverName?: string;
    vehicle?: string;
}

export interface serviceCompanyModel {
    origin: string;
    destination: string;
    pickUpDate: string;
    returnDate: string | Date | undefined;
    pickUpTime: string;
    returnTime: string | Date | undefined; 
    numberOfPassengers: number;
    costCenter?: string | undefined;
    SAPCode?: string;
    requestState?: string;
    requester?: bigint;
    serviceId?: string;
    driverName?: string;
    vehicle?: string;
}

export enum serviceState {
    Pendiente = 'Pendiente',
    Confirmado = 'Confirmado',
    Cancelado = 'Cancelado'
}