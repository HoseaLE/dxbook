import { connectToDatabase, handeId } from "@utils/mongodb";
import Layout from "@components/layout";
import ListItem from "@components/listItem";
import Link from "next/link";
import styles from "./index.less";
import config from "@config/config";

const { siteName } = config;

interface Props {
    cateList: any[];
    bookList: any[];
}

export default function Home({ cateList, bookList }: Props) {
    const seo = {
        title: `${siteName} 书籍汇总、书籍收藏、pdf代下载`,
    };
    return (
        <Layout seo={seo}>
            <div className={styles.head}>
                <div style={{ padding: 10 }}>
                    <Link href={`/`}>
                        <a>首页</a>
                    </Link>
                </div>
                {cateList.map((item) => {
                    return (
                        <div className={styles.nav_item}>
                            <Link href={`/category/${item["cate-slug"]}`}>
                                <a>{item.title}</a>
                            </Link>
                        </div>
                    );
                })}
                <div className={styles.nav_item}>
                    <Link href={`/category`}>
                        <a style={{color: '#eee', cursor: 'default'}}>更多</a>
                    </Link>
                </div>
            </div>
            <div className={styles.content}>
                {bookList.map((item) => {
                    return (
                        <ListItem
                            style={{ marginBottom: 20 }}
                            title={
                                <Link href={`/book/${item._id}`}>
                                    <a>{item.title}</a>
                                </Link>
                            }
                            description={item.description}
                        />
                    );
                })}
            </div>
        </Layout>
    );
}

export async function getStaticProps() {
    const { db } = await connectToDatabase();
    const category = db.collection("category");
    const book = db.collection("book");

    const list = await category.find({}).toArray();

    let ls = handeId(list);

    const needs = ["建筑书籍", "机械书籍", "材料书籍", "食品书籍"];
    ls = ls.filter((item) => needs.includes(item.title));

    let bookList = await book
        .find({ "cate-title": "机械书籍" })
        .sort({ _id: -1 })
        .limit(30)
        .toArray();
    bookList = handeId(bookList);
    return {
        props: { cateList: ls, bookList },
    };
}
