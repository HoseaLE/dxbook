import { connectToDatabase } from "@utils/mongodb";
import { handRes } from '@utils/middleware';

export default async function handler(req, res) {
    const { query = {} } = req;
    const { id = '', page = 1 } = query;
    const { db } = await connectToDatabase();
    const book = db.collection('book');

    const listFn = async () => {
        return await book
            .find({ "cate-slug": id })
            .sort({ _id: -1 })
            .skip((page - 1) * 10)
            .limit(10)
            .toArray();
    }

    const numFn = async () => {
        return await book
            .find({ "cate-slug": id })
            .count();
    }

    const [bookList, total = 0] = await Promise.all([listFn(), numFn()])

    handRes(res, {
        status: 0,
        data: {
            list: bookList,
            total
        }
    })
}
