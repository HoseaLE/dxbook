import { connectToDatabase, handeId } from "@utils/mongodb";
import Layout from "@components/layout";
import ListItem from "@components/listItem";
import Link from "next/link";
import styles from "./index.less";
import config from "@config/config";
import { Affix } from "antd";

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
            <Affix offsetTop={0}>
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
                            <a>
                                更多
                            </a>
                        </Link>
                    </div>
                </div>
            </Affix>
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
            <br />
        </Layout>
    );
}

export async function getStaticProps() {
    const { db } = await connectToDatabase();
    const category = db.collection("category");
    const book = db.collection("book");

    const list = await category.find({}).toArray();

    let ls = handeId(list);

    const needs = ["建筑", "机械", "材料", "食品"];
    ls = ls.filter((item) => needs.includes(item.title));

    let bookList = await book
        .find({ "cate-title": "机械书籍" })
        .sort({ _id: -1 })
        .skip(40)
        .limit(20)
        .toArray();
    bookList = handeId(bookList);
    return {
        props: { cateList: ls, bookList },
    };
}
