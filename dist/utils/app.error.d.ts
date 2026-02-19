export declare class AppError extends Error {
    statusCode: number;
    errors?: Record<string, string[]>;
    isOperational: boolean;
    constructor(message: string, statusCode?: number, errors?: Record<string, string[]>);
}
//# sourceMappingURL=app.error.d.ts.map