import { NotFoundException } from "@nestjs/common";
export declare class VehicleNotFoundException extends NotFoundException {
    constructor(plate: string);
}
