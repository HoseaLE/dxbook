declare module '*.less' {
    const content: { [className: string]: string };
    export default content;
}


declare namespace NodeJS {
    interface MongoCole {
        db: { collection: (key: string) => any, [key: string]: any },
        client: any
    }

    export interface Global {
        mongo: {
            conn: MongoCole | null,
            promise: Promise<any>
        }
    }
}