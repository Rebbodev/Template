import { existsSync, readFileSync, writeFileSync } from 'node:fs';

export class JsonData {
    /**
     * Use this to control json files more easily like a simple database!
     * @param path - enter the path starting from the procceses working directory
     */
    constructor(public path: string) {
        this.path = path;
    }

    /**
     * All data in the given class path will be returned and can be used as an object!
     */
    getAll(): object {
        const filePath = this.path.startsWith('/')
            ? process.cwd() + this.path
            : process.cwd() + `/${this.path}`;

        const checkFile = existsSync(filePath);

        if (!checkFile || !this.path.endsWith('.json'))
            throw new Error('File path does not exist or is not a JSON file');

        const readData = readFileSync(filePath).toString();

        return JSON.parse(readData);
    }

    getOne(name: string) {
        const object: any = this.getAll();

        return object[name];
    }

    addData(
        name: string,
        data:
            | string
            | string[]
            | number
            | number[]
            | object
            | object[]
            | boolean
            | null
    ) {
        const object: any = this.getAll();

        object[name] = data;

        const filePath = this.path.startsWith('/')
            ? process.cwd() + this.path
            : process.cwd() + `/${this.path}`;

        const redfineObject: object = object;

        const string = JSON.stringify(redfineObject);

        writeFileSync(filePath, string);
    }

    deleteData(name: string) {
        const object: any = this.getAll();

        delete object[name];

        const filePath = this.path.startsWith('/')
            ? process.cwd() + this.path
            : process.cwd() + `/${this.path}`;

        writeFileSync(filePath, JSON.stringify(object));
    }

    writeBlank(object: object) {
        const string_ = JSON.stringify(object);

        const filePath = this.path.startsWith('/')
            ? process.cwd() + this.path
            : process.cwd() + `/${this.path}`;

        writeFileSync(filePath, string_);
    }
}
