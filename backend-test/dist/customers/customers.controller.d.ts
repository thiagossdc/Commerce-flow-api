import { CustomersService } from './customers.service';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
export declare class CustomersController {
    private readonly customersService;
    constructor(customersService: CustomersService);
    create(createCustomerDto: CreateCustomerDto): Promise<import("./schemas/customer.schema").Customer>;
    findAll(): Promise<import("./schemas/customer.schema").Customer[]>;
    findOne(id: string): Promise<import("./schemas/customer.schema").Customer>;
    update(id: string, updateCustomerDto: UpdateCustomerDto): Promise<import("./schemas/customer.schema").Customer>;
    remove(id: string): Promise<import("./schemas/customer.schema").Customer>;
}
