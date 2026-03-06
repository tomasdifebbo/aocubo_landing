export interface PropertyUnit {
    id: string; // Add id to track specific unit
    price: number;
    bedrooms: number;
    bathrooms: number;
    livingArea: number;
    parkingSlots: number;
    attachments?: PropertyAttachment[]; // Add attachments for unit-specific images
    type: string; // Dynamic type (Studio, Apartamento, Duplex, etc.)
}

export interface PropertyAttachment {
    url: string;
    type?: string;
}

export interface PropertyAddress {
    street?: string;
    streetNumber?: string;
    neighborhood: string;
    city?: string;
    state?: string;
}

export interface PropertyDeveloper {
    name: string;
    logo?: string;
}

/** Raw shape returned by api.aocubo.com */
export interface RawProperty {
    id: string;
    name: string;
    slug: string;
    description?: string;
    constructionStatus: "UNDER_CONSTRUCTION" | "NEW_DEVELOPMENT" | "READY" | string;
    attachments: PropertyAttachment[];
    address: PropertyAddress;
    units: PropertyUnit[];
    developer?: PropertyDeveloper;
    characteristics?: string[];
}

export interface RawPropertiesResponse {
    content: RawProperty[];
    totalElements: number;
    totalPages: number;
    number: number; // current page (0-indexed)
    size: number;
}

/** Normalised shape returned by our API */
export interface Property {
    id: string;
    title: string;
    slug: string;
    description?: string;
    price: number;
    priceFormatted: string;
    neighborhood: string;
    bedrooms: number;
    bathrooms: number;
    area: number;
    parkingSlots: number;
    status: "Pronto" | "Em obras" | "Breve lançamento";
    images: string[];
    url: string;
    developer?: string;
    characteristics: string[];
    units: PropertyUnit[];
    type: string;
}

export interface PropertiesResponse {
    properties: Property[];
    total: number;
    page: number;
    totalPages: number;
}
