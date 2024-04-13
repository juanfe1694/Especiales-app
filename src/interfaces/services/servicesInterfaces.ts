import { Address } from "../locations/locationInterfaces";

export interface scheduleServiceCompany {
    origin: Address;
    destination: Address;
    pickUpDate: Date;
    returnDate?: Date | undefined;
    pickUpTime: Date;
    returnTime?: Date | undefined; 
    numberOfPassengers: number;
    costCenter?: string | undefined;
    SAPCode?: string;
    requestState?: string;
    requester?: bigint;
    requesterName?: string;
    serviceId?: string;
    driverName?: string | Driver;
    driver?: Driver;
    vehicle?: string | Vehicle;
    valueThird?: number;
    valueCompany?: number;
    serviceNumber: number;
}

export interface serviceCompanyModel {
    origin: Address;
    destination: Address;
    pickUpDate: string;
    returnDate?: string | Date | undefined;
    pickUpTime: string;
    returnTime?: string | Date | undefined; 
    numberOfPassengers: number;
    costCenter?: string | undefined;
    SAPCode?: string;
    requestState?: string;
    requester?: bigint;
    serviceId?: string;
    driverName?: string | Driver;
    driver?: Driver;
    vehicle?: string | Vehicle;
}

export enum serviceState {
    Pendiente = 'Pendiente',
    Confirmado = 'Confirmado',
    Rechazado = 'Rechazado',
    Completado = 'Completado'
}

export interface Vehicle {
    label: string;
    tipo: string;
}

export interface Driver {
    id: string;
    label: string;
}

export interface ServiceTabsProps {
    items: ServiceTabsItems[];
    action: (itemSelected: string) => void;
}

export interface ServiceTabsItems {
    label: string;
    notification: boolean;
}