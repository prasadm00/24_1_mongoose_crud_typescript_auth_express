
/*
import { IUserDocument, IUserModel } from "./users.types";

// Check for the existence of an entry 
// and if it is not available, create one
export async function findOneOrCreate(
    this: IUserModel,
    {
        firstName,
        lastName,
        age,
        gender,
    }: {
        firstName: string; lastName: string; age: number;
        gender: string; department: string
    }
): Promise<IUserDocument> {
    const employeeRecord = await this.findOne({
        firstName,
        lastName, age, gender
    });
    if (employeeRecord) {
        return employeeRecord;
    } else {
        return this.create({
            firstName, lastName,
            age, gender
        });
    }
}
*/