import { connectToDatabase, handeId, ObjectId } from "@utils/mongodb";
import Layout from "@components/layout";
import Contact from "@components/contact";
import Link from "next/link";
import styles from "./index.less";
import { Breadcrumb } from "antd";
import marked from "marked";
import { useRouter } from "next/router";
import config from "@config/config";

const { siteName } = config;
const { NEXT_PUBLIC_ROUTE_BASE } = process.env;

interface Props {
    data: null | { [key: string]: any };
    pre: null | { [key: string]: any };
    next: null | { [key: string]: any };
}

export default function Home({ data, pre, next }: Props) {
    const router = useRouter();
    if (!data && typeof window === "object") {
        router.push("/404");
    }

    const seo = {
        title: `${data.title}、${data.title}pdf下载 - ${siteName}`,
        description: data.description,
        openGraph: {
            url: `${NEXT_PUBLIC_ROUTE_BASE}/book/${data._id}`,
            title: `${data.title}、${data.title}pdf下载 - ${siteName}`,
            description: data.description,
        },
    };

    return (
        <Layout seo={seo}>
            {data && (
                <div className={styles.contanier}>
                    <div className={styles.head}>
                        <Breadcrumb>
                            <Breadcrumb.Item>
                                <Link href={`/`}>
                                    <a>首页</a>
                                </Link>
                            </Breadcrumb.Item>
                            <Breadcrumb.Item>
                                <Link href={`/category/${data["cate-slug"]}`}>
                                    <a>{data["cate-title"]}</a>
                                </Link>
                            </Breadcrumb.Item>
                            <Breadcrumb.Item>{data.title}</Breadcrumb.Item>
                        </Breadcrumb>
                    </div>

                    <div className={styles.left}>
                        <h2>{data.title}</h2>
                        <div
                            dangerouslySetInnerHTML={{
                                __html: data.content && marked(data.content),
                            }}
                        ></div>
                        <Contact style={{ fontWeight: 700 }} />

                        <div style={{ marginTop: 10 }}>
                            <span>上一篇：</span>
                            {pre && (
                                <Link href={`/book/${pre._id}`}>
                                    <a>{pre.title}</a>
                                </Link>
                            )}
                        </div>
                        <div>
                            <span>下一篇：</span>
                            {next && (
                                <Link href={`/book/${next._id}`}>
                                    <a>{next.title}</a>
                                </Link>
                            )}
                        </div>
                    </div>

                    <br />
                </div>
            )}
        </Layout>
    );
}

export async function getServerSideProps(context) {
    const { params } = context;
    const { id } = params;
    const { db } = await connectToDatabase();
    const book = db.collection("book");
    const getBook = async () =>
        await book.find({ _id: new ObjectId(id) }).toArray();

    // 上一篇 下一篇
    const getPre = async () => {
        return await book
            .find({ _id: { $gt: new ObjectId(id) } })
            .project({title: 1})
            .sort({ _id: 1 })
            .limit(1)
            .toArray();
    };
    const getNext = async () => {
        return await book
            .find({ _id: { $lt: new ObjectId(id) } })
            .project({title: 1})
            .sort({ _id: -1 })
            .limit(1)
            .toArray();
    };
    let pre = null;
    let next = null;
    const res = await Promise.all([getPre(), getNext(), getBook()]);

    if (res[0] && res[0].length > 0) {
        pre = handeId(res[0])[0];
    }
    if (res[1] && res[1].length > 0) {
        next = handeId(res[1])[0];
    }

    let bookList = res[2] || [];

    bookList = handeId(bookList);
    const data = bookList[0];
    if (data) {
        const str = data.content;

        const len = str.length;
        let newstr = "";
        const keyword = ` ${data.title}pdf `;
        if (len > 100) {
            newstr = str.slice(0, 80) + keyword + str.slice(50) + keyword;
        }
        data.content = newstr;
    }
    return {
        props: {
            data: data ? data : null,
            pre,
            next,
        },
    };
}
