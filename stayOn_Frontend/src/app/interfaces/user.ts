export interface User {
    id: number;
    email: string;
    password: string;
    firstName: string;
    middleName: string | null;
    lastName: string;
    secondLastName: string | null;
    major: string;
    role: string;
    age: number;
}