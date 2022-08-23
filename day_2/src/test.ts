abstract class Employee {
    constructor(private firstName: string, private lastName: string) {
    }

    get fullName(): string {
        return `${this.firstName} ${this.lastName}`;
    }
    compensationStatement(): string {
        return `${this.fullName} makes a month.`;
    }
}