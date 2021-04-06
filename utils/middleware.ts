export function handRes(res, data: object);
export function handRes(res, status: number | object, data?) {
    if (data === undefined) {
        res.status(200).json(status);
        return
    }
    res.status(status).json(data);
}