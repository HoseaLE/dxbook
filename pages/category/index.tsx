import { connectToDatabase, handeId } from "@utils/mongodb";
import Layout from "@components/layout";
import Link from "next/link";
import styles from "./index.less";
import { Breadcrumb, Tag } from "antd";
import config from "@config/config";
const { siteName } = config;

interface Props {
    data: null | { [key: string]: any };
}

export default function Home({ data }: Props) {
    const seo = {
        title: `网站导航 -- ${siteName}`,
    };
    return (
        <Layout seo={seo}>
            <div className={styles.head}>
                <Breadcrumb>
                    <Breadcrumb.Item>
                        <Link href={`/`}>
                            <a>首页</a>
                        </Link>
                    </Breadcrumb.Item>
                    <Breadcrumb.Item>分类</Breadcrumb.Item>
                </Breadcrumb>
            </div>
            <div className={styles.main}>
                {data.map((item) => {
                    return (
                        <Tag style={{ marginBottom: 8 }}>
                            <Link href={`/category/${item["cate-slug"]}`}>
                                <a>{item.title}</a>
                            </Link>
                        </Tag>
                    );
                })}
            </div>
        </Layout>
    );
}

export async function getStaticProps() {
    try {
        const { db } = await connectToDatabase();
        const book = db.collection("category");
        let cateList = await book.find({}).toArray();
        cateList = handeId(cateList);

        return {
            props: {
                data: cateList || [],
            },
        };
    } catch (error) {
        return {
            props: {
                data: [],
            },
        };
    }
}
